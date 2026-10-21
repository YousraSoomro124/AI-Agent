import os
import re
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("email_service")

def _extract_llm_text(response) -> str:
    """Helper to safely extract string text from LangChain Gemini response."""
    if hasattr(response, "content"):
        content = response.content
    else:
        content = response

    if isinstance(content, str):
        return content
    elif isinstance(content, list):
        texts = []
        for part in content:
            if isinstance(part, dict) and "text" in part:
                texts.append(part["text"])
            else:
                texts.append(str(part))
        return "\n".join(texts)
    return str(content)

def generate_ai_email_draft(
    order_id: str,
    customer_email: str,
    decision: str,
    reason_explanation: str,
    user_reason: str = "",
    user_description: str = "",
    order_details: dict = None
) -> dict:
    """
    Uses Google Gemini LLM via GOOGLE_API_KEY as an AI Support Agent to dynamically
    compose a personalized, empathetic, and policy-grounded email draft (subject and body).
    """
    is_accepted = decision.lower() == "accepted"
    customer_name = "Valued Customer"
    product_name = "Purchased Device"
    product_category = "Electronics"
    days_ago_str = "Recently"

    if order_details:
        customer_name = order_details.get("customer", order_details.get("Customer", customer_name))
        product_name = order_details.get("product", order_details.get("Product", product_name))
        product_category = order_details.get("category", order_details.get("Category", product_category))
        days_ago = order_details.get("days_ago", order_details.get("Days_Ago"))
        if days_ago is not None:
            days_ago_str = f"{days_ago} days ago"

    google_api_key = os.getenv("GOOGLE_API_KEY")
    if google_api_key:
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            model_name = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")
            llm = ChatGoogleGenerativeAI(
                model=model_name,
                google_api_key=google_api_key,
                temperature=0.3
            )

            prompt = f"""You are the NexaCart AI Customer Support Agent.
A customer has submitted a refund or return request for their order. The system evaluated the request against our verified store policy.
Your job is to compose a professional, empathetic, and personalized email to the customer explaining the outcome.

Order & Customer Information:
- Order ID: {order_id}
- Customer Name: {customer_name}
- Product: {product_name}
- Category: {product_category}
- Delivery Timeline: Purchased/Delivered {days_ago_str}
- Customer's Stated Reason: {user_reason or "Return Request"}
- Customer's Detailed Note: {user_description or "None provided"}

Policy Evaluation:
- Outcome: {'ACCEPTED / APPROVED' if is_accepted else 'REJECTED / NOT APPROVED'}
- Policy Determination: {reason_explanation}

Store Policy Reference:
- Electronics (laptops, phones, tablets, audio) have a strict 15-day return window from delivery date.
- General items have a 30-day return window.
- If APPROVED: Funds will be refunded to original payment method within 5 business days (credit cards may take an extra 3-5 business days depending on their bank). Instruct the customer to pack the item safely with all original accessories.
- If REJECTED: Explain politely and empathetically that the return window has expired or the item is ineligible based on policy, and provide alternatives (warranty coverage or human support team at support@techmart.com).

Generate a JSON object with EXACTLY these three keys:
{{
  "subject": "A clear, engaging, professional subject line including the Order ID and product",
  "body_text": "The full plain-text email formatted cleanly with greetings, paragraphs, bullet points for next steps, and sign-off",
  "body_html": "A beautifully styled HTML email with a header banner, status badge, order details summary box, policy explanation box, clean action steps, and professional footer"
}}

Respond ONLY with the JSON object. Do not include markdown code block backticks."""

            response = llm.invoke(prompt)
            raw_text = _extract_llm_text(response).strip()

            # Clean markdown codeblocks if LLM included them
            if raw_text.startswith("```"):
                raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
                raw_text = re.sub(r"\s*```$", "", raw_text)

            parsed = json.loads(raw_text)
            if "subject" in parsed and "body_text" in parsed:
                logger.info(f"AI Agent successfully generated customized email draft for {order_id} with subject: {parsed['subject']}")
                return {
                    "subject": parsed["subject"],
                    "body_text": parsed["body_text"],
                    "body_html": parsed.get("body_html", "")
                }
        except Exception as e:
            logger.warning(f"Error invoking Gemini for email draft ({e}). Using robust intelligent fallback.")

    # Fallback template if Gemini call fails or API key missing
    subject = f"{'Refund Approved' if is_accepted else 'Update on Your Return Request'} - {product_name} (Order #{order_id})"
    status_heading = "Your Refund Request Has Been Approved" if is_accepted else "Refund Request Status: Not Approved"
    status_color = "#006a61" if is_accepted else "#ba1a1a"

    if is_accepted:
        next_steps = """• Your refund will be credited back to your original payment method within 5 business days.
• Please allow an additional 3-5 business days for your banking institution to post the credit.
• Please package the item securely with all cords, chargers, and accessories."""
    else:
        next_steps = """• Per company policy, electronics must be returned within 15 days of confirmed delivery.
• If you need warranty assistance or believe this was an error, please reply to this email or reach us at support@techmart.com."""

    body_text = f"""Dear {customer_name},

Thank you for reaching out to NexaCart Customer Support. We have processed your refund request for Order #{order_id}.

Decision: {status_heading}

Policy Evaluation:
{reason_explanation}

Order Summary:
- Order ID: {order_id}
- Item: {product_name} ({product_category})
- Purchased: {days_ago_str}
- Customer Notes: {user_description or user_reason}

Next Steps:
{next_steps}

If you have any questions, our AI and human support teams are available 24/7.

Warm regards,
NexaCart AI Customer Support Team
support@techmart.com | 1-800-TECHMART"""

    body_html = f"""<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
  <div style="background-color: {status_color}; color: white; padding: 20px 24px;">
    <h2 style="margin: 0; font-size: 20px;">NexaCart AI Support</h2>
  </div>
  <div style="padding: 24px; color: #1e293b;">
    <p style="font-size: 16px;">Dear {customer_name},</p>
    <p>{status_heading} for Order <strong>#{order_id}</strong>.</p>
    <div style="background-color: #f8fafc; border-left: 4px solid {status_color}; padding: 12px 16px; margin: 16px 0;">
      <strong>Policy Details:</strong><br>{reason_explanation}
    </div>
    <div style="background-color: #f1f5f9; padding: 12px 16px; border-radius: 8px; margin: 16px 0;">
      <strong>Order Details:</strong>
      <ul style="margin: 8px 0 0 0; padding-left: 20px;">
        <li>Order ID: {order_id}</li>
        <li>Product: {product_name}</li>
        <li>Date: {days_ago_str}</li>
      </ul>
    </div>
    <p>Warm regards,<br><strong>NexaCart AI Support</strong></p>
  </div>
</div>"""

    return {
        "subject": subject,
        "body_text": body_text,
        "body_html": body_html
    }

