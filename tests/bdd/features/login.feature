Feature: User Authentication

  Scenario: Owner logs in and logs out successfully
    Given I have a valid owner account
    And I am on the login page
    When I enter my username "BDDTestOwner"
    And I enter my password "password123"
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see the welcome message "Hello, BDDTestOwner"
    When I click the logout button
    Then I should be returned to the login page