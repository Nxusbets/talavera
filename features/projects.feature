Feature: Project Management

  Scenario: User creates a project successfully within free plan limit
    Given the user is authenticated with a "free" plan (3 projects quota)
    And the user has 0 projects
    When the user creates a project with name "My First Project"
    Then the response status should be 201
    And the response should contain a project object with name "My First Project"

  Scenario: User exceeds free plan project limit
    Given the user is authenticated with a "free" plan (3 projects quota)
    And the user has 3 projects
    When the user attempts to create another project with name "Fourth Project"
    Then the response status should be 403
    And the response should contain error key "errors.quota_exceeded"

  Scenario: User with pro plan can create more projects
    Given the user is authenticated with a "pro" plan (10 projects quota)
    And the user has 3 projects
    When the user creates a project with name "Fourth Project"
    Then the response status should be 201
    And the response should contain a project object with name "Fourth Project"

  Scenario: User lists their projects
    Given the user is authenticated
    And the user has 2 projects named "Project A" and "Project B"
    When the user requests their projects list
    Then the response status should be 200
    And the response should contain 2 project objects