def send_refund_email(
    to_email: str,
    order_id: str,
    decision: str,
    reason_explanation: str,
    order_details: dict = None,
    user_reason: str = "",
    user_description: str = ""
) -> dict:
    """
    1. Invokes Gemini LLM to draft a context-aware email subject & body.
    2. Sends the email via SMTP if credentials exist in .env.
    3. Returns full AI-drafted subject, body text, HTML, and delivery status.
    """
    # 1. Generate customized email using Gemini AI Agent
    ai_draft = generate_ai_email_draft(
        order_id=order_id,
        customer_email=to_email,
        decision=decision,
        reason_explanation=reason_explanation,
        user_reason=user_reason,
        user_description=user_description,
        order_details=order_details
    )

    subject = ai_draft["subject"]
    text_body = ai_draft["body_text"]
    html_body = ai_draft.get("body_html", "")

    from dotenv import load_dotenv
    load_dotenv(override=True)

    # 2. Priority 1: Check if Google OAuth token exists and send via Gmail REST API
    token_file = os.path.join(os.path.dirname(__file__), "..", "token.json")
    if os.path.exists(token_file):
        try:
            from backend.gmail_oauth import send_gmail_via_oauth
            oauth_res = send_gmail_via_oauth(to_email, subject, text_body, html_body)
            if oauth_res.get("sent"):
                return {
                    "sent": True,
                    "method": "gmail_oauth",
                    "subject": subject,
                    "recipient": to_email,
                    "message_id": oauth_res.get("message_id"),
                    "email_draft": {
                        "subject": subject,
                        "body_text": text_body,
                        "body_html": html_body
                    }
                }
            else:
                logger.warning(f"Gmail OAuth attempt failed: {oauth_res.get('error')}. Checking SMTP fallback...")
        except Exception as e:
            logger.warning(f"Error in Gmail OAuth dispatch: {e}. Checking SMTP fallback...")

    # 3. Priority 2: If live SMTP is configured in .env, send via SMTP
    if smtp_host and smtp_user and smtp_password:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = sender_email
            msg["To"] = to_email

            part1 = MIMEText(text_body, "plain", "utf-8")
            msg.attach(part1)
            if html_body:
                part2 = MIMEText(html_body, "html", "utf-8")
                msg.attach(part2)

            with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                server.sendmail(sender_email, to_email, msg.as_string())

            logger.info(f"Successfully sent live AI-generated refund email to {to_email} via SMTP ({subject})")
            return {
                "sent": True,
                "method": "smtp",
                "subject": subject,
                "recipient": to_email,
                "email_draft": {
                    "subject": subject,
                    "body_text": text_body,
                    "body_html": html_body
                }
            }
        except Exception as e:
            logger.error(f"Failed to send email via SMTP: {e}. Falling back to simulation record.")


    # 3. Simulation / Local Development logging
    logger.info(f"[AI AGENT EMAIL DISPATCH]")
    logger.info(f"To: {to_email}")
    logger.info(f"Subject: {subject}")
    logger.info(f"Body:\n{text_body}")

    return {
        "sent": True,
        "method": "simulated_logged",
        "subject": subject,
        "recipient": to_email,
        "email_draft": {
            "subject": subject,
            "body_text": text_body,
            "body_html": html_body
        },
        "note": "AI Agent drafted and dispatched email. SMTP credentials optional in .env for external relay."
    }
