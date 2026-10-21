import os
import logging
from typing import Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from dotenv import load_dotenv
load_dotenv()

from backend.rag_service import rag_service
from backend.email_service import send_refund_email

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nexacart_api")

app = FastAPI(
    title="NexaCart AI Customer Support API",
    description="Backend API connecting Next.js frontend to Live Google Sheets RAG & Refund processing.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, description="Customer question to ask the AI assistant")
    session_id: Optional[str] = Field("web-session", description="Optional chat session identifier")


class RefundRequest(BaseModel):
    order_id: str = Field(..., min_length=1, description="Order ID (e.g., ORD-102)")
    email: str = Field(..., min_length=3, description="Customer email address to receive decision notification")
    reason: str = Field(..., min_length=1, description="Reason for refund request")
    description: Optional[str] = Field("", description="Optional details or context")

@app.on_event("startup")
async def startup_event():
    """Initializes RAG embeddings, vector store, and live Google Sheets on startup."""
    logger.info("Initializing NexaCart RAG Service...")
    try:
        rag_service.initialize()
        logger.info("NexaCart RAG Service ready.")
    except Exception as e:
        logger.error(f"Failed to initialize RAG Service on startup: {e}")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "initialized": rag_service.is_initialized,
        "orders_count": len(rag_service.orders_cache),
        "products_count": len(rag_service.products_cache),
    }

from backend.sheets_logger import sheets_logger

@app.post("/chat")
async def chat_endpoint(payload: ChatRequest):
    """Answers customer questions grounded in company policy, product catalog, and order data."""
    question = payload.question.strip()
    session_id = payload.session_id or "web-session"
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    try:
        import anyio
        answer = await anyio.to_thread.run_sync(rag_service.rag_query, question)

        # Log customer interaction to Google Sheets in background
        try:
            await anyio.to_thread.run_sync(
                sheets_logger.log_chat,
                session_id,
                question,
                answer,
                "NexaCart AI Chatbot"
            )
        except Exception as log_err:
            logger.warning(f"Background chat logging error: {log_err}")

        return {
            "success": True,
            "answer": answer
        }
    except Exception as e:
        logger.error(f"Error processing chat question: {e}", exc_info=True)
        return {
            "success": False,
            "answer": "We are experiencing a temporary issue retrieving live support data. Please try again shortly."
        }


@app.post("/refund")
async def refund_endpoint(payload: RefundRequest):
    """
    Evaluates refund request against store policy rules dynamically retrieved from RAG,
    checks live Google Sheet for order details, and sends an automated decision email.
    """
    order_id = payload.order_id.strip()
    customer_email = payload.email.strip()
    reason = payload.reason.strip()
    description = (payload.description or "").strip()

    if not order_id:
        raise HTTPException(status_code=400, detail="Order ID is required.")
    if not customer_email:
        raise HTTPException(status_code=400, detail="Customer email is required.")
    if not reason:
        raise HTTPException(status_code=400, detail="Refund reason is required.")

    logger.info(f"Processing refund request for Order: {order_id}, Email: {customer_email}")

    import anyio

    # 1. Evaluate refund dynamically against policy retrieved via RAG
    eval_result = await anyio.to_thread.run_sync(
        rag_service.evaluate_refund_policy,
        order_id,
        reason,
        description
    )

    decision = eval_result["decision"]
    explanation = eval_result["reason"]
    order_details = eval_result["order"]

    # 2. Use AI Agent to draft and dispatch personalized email to the customer's email
    email_status = await anyio.to_thread.run_sync(
        send_refund_email,
        customer_email,
        order_id,
        decision,
        explanation,
        order_details,
        reason,
        description
    )

    # 3. Update 'Status' column in Sheet1 of Google Sheets and update memory cache
    new_order_status = "Refund Approved" if decision.lower() == "accepted" else "Refund Rejected"
    try:
        await anyio.to_thread.run_sync(
            sheets_logger.update_order_status,
            order_id,
            new_order_status
        )
        if order_id in rag_service.orders_cache:
            rag_service.orders_cache[order_id]["Status"] = new_order_status
    except Exception as update_err:
        logger.warning(f"Error updating status in Sheet1: {update_err}")

    # 4. Log full audit record to 'Refund_Requests' tab in Google Sheets
    try:
        email_sent_label = "Sent via Gmail OAuth" if email_status.get("method") == "gmail_oauth" else ("Sent via SMTP" if email_status.get("method") == "smtp" else "Simulated")
        await anyio.to_thread.run_sync(
            sheets_logger.log_refund,
            order_id,
            customer_email,
            reason,
            description,
            decision,
            explanation,
            order_details,
            email_sent_label
        )
    except Exception as log_err:
        logger.warning(f"Background refund logging error: {log_err}")


    return {
        "success": True,
        "order_id": order_id,
        "decision": decision,
        "message": explanation,
        "order": order_details,
        "email_sent": email_status.get("sent", False),
        "email_draft": email_status.get("email_draft", {}),
        "email_details": email_status
    }



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
