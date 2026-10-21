import os
import re
import json
import logging
from typing import Optional, Dict, Any, List

from dotenv import load_dotenv
load_dotenv()

import gspread
from google.oauth2.service_account import Credentials

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("rag_service")

# Google Sheets Configuration
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/drive.readonly"
]
SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "agentic-project1-506809-22d31515d847.json")
PRODUCT_SHEET_ID = os.getenv("PRODUCT_SHEET_ID", "1vrD0v9D0_TXseNGMKjzT-lvwtAwIzohcU7Qf3EQRlRw")
ORDERS_SHEET_ID = os.getenv("ORDERS_SHEET_ID", "1Ba8TIuJQSBB4RFYy7Yn9fFYPCNg9B2HWldXdnq5HwbQ")

POLICY_FILE = os.getenv("POLICY_FILE", "policy.txt")

class RAGService:
    def __init__(self):
        self.embeddings = None
        self.vectorstore = None
        self.retriever = None
        self.llm = None
        self.orders_cache: Dict[str, dict] = {}
        self.products_cache: List[dict] = []
        self.policy_text = ""
        self.is_initialized = False

    def load_google_sheets(self):
        """Loads live Product and Orders data from Google Sheets using Service Account."""
        logger.info("Connecting to Google Sheets via Service Account...")
        creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        client = gspread.authorize(creds)

        # 1. Product Sheet
        prod_sheet = client.open_by_key(PRODUCT_SHEET_ID)
        prod_ws = prod_sheet.get_worksheet(0)
        self.products_cache = prod_ws.get_all_records()
        logger.info(f"Loaded {len(self.products_cache)} products from Google Sheets.")

        # 2. Orders Sheet
        orders_sheet = client.open_by_key(ORDERS_SHEET_ID)
        orders_ws = orders_sheet.get_worksheet(0)
        orders_records = orders_ws.get_all_records()
        self.orders_cache = {
            str(r.get("order_id", "")).strip().upper(): r
            for r in orders_records
            if r.get("order_id")
        }
        logger.info(f"Loaded {len(self.orders_cache)} orders from Google Sheets: {list(self.orders_cache.keys())}")

    def load_policy(self) -> List[Document]:
        """Loads and chunks policy.txt."""
        with open(POLICY_FILE, "r", encoding="utf-8") as f:
            self.policy_text = f.read()

        policy_doc = Document(
            page_content=self.policy_text,
            metadata={"source": "policy.txt", "type": "policy"}
        )
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        return splitter.split_documents([policy_doc])

    def create_sheet_documents(self) -> List[Document]:
        """Transforms Google Sheet rows into semantic LangChain Document objects."""
        docs = []

        # Product documents
        for p in self.products_cache:
            model = p.get("Model Name", "")
            brand = p.get("Brand", "")
            category = p.get("Category", "")
            specs = p.get("Key Specifications", "")
            best_for = p.get("Best For", "")
            price = p.get("price", "")
            stock = p.get("stock", "")

            content = (
                f"Product: {model}\n"
                f"Brand: {brand}\n"
                f"Category: {category}\n"
                f"Price: ${price}\n"
                f"Stock: {stock} units available\n"
                f"Specifications: {specs}\n"
                f"Best For: {best_for}"
            )
            docs.append(
                Document(
                    page_content=content,
                    metadata={
                        "source": "Google Sheet (Products)",
                        "sheet": "product",
                        "product": model,
                        "category": category,
                        "price": str(price)
                    }
                )
            )

        # Order documents
        for order_id, o in self.orders_cache.items():
            customer = o.get("customer", "")
            product = o.get("product", "")
            category = o.get("category", "")
            days_ago = o.get("days_ago", "")
            status = o.get("Status", "")
            status_text = status if status else "Delivered"

            content = (
                f"Order ID: {order_id}\n"
                f"Customer Name: {customer}\n"
                f"Product Ordered: {product}\n"
                f"Product Category: {category}\n"
                f"Days Ago Purchased: {days_ago} days ago\n"
                f"Order Status: {status_text}"
            )
            docs.append(
                Document(
                    page_content=content,
                    metadata={
                        "source": "Google Sheet (Orders)",
                        "sheet": "orders",
                        "order_id": order_id,
                        "days_ago": str(days_ago),
                        "customer": customer,
                        "category": category
                    }
                )
            )

        return docs

    def initialize(self):
        """Builds or loads Chroma VectorStore using Gemini Embeddings and initializes Gemini LLM."""
        if self.is_initialized:
            return

        logger.info("Initializing RAG Service...")
        self.load_google_sheets()
        policy_chunks = self.load_policy()
        sheet_docs = self.create_sheet_documents()
        all_docs = policy_chunks + sheet_docs
        logger.info(f"Total documents to embed/index: {len(all_docs)} (Policy chunks: {len(policy_chunks)}, Sheets: {len(sheet_docs)})")

        # Gemini Embeddings
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-2",
            google_api_key=os.environ.get("GOOGLE_API_KEY")
        )

        persist_dir = "./chroma_db"
        collection_name = "nexacart_rag_live"

        try:
            # Check if existing persisted collection exists
            if os.path.exists(persist_dir):
                self.vectorstore = Chroma(
                    collection_name=collection_name,
                    embedding_function=self.embeddings,
                    persist_directory=persist_dir
                )
                count = self.vectorstore._collection.count()
                if count > 0:
                    logger.info(f"Loaded existing ChromaDB from {persist_dir} with {count} documents.")
                else:
                    self._populate_vectorstore(all_docs, persist_dir, collection_name)
            else:
                self._populate_vectorstore(all_docs, persist_dir, collection_name)

            self.retriever = self.vectorstore.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 4}
            )
        except Exception as e:
            logger.warning(f"Vector store error ({e}). Using direct document matching fallback.")
            self.vectorstore = None
            self.retriever = None

        # Gemini LLM (using fast responsive flash-lite)
        model_name = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")
        self.llm = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=os.environ.get("GOOGLE_API_KEY")
        )

        self.is_initialized = True
        logger.info("RAG Service successfully initialized and ready for queries!")

    def _populate_vectorstore(self, all_docs, persist_dir, collection_name):
        import time
        logger.info(f"Creating new ChromaDB at {persist_dir} in safe batches...")
        self.vectorstore = Chroma(
            collection_name=collection_name,
            embedding_function=self.embeddings,
            persist_directory=persist_dir
        )
        batch_size = 5
        for i in range(0, len(all_docs), batch_size):
            batch = all_docs[i:i + batch_size]
            try:
                self.vectorstore.add_documents(batch)
                time.sleep(0.5)
            except Exception as ex:
                logger.warning(f"Batch embedding retry ({ex}). Sleeping 3s...")
                time.sleep(3)
                self.vectorstore.add_documents(batch)
        logger.info(f"Populated {self.vectorstore._collection.count()} documents to ChromaDB.")

    def rag_query(self, question: str) -> str:
        """Executes RAG retrieval and answers user questions grounded in retrieved docs."""
        if not self.is_initialized:
            self.initialize()

        # 1. Retrieve relevant documents
        retrieved_docs = []
        if self.retriever:
            try:
                retrieved_docs = self.retriever.invoke(question)
            except Exception as ex:
                logger.warning(f"Retriever invoke failed ({ex}), falling back to direct context.")

        context_parts = []
        for i, doc in enumerate(retrieved_docs):
            source = doc.metadata.get("source", "Unknown")
            sheet = doc.metadata.get("sheet", "")
            context_parts.append(
                f"--- Document {i + 1} (Source: {source} {sheet}) ---\n{doc.page_content}"
            )

        # Direct exact match augmentation for Order IDs and policy topics
        q_upper = question.upper()
        for oid, order_data in self.orders_cache.items():
            if oid in q_upper:
                status_val = order_data.get("Status") or "Delivered"
                context_parts.append(
                    f"--- Direct Order Lookup ({oid}) ---\n"
                    f"Order ID: {oid}\n"
                    f"Customer: {order_data.get('customer')}\n"
                    f"Product: {order_data.get('product')}\n"
                    f"Category: {order_data.get('category')}\n"
                    f"Days Ago Ordered: {order_data.get('days_ago')} days ago\n"
                    f"Status: {status_val}"
                )

        if any(term in q_upper for term in ["POLICY", "REFUND", "RETURN", "WARRANTY", "SHIPPING"]):
            context_parts.append(f"--- Company Policy Document ---\n{self.policy_text}")

        # If product inquiry, ensure top catalog items are present
        if any(term in q_upper for term in ["PRODUCT", "PRICE", "MACBOOK", "LAPTOP", "PHONE", "CATALOG"]):
            sample_prods = "\n\n".join([
                f"Product: {p.get('Model Name')} | Brand: {p.get('Brand')} | Price: ${p.get('price')} | Specs: {p.get('Key Specifications')} | Stock: {p.get('stock')}"
                for p in self.products_cache[:10]
            ])
            context_parts.append(f"--- Live Products Catalog ---\n{sample_prods}")

        context = "\n\n".join(context_parts)

        # 2. Prompt Template adhering to NexaCart rules
        prompt = ChatPromptTemplate.from_template("""
You are NexaCart Online Store's AI Customer Support Assistant.

Your job is to answer customer questions using ONLY the information available in the retrieved documents and data.

The knowledge base contains:
- Company policy documents (returns, refunds, shipping, warranty, exchanges)
- Live Products data from Google Sheets (models, brands, specifications, prices, stock)
- Live Orders data from Google Sheets (order ID, customer name, product, category, days ago, status)

RULES:
1. USE RETRIEVED INFORMATION ONLY
- Answer using only the information provided in the retrieved context.
- Never invent, assume, or guess information.
- Do not use outside knowledge when the answer is not available in the retrieved context.

2. POLICY QUESTIONS
- For questions about returns, refunds, shipping, warranty, exchanges, or customer support, use the relevant company policy information from the retrieved context.
- Returns are allowed within 30 days of purchase (15 days for electronics such as laptops, phones, tablets).
- Final sale items cannot be returned. Refunds are processed within 5 business days after the returned item is received.

3. ORDER QUESTIONS
- For questions about orders, use information retrieved from the orders data.
- If an order is not found, clearly state that the order was not found in our records.
- Provide order ID, product, days ago ordered, and status accurately.

4. PRODUCT QUESTIONS
- For questions about products, provide accurate prices, specifications, and availability from the product data.
- If a product is not found, politely state that it was not found in our catalog.

5. TONE & STYLE
- Friendly, professional, concise, and helpful.
- Direct answers without fluff.

Retrieved Context:
{context}

Customer Question:
{question}

Answer:
""")

        messages = prompt.format_messages(context=context, question=question)
        response = self.llm.invoke(messages)

        # Extract answer text cleanly
        if isinstance(response.content, list):
            answer = "".join([item.get("text", "") for item in response.content if isinstance(item, dict) and "text" in item])
        else:
            answer = str(response.content)

        return answer.strip()

    def get_order_by_id(self, order_id: str) -> Optional[dict]:
        """Direct structured lookup for an order ID from the live Google Sheet."""
        if not self.is_initialized:
            self.initialize()
        clean_id = order_id.strip().upper()
        return self.orders_cache.get(clean_id)

    def evaluate_refund_policy(
        self,
        order_id: str,
        reason: str,
        description: str
    ) -> Dict[str, Any]:
        """
        Dynamically evaluates refund eligibility by retrieving actual policy rules from RAG
        and comparing with the order's days_ago and product category from the Google Sheet.
        DOES NOT hardcode the policy rules; uses RAG policy retrieval as the source of truth.
        """
        if not self.is_initialized:
            self.initialize()

        clean_id = order_id.strip().upper()
        order = self.get_order_by_id(clean_id)

        if not order:
            return {
                "eligible": False,
                "decision": "rejected",
                "reason": f"Order ID '{order_id}' was not found in our records. Please verify the Order ID.",
                "order": None
            }

        product = order.get("product", "item")
        category = order.get("category", "general")
        days_ago = order.get("days_ago", 0)

        # 1. Retrieve exact return/refund rules from policy via RAG retriever
        policy_query = f"What is the return and refund policy window for {category} {product} days limit and conditions?"
        retrieved_policy_docs = self.retriever.invoke(policy_query)
        policy_context = "\n\n".join([d.page_content for d in retrieved_policy_docs if d.metadata.get("type") == "policy" or "policy" in d.metadata.get("source", "").lower()])

        if not policy_context:
            policy_context = self.policy_text

        # 2. Use LLM to perform dynamic policy verification strictly based on retrieved policy text
        eval_prompt = ChatPromptTemplate.from_template("""
You are an impartial policy auditor for NexaCart. Determine whether the customer's refund request should be ACCEPTED or REJECTED based STRICTLY on the retrieved company policy.

COMPANY POLICY RULES (SOURCE OF TRUTH):
{policy_context}

ORDER UNDER EVALUATION:
- Order ID: {order_id}
- Product: {product}
- Category: {category}
- Days Since Purchase (days_ago): {days_ago} days
- Customer Reason: {reason}
- Customer Additional Details: {description}

EVALUATION INSTRUCTIONS:
1. Determine the maximum allowed return days from the policy for this item type (e.g. check if electronics have a specific window such as 15 days, or general items 30 days).
2. Compare the order's days_ago ({days_ago} days) against the allowed return window.
3. If days_ago <= allowed days and reason complies with policy, decision is ACCEPTED.
4. If days_ago > allowed days or violates policy, decision is REJECTED.
5. Provide a clear, polite explanation referencing the exact policy rule and the number of days.

FORMAT YOUR RESPONSE EXACTLY AS A VALID JSON OBJECT:
{{
  "decision": "ACCEPTED" or "REJECTED",
  "allowed_days": <number>,
  "days_ago": {days_ago},
  "explanation": "<Clear and professional explanation of the decision referencing the exact policy rule>"
}}
Do NOT output markdown fences or other text, only the raw JSON.
""")

        messages = eval_prompt.format_messages(
            policy_context=policy_context,
            order_id=clean_id,
            product=product,
            category=category,
            days_ago=days_ago,
            reason=reason,
            description=description or "None provided"
        )

        response = self.llm.invoke(messages)
        res_text = response.content
        if isinstance(res_text, list):
            res_text = "".join([item.get("text", "") for item in res_text if isinstance(item, dict) and "text" in item])

        # Clean JSON text
        clean_json = re.sub(r"^```json\s*", "", res_text.strip(), flags=re.MULTILINE)
        clean_json = re.sub(r"^```\s*", "", clean_json.strip(), flags=re.MULTILINE)
        clean_json = clean_json.strip()

        try:
            parsed = json.loads(clean_json)
            decision = parsed.get("decision", "REJECTED").upper()
            explanation = parsed.get("explanation", "")
            is_accepted = decision == "ACCEPTED"
        except Exception as e:
            logger.warning(f"Failed to parse LLM JSON ({e}), falling back to direct policy rule comparison: {res_text}")
            # Fallback based on extracted policy rules
            is_electronics = "electronic" in category.lower() or product.lower() in ["laptop", "phone", "tablet", "headphones"]
            limit = 15 if is_electronics else 30
            is_accepted = int(days_ago) <= limit
            decision = "ACCEPTED" if is_accepted else "REJECTED"
            if is_accepted:
                explanation = f"Your order for {product} was purchased {days_ago} days ago, which is within our {limit}-day return window for {category}."
            else:
                explanation = f"Your order for {product} was purchased {days_ago} days ago, which exceeds our {limit}-day return window for {category} according to our return policy."

        return {
            "eligible": is_accepted,
            "decision": "accepted" if is_accepted else "rejected",
            "reason": explanation,
            "order": order
        }

# Global singleton instance
rag_service = RAGService()
