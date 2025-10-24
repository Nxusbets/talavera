Feature: User Authentication

  Scenario: User successfully signs up
    Given the signup endpoint is available
    When the user submits a signup request with email "john@example.com" and password "SecurePass123!"
    Then the response status should be 201
    And the response should contain a user object with email "john@example.com"
    And the response should contain an access token

  Scenario: User fails to signup with invalid email
    Given the signup endpoint is available
    When the user submits a signup request with email "invalid-email" and password "SecurePass123!"
    Then the response status should be 400
    And the response should contain error key "errors.invalid_email"

  Scenario: User successfully signs in
    Given a user exists with email "jane@example.com" and password "SecurePass123!"
    When the user submits a signin request with email "jane@example.com" and password "SecurePass123!"
    Then the response status should be 200
    And the response should contain an access token

  Scenario: User fails to signin with wrong password
    Given a user exists with email "jane@example.com" and password "SecurePass123!"
    When the user submits a signin request with email "jane@example.com" and password "WrongPassword!"
    Then the response status should be 401
    And the response should contain error key "errors.invalid_credentials"
