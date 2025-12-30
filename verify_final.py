from playwright.sync_api import sync_playwright

def verify_mood_font():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to home...")
            page.goto("http://localhost:3000")
            page.wait_for_selector("text=How are you feeling today?", timeout=10000)

            print("Clicking Anxiety...")
            page.click("text=Anxiety")

            # Wait for content to load
            # Look for the Urdu text container which now has font-urdu class
            # The class name is compiled by CSS modules or global CSS, but in Tailwind it appears as class="... font-urdu ..."
            # We wait for the Urdu text to appear.
            print("Waiting for content...")
            page.wait_for_selector(".font-urdu", timeout=30000)

            # Take screenshot
            print("Taking screenshot...")
            page.screenshot(path="/home/jules/verification/mood_final.png", full_page=True)
            print("Screenshot saved to /home/jules/verification/mood_final.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="/home/jules/verification/error_final.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_mood_font()
