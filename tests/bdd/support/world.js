const { setWorldConstructor, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

setDefaultTimeout(60 * 1000);

class CustomWorld {
    constructor() {
        this.driver = null;
    }
}

setWorldConstructor(CustomWorld);

// Launch Browser BEFORE the scenario starts
Before(async function () {
    const options = new chrome.Options();    
    // options.addArguments('--headless'); 
    
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');

    this.driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
});

// Close Browser AFTER the scenario ends
After(async function () {
    if (this.driver) {
        await this.driver.quit();
    }
});