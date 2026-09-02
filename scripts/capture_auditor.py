import time
from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        page = b.new_page(viewport={"width": 1280, "height": 950})
        page.goto("http://localhost:5173/auth")
        page.wait_for_load_state("domcontentloaded")
        time.sleep(1)
        btn = page.query_selector("button:has-text('Quick Demo — Auditor')")
        if btn:
            btn.click()
            time.sleep(2)
        page.screenshot(path=r"C:\Users\HP\.gemini\antigravity-ide\brain\7283c711-6265-439f-99e4-808e6571bbc1\auditor_portal_hashchain.png")
        b.close()
        print("Auditor portal captured successfully!")

if __name__ == "__main__":
    main()
