Feature: Subscription Management

  Scenario: User upgrades from Free to Pro plan
    Given the user is authenticated with a "free" plan
    When the user initiates a subscription to "pro" plan
    Then the response status should be 201
    And the response should contain a subscription object with status "active"
    And the user's projects_quota should be updated to 10
    And an invoice should be created for the subscription

  Scenario: User views available plans
    Given the plans endpoint is available
    When the user requests the available plans
    Then the response status should be 200
    And the response should include plans with localized names:
      | code | name_en | name_es           |
      | free | Free    | Gratis            |
      | pro  | Pro     | Profesional       |
