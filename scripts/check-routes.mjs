import { chromium } from "playwright";

const routes = [
  ["#/", "Command Center"],
  ["#/intake", "Intake Router"],
  ["#/sales", "Sales Pipeline"],
  ["#/onboarding", "Onboarding"],
  ["#/projects", "Projects"],
  ["#/tasks", "Tasks"],
  ["#/admin", "Operations Admin"],
  ["#/communications", "Communications"],
  ["#/approvals", "Approvals"],
  ["#/triggers", "Triggers"],
  ["#/automation", "Automation Logs"],
  ["#/calendar", "Calendar"],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });

try {
  for (const [hash, expectedTitle] of routes) {
    await page.goto(`http://127.0.0.1:5173/${hash}`, { waitUntil: "networkidle" });
    const title = await page.getByTestId("text-page-title").textContent({ timeout: 5000 });
    const pageText = await page.locator("body").innerText();
    const hasHealthCheck = await page.getByTestId("section-health-check").isVisible();

    if (title !== expectedTitle) {
      throw new Error(`${hash} rendered "${title}" instead of "${expectedTitle}"`);
    }

    if (!hasHealthCheck || pageText.trim().length < 100) {
      throw new Error(`${hash} appears blank or incomplete`);
    }

    console.log(`${hash} OK - ${title}`);
  }
} finally {
  await browser.close();
}
