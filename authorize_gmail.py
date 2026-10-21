import os
import sys
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

SCOPES = [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.compose"
]

CREDENTIALS_FILE = "credentials.json"
TOKEN_FILE = "token.json"

def main():
    if not os.path.exists(CREDENTIALS_FILE):
        print(f"Error: {CREDENTIALS_FILE} not found in current directory.", flush=True)
        return

    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing expired token...", flush=True)
            creds.refresh(Request())
        else:
            print("Opening browser for Google Sign-In...", flush=True)
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIALS_FILE,
                SCOPES
            )
            # Use fixed local port 8080 for clean redirect
            creds = flow.run_local_server(port=8080, open_browser=True)

        with open(TOKEN_FILE, "w") as token:
            token.write(creds.to_json())

    print("\nSUCCESS! Google OAuth authorization completed.", flush=True)
    print(f"Token saved to {TOKEN_FILE}.", flush=True)
    print("NexaCart AI Agent can now send real emails directly via your authorized Gmail account!", flush=True)

if __name__ == "__main__":
    main()
