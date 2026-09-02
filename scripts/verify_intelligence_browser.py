import time
import os
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:\Users\HP\.gemini\antigravity-ide\brain\7283c711-6265-439f-99e4-808e6571bbc1"

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 950})
        page = context.new_page()

        print("1. Opening /auth and clicking Quick Demo — Admin...")
        page.goto("http://localhost:5173/auth")
        page.wait_for_load_state("domcontentloaded")
        time.sleep(1)

        # Click Quick Demo — Admin (District Collector)
        admin_demo_btn = page.query_selector("button:has-text('Quick Demo — Admin')")
        if admin_demo_btn:
            admin_demo_btn.click()
            print("Clicked Quick Demo — Admin!")
        else:
            print("Quick Demo button not found, clicking Admin Login link...")
            page.click("a:has-text('Admin Login')")
            time.sleep(1)
            page.click("button:has-text('Quick Demo District Admin')")

        time.sleep(2)
        print("Current URL after admin login:", page.url)

        # Overview screenshot
        overview_path = os.path.join(ARTIFACT_DIR, "admin_overview_tab.png")
        page.screenshot(path=overview_path)
        print(f"Captured: {overview_path}")

        # Tab 2: Bottlenecks & Rebalancing
        print("2. Switching to Bottlenecks & Rebalancing tab...")
        page.click("button:has-text('Bottlenecks & Rebalancing')")
        time.sleep(1.5)
        bottleneck_path = os.path.join(ARTIFACT_DIR, "admin_bottlenecks_rebalance.png")
        page.screenshot(path=bottleneck_path)
        print(f"Captured: {bottleneck_path}")

        # Tab 3: Capacity Simulator
        print("3. Switching to Capacity Simulator tab...")
        page.click("button:has-text('Capacity Simulator')")
        time.sleep(1.5)
        sim_path = os.path.join(ARTIFACT_DIR, "admin_capacity_simulator.png")
        page.screenshot(path=sim_path)
        print(f"Captured: {sim_path}")

        # Tab 4: No-Show Intelligence
        print("4. Switching to No-Show Intelligence tab...")
        page.click("button:has-text('No-Show Intelligence')")
        time.sleep(1.5)
        noshow_path = os.path.join(ARTIFACT_DIR, "admin_noshow_intelligence.png")
        page.screenshot(path=noshow_path)
        print(f"Captured: {noshow_path}")

        # Tab 5: Disputes & Evidence
        print("5. Switching to Disputes & Evidence tab...")
        page.click("button:has-text('Disputes & Evidence')")
        time.sleep(1.5)
        evidence_btn = page.query_selector("button:has-text('View Evidence Pack')")
        if evidence_btn:
            print("Opening Evidence Pack modal...")
            evidence_btn.click()
            time.sleep(1.5)
            evidence_path = os.path.join(ARTIFACT_DIR, "grievance_evidence_pack_modal.png")
            page.screenshot(path=evidence_path)
            print(f"Captured: {evidence_path}")
            # Close modal
            close_btn = page.query_selector("div.fixed button:has-text('✕')") or page.query_selector("div.fixed button:has(svg.lucide-x)")
            if close_btn:
                close_btn.click()
                time.sleep(0.5)

        # Tab 6: Audit Integrity
        print("6. Switching to Audit Integrity tab...")
        page.click("button:has-text('Audit Integrity')")
        time.sleep(1.5)
        verify_btn = page.query_selector("button:has-text('VERIFY AUDIT INTEGRITY')")
        if verify_btn:
            print("Clicking VERIFY AUDIT INTEGRITY...")
            verify_btn.click()
            time.sleep(1.5)
        audit_path = os.path.join(ARTIFACT_DIR, "audit_integrity_verified.png")
        page.screenshot(path=audit_path)
        print(f"Captured: {audit_path}")

        # Now test Farmer Journey Timeline & Grievance Form
        print("7. Navigating to /auth to login as Farmer...")
        page.goto("http://localhost:5173/auth")
        page.wait_for_load_state("domcontentloaded")
        time.sleep(1)
        farmer_btn = page.query_selector("button:has-text('Quick Demo — Farmer')")
        if farmer_btn:
            farmer_btn.click()
            print("Clicked Quick Demo — Farmer!")
            time.sleep(2)

        print("Navigating to http://localhost:5173/farmer/track...")
        page.goto("http://localhost:5173/farmer/track")
        page.wait_for_load_state("domcontentloaded")
        time.sleep(2)
        page.evaluate("window.scrollTo(0, 400)")
        time.sleep(1)
        journey_path = os.path.join(ARTIFACT_DIR, "farmer_procurement_journey_timeline.png")
        page.screenshot(path=journey_path)
        print(f"Captured: {journey_path}")

        # Auditor Portal
        print("8. Navigating to http://localhost:5173/auditor...")
        page.goto("http://localhost:5173/auditor")
        page.wait_for_load_state("domcontentloaded")
        time.sleep(2)
        auditor_path = os.path.join(ARTIFACT_DIR, "auditor_portal_hashchain.png")
        page.screenshot(path=auditor_path)
        print(f"Captured: {auditor_path}")

        browser.close()
        print("\n✅ All 7 verification screenshots captured successfully!")

if __name__ == "__main__":
    run()
