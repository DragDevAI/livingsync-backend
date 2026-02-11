const { Given, When, Then } = require('@cucumber/cucumber');
const { By, until } = require('selenium-webdriver');
const assert = require('assert');

Given('I have a valid owner account', async function () {
});

Given('I am on the login page', async function () {
    await this.driver.get('http://127.0.0.1:5500/f.end/index.html'); 
});

When('I enter my username {string}', async function (username) {
    const input = await this.driver.wait(until.elementLocated(By.id('loginName')), 10000);    
    await this.driver.wait(until.elementIsVisible(input), 10000); 
    await input.sendKeys(username);
});

When('I enter my password {string}', async function (password) {
    const input = await this.driver.findElement(By.id('loginPassword'));
    await input.sendKeys(password);
});

When('I click the login button', async function () {
    const btn = await this.driver.findElement(By.id('bLogIn'));
    await btn.click();
});

Then('I should be redirected to the dashboard', async function () {
    await this.driver.wait(until.urlContains('user_landing.html'), 5000);
   
    const currentUrl = await this.driver.getCurrentUrl();
    assert.ok(currentUrl.includes('user_landing.html'), 'URL did not contain user_landing.html');
});

Then('I should see the welcome message {string}', async function (expectedNamePart) {
    const welcomeEl = await this.driver.wait(until.elementLocated(By.id('welcomeMsg')), 5000);
    
    await this.driver.wait(async () => {
        const text = await welcomeEl.getText();
        return text.includes(expectedNamePart);
    }, 5000, `Expected welcome message to include ${expectedNamePart}`);
});

// 5. Logout (Updated ID)
When('I click the logout button', async function () {
    // HTML ID: id="bSignOut"
    const logoutBtn = await this.driver.findElement(By.id('bSignOut'));
    await logoutBtn.click();
});

Then('I should be returned to the login page', async function () {
    // Your JS redirects to 'index.html'
    await this.driver.wait(until.urlContains('index.html'), 5000);
    const currentUrl = await this.driver.getCurrentUrl();
    assert.ok(currentUrl.includes('index.html'), 'Logout did not redirect to index.html');
});

// Options for Slow Mode to see the steps in action
/*
const { Given, When, Then } = require('@cucumber/cucumber');
const { By, until } = require('selenium-webdriver');
const assert = require('assert');

// --- HELPER FUNCTIONS FOR DEMO MODE ---

// 1. Sleep: Pauses execution for X milliseconds
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 2. Slow Type: Types one character at a time to look like a human
async function slowType(element, text, delay = 100) {
    for (const char of text) {
        await element.sendKeys(char);
        await sleep(delay); // Wait 100ms between keystrokes
    }
}

// --------------------------------------

Given('I have a valid owner account', async function () {
    // Database is already seeded.
});

Given('I am on the login page', async function () {
    // ⚠️ REPLACE THIS WITH YOUR EXACT LIVE SERVER URL
    await this.driver.get('http://127.0.0.1:5500/f.end/index.html'); 
    
    // DEMO: Wait 1s so you can see the empty form
    await sleep(1000);
});

When('I enter my username {string}', async function (username) {
    const input = await this.driver.wait(until.elementLocated(By.id('loginName')), 5000);
    
    // DEMO: Use slowType instead of sendKeys
    await slowType(input, username);
    await sleep(500); // Pause briefly after typing
});

When('I enter my password {string}', async function (password) {
    const input = await this.driver.findElement(By.id('loginPassword'));
    
    // DEMO: Use slowType
    await slowType(input, password);
    await sleep(500); 
});

When('I click the login button', async function () {
    const btn = await this.driver.findElement(By.id('bLogIn'));
    
    // DEMO: Highlight the button before clicking (Visual Cue)
    await this.driver.executeScript("arguments[0].style.border='3px solid red'", btn);
    await sleep(500); 
    
    await btn.click();
});

Then('I should be redirected to the dashboard', async function () {
    // Wait for the URL to actually change
    await this.driver.wait(until.urlContains('user_landing.html'), 5000);
    
    // DEMO: Wait 2 seconds so you can admire the dashboard
    await sleep(2000);

    const currentUrl = await this.driver.getCurrentUrl();
    assert.ok(currentUrl.includes('user_landing.html'), 'URL did not contain user_landing.html');
});

Then('I should see the welcome message {string}', async function (expectedNamePart) {
    const welcomeEl = await this.driver.wait(until.elementLocated(By.id('welcomeMsg')), 5000);
    
    // Wait for text to appear (handling fetch latency)
    await this.driver.wait(async () => {
        const text = await welcomeEl.getText();
        return text.includes(expectedNamePart);
    }, 5000);

    // DEMO: Highlight the welcome message so you know the test checked it
    await this.driver.executeScript("arguments[0].style.backgroundColor = 'yellow';", welcomeEl);
    await sleep(1000);
});

When('I click the logout button', async function () {
    const logoutBtn = await this.driver.findElement(By.id('bSignOut'));
    
    // DEMO: Highlight logout button
    await this.driver.executeScript("arguments[0].style.border='3px solid red'", logoutBtn);
    await sleep(1000);
    
    await logoutBtn.click();
});

Then('I should be returned to the login page', async function () {
    await this.driver.wait(until.urlContains('index.html'), 5000);
    
    // DEMO: Final pause to show we are back at the start
    await sleep(2000);

    const currentUrl = await this.driver.getCurrentUrl();
    assert.ok(currentUrl.includes('index.html'), 'Logout did not redirect to index.html');
});
*/