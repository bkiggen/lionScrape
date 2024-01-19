require("dotenv").config();
const { Builder, By, Key, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function runScript() {
  // make headless so we don't see the browser
  const chromeOptions = new chrome.Options();
  chromeOptions.addArguments("--headless");
  chromeOptions.addArguments("--window-size=1920,1080");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOptions)
    .build();

  try {
    // get to site
    await driver.get("https://lcx-jobboard.lionbridge.com/new-jobs");
    await driver.wait(until.elementLocated(By.id("Username")), 5000);

    // initial page
    const usernameField = await driver.findElement(By.id("Username"));
    if (usernameField) {
      await usernameField.sendKeys(process.env.USERNAME);

      const continueButton = await driver.findElement(By.name("button"));
      await continueButton.click();

      await driver.wait(until.elementLocated(By.name("UserName")), 5000);

      const usernameField2 = await driver.findElement(By.name("UserName"));
      await usernameField2.clear();
      await usernameField2.sendKeys(process.env.USERNAME);

      const passwordField = await driver.findElement(By.name("Password"));
      await passwordField.sendKeys(process.env.PASSWORD);

      const submitButton = await driver.findElement(By.id("submitButton"));
      await submitButton.click();

      await driver.sleep(5000);
      await driver.get("https://lcx-jobboard.lionbridge.com/new-jobs");
    }

    // Infinite loop for the task
    while (true) {
      try {
        // Job board
        const clickable = await driver.findElement(By.className("clickable"));
        if (clickable) {
          // if clickable etc
          await clickable.click();
          await driver.sleep(5000);

          // specific job
          const acceptButton = await driver.findElement(By.id("accept-btn"));
          await acceptButton.click();
          await driver.sleep(5000);

          // TODO: if job accepted, add item to html stating that
        }
      } catch (e) {
        console.error("An error:", e);
        // Add additional error handling if needed
        // Continue the loop even if there's an exception
      }

      // Wait for 5 seconds before the next iteration
      await driver.sleep(5000);
    }
  } finally {
    // Close the driver in case of any manual interruption
    await driver.quit();
  }
}

runScript();
