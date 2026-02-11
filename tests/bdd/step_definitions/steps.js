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