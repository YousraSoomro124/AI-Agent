import os
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

logger = logging.getLogger("gmail_oauth")

SCOPES = [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.compose"
]

CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), "..", "credentials.json")
TOKEN_FILE = os.path.join(os.path.dirname(__file__), "..", "token.json")

def get_gmail_service():
    """
    Returns an authorized Gmail API service instance using token.json.
    Refreshes the token automatically if expired.
    """
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    if creds and creds.expired and creds.refresh_token:
        try:
            creds.refresh(Request())
            with open(TOKEN_FILE, "w") as token:
                token.write(creds.to_json())
            logger.info("Successfully refreshed Gmail OAuth token.")
        except Exception as e:
            logger.error(f"Failed to refresh Gmail OAuth token: {e}")
            creds = None

    if not creds or not creds.valid:
        return None

    return build("gmail", "v1", credentials=creds)

def send_gmail_via_oauth(to_email: str, subject: str, text_body: str, html_body: str = None) -> dict:
    """
    Sends an email using the authorized Gmail API service.
    """
    service = get_gmail_service()
    if not service:
        return {
            "sent": False,
            "error": "token.json not found or invalid. Please authorize first via python authorize_gmail.py",
            "method": "oauth_unauthorized"
        }

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["To"] = to_email

        part1 = MIMEText(text_body, "plain", "utf-8")
        msg.attach(part1)
        if html_body:
            part2 = MIMEText(html_body, "html", "utf-8")
            msg.attach(part2)

        raw_message = base64.urlsafe_b64encode(msg.as_bytes()).decode("utf-8")
        send_body = {"raw": raw_message}

        sent_msg = service.users().messages().send(userId="me", body=send_body).execute()
        message_id = sent_msg.get("id")
        logger.info(f"Successfully sent live email via Gmail OAuth API to {to_email} (ID: {message_id})")

        return {
            "sent": True,
            "method": "gmail_oauth",
            "message_id": message_id,
            "recipient": to_email,
            "subject": subject
        }
    except Exception as e:
        logger.error(f"Gmail OAuth send error: {e}")
        return {
            "sent": False,
            "error": str(e),
            "method": "gmail_oauth_error",
            "recipient": to_email
        }
