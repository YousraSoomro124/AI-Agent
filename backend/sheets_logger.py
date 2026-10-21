import os
import logging
from datetime import datetime
from typing import Optional, Dict, Any

import gspread
from google.oauth2.service_account import Credentials

logger = logging.getLogger("sheets_logger")

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "agentic-project1-506809-22d31515d847.json")
ORDERS_SHEET_ID = os.getenv("ORDERS_SHEET_ID", "1Ba8TIuJQSBB4RFYy7Yn9fFYPCNg9B2HWldXdnq5HwbQ")

REFUND_HEADERS = [
    "Timestamp",
    "Order ID",
    "Customer Name",
    "Customer Email",
    "Product Ordered",
    "Category",
    "Days Since Purchase",
    "Return Reason",
    "Customer Description",
    "Policy Decision",
    "AI Policy Determination Reason",
    "Email Notification Status"
]

CHAT_HEADERS = [
    "Timestamp",
    "Session ID",
    "Customer Question",
    "AI Assistant Response",
    "Source"
]

class SheetsLogger:
    def __init__(self):
        self.client = None
        self.spreadsheet = None
        self.refund_sheet = None
        self.chat_sheet = None
        self.is_initialized = False

    def initialize(self):
        if self.is_initialized:
            return

        try:
            if not os.path.exists(SERVICE_ACCOUNT_FILE):
                logger.warning(f"Service account file {SERVICE_ACCOUNT_FILE} not found. Sheets logging disabled.")
                return

            creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
            self.client = gspread.authorize(creds)
            self.spreadsheet = self.client.open_by_key(ORDERS_SHEET_ID)

            # 1. Initialize or create 'Refund_Requests' tab
            self.refund_sheet = self._get_or_create_worksheet("Refund_Requests", REFUND_HEADERS)

            # 2. Initialize or create 'Chat_Interactions' tab
            self.chat_sheet = self._get_or_create_worksheet("Chat_Interactions", CHAT_HEADERS)

            self.is_initialized = True
            logger.info("Google Sheets Logger initialized successfully with 'Refund_Requests' and 'Chat_Interactions' tabs.")
        except Exception as e:
            logger.error(f"Failed to initialize Google Sheets Logger: {e}")

    def _get_or_create_worksheet(self, title: str, headers: list):
        try:
            ws = self.spreadsheet.worksheet(title)
            logger.info(f"Existing worksheet '{title}' found.")
            # Ensure headers exist if sheet is empty
            if ws.row_count == 0 or not ws.row_values(1):
                ws.append_row(headers)
            return ws
        except gspread.exceptions.WorksheetNotFound:
            logger.info(f"Worksheet '{title}' not found. Creating new tab with clean headers...")
            ws = self.spreadsheet.add_worksheet(title=title, rows=100, cols=len(headers) + 2)
            ws.append_row(headers)
            return ws
        except Exception as e:
            logger.error(f"Error checking/creating worksheet '{title}': {e}")
            return None

    def log_refund(
        self,
        order_id: str,
        customer_email: str,
        reason: str,
        description: str,
        decision: str,
        policy_reason: str,
        order_details: Optional[Dict[str, Any]] = None,
        email_status: Optional[str] = "Sent"
    ) -> bool:
        """Appends a new refund evaluation record to the Refund_Requests sheet."""
        if not self.is_initialized:
            self.initialize()

        if not self.refund_sheet:
            logger.warning("Refund sheet not available for logging.")
            return False

        try:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            customer_name = "N/A"
            product_name = "N/A"
            category = "N/A"
            days_ago = "N/A"

            if order_details:
                customer_name = order_details.get("customer", order_details.get("Customer", "N/A"))
                product_name = order_details.get("product", order_details.get("Product", "N/A"))
                category = order_details.get("category", order_details.get("Category", "N/A"))
                days_ago = str(order_details.get("days_ago", order_details.get("Days_Ago", "N/A")))

            row = [
                timestamp,
                str(order_id).strip().upper(),
                str(customer_name),
                str(customer_email).strip(),
                str(product_name),
                str(category),
                f"{days_ago} days ago" if days_ago != "N/A" else "N/A",
                str(reason),
                str(description or "None provided"),
                str(decision).strip().upper(),
                str(policy_reason),
                str(email_status)
            ]

            self.refund_sheet.append_row(row)
            logger.info(f"Successfully logged refund request for order {order_id} to Google Sheets.")
            return True
        except Exception as e:
            logger.error(f"Failed to log refund request to Google Sheets: {e}")
            return False

    def log_chat(
        self,
        session_id: str,
        question: str,
        response: str,
        source: str = "Web AI Chatbot"
    ) -> bool:
        """Appends a customer chat interaction to the Chat_Interactions sheet."""
        if not self.is_initialized:
            self.initialize()

        if not self.chat_sheet:
            logger.warning("Chat sheet not available for logging.")
            return False

        try:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            row = [
                timestamp,
                str(session_id or "web-session"),
                str(question).strip(),
                str(response).strip(),
                str(source)
            ]

            self.chat_sheet.append_row(row)
            logger.info("Successfully logged customer chat interaction to Google Sheets.")
            return True
        except Exception as e:
            logger.error(f"Failed to log chat interaction to Google Sheets: {e}")
            return False

    def update_order_status(self, order_id: str, new_status: str) -> bool:
        """Updates the 'Status' column (Column F) in Sheet1 for the specified order_id."""
        if not self.is_initialized:
            self.initialize()

        if not self.spreadsheet:
            return False

        try:
            ws = self.spreadsheet.worksheet("Sheet1")
            cell = ws.find(order_id.strip().upper(), in_column=1)
            if cell:
                # Column 6 is 'Status'
                ws.update_cell(cell.row, 6, new_status)
                logger.info(f"Updated status of order {order_id} in Sheet1 (row {cell.row}) to '{new_status}'.")
                return True
            else:
                logger.warning(f"Order {order_id} not found in Sheet1 to update status.")
                return False
        except Exception as e:
            logger.error(f"Failed to update order status in Sheet1 for {order_id}: {e}")
            return False

# Global singleton instance
sheets_logger = SheetsLogger()

