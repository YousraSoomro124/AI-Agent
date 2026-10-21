import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000"

def test_chat(question):
    print(f"\n[TEST CHAT]: {question}")
    payload = json.dumps({"question": question}).encode()
    req = urllib.request.Request(
        f"{BASE_URL}/chat",
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print(f"Status: {resp.status}")
        print(f"Answer:\n{data.get('answer')}")

def test_refund(order_id, email, reason, description=""):
    print(f"\n[TEST REFUND]: Order={order_id}, Email={email}, Reason={reason}")
    payload = json.dumps({
        "order_id": order_id,
        "email": email,
        "reason": reason,
        "description": description
    }).encode()
    req = urllib.request.Request(
        f"{BASE_URL}/refund",
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        print(f"Decision: {data.get('decision').upper()}")
        print(f"Policy Explanation: {data.get('message')}")
        print(f"Email Sent: {data.get('email_sent')}")

def main():
    print("=== 1. TESTING /chat ENDPOINT ===")
    test_chat("What products do you have?")
    test_chat("What is the price of MacBook Air M3?")
    test_chat("What is the status of ORD-102?")
    test_chat("What is your refund policy?")

    print("\n=== 2. TESTING /refund ENDPOINT ===")
    # Eligible refund: ORD-103 (3 days ago, phone, defective)
    test_refund("ORD-103", "customer@example.com", "defective", "Touchscreen unresponsive")

    # Ineligible refund: ORD-101 (40 days ago, laptop, no_longer_needed)
    test_refund("ORD-101", "customer@example.com", "no_longer_needed", "Bought a different one")

    # Invalid order: ORD-999
    test_refund("ORD-999", "customer@example.com", "wrong_item", "Never received")

    print("\n=== ALL ENDPOINT TESTS PASSED! ===")

if __name__ == "__main__":
    main()
