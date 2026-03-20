<h1 align="center">System Test Plan for Mnestix Browser extension</h1>
<h3 align="center"> Customer: Rentschler, Wojcik, XITASO</h3>
<h3 align="center"> Created by Nils Schäffner</h3>


# TABLE OF CONTENTS
- [Introduction](#introduction)


# Introduction

This document outlines the testing approach and procedures for the ongoing development of the **Mnestix Product Catalogue**. The purpose of this test plan is to ensure the system's functionality, reliability, and overall quality before its final release.  

The **Mnestix Product Catalogue** is a web-based application that allows users to efficiently manage products, search and filter information, and access detailed product data through an intuitive, user-friendly interface. Recent enhancements include advanced filtering options, optimized search algorithms, and the integration of additional product information, all aimed at improving the overall user experience and data management capabilities.  

The testing activities described in this plan will utilize a combination of **classic manual and automated testing methods** alongside **modern approaches leveraging AI-based tools**, enabling intelligent test case generation, predictive analysis of potential defects, and enhanced coverage of complex system interactions. Results from these tests will be consolidated in a **System Test Report ([STR](./TINF24F_5-STR-0v1.md))**, providing a comprehensive record of findings, identified issues, and areas for improvement.  

By adopting this structured and hybrid testing approach, the development team ensures that the **Mnestix Product Catalogue** not only meets all functional and quality requirements but also delivers a reliable and optimized experience for its end users.

# Scope
## In-Scope
The scope of this Software Test Plan is to ensure that all newly developed features and functionalities of the application are thoroughly tested and meet the requirements defined in the [Software Requirement Specification (SRS)](./TINF24F_5-SRS-0v1.md). 

This test plan covers:

- **Newly implemented features**: All functionalities that have been added as part of the current development cycle.  
- **Modified existing features**: Any previously existing features that have been updated, enhanced, or otherwise changed during the current implementation.  
- **Integration of components**: Interactions between newly implemented and existing modules, ensuring proper integration and correct system behavior.  

## Out-of-Scope
Features or components **not in scope** for this testing effort include:

- Legacy modules that remain unchanged and unaffected by the current development.  
- External services or third-party systems outside the control of the development team.  

By defining this scope, the test plan ensures that testing resources are focused on areas with the highest impact, while explicitly clarifying what is and is not covered during this testing cycle.

# Test Preperation Strategy
The test strategy is primarily based on a requirements-based (Anforderungsbasiert) as well as a use-case-based (Anwendungsbasiert) approach, ensuring that both functional requirements and realistic user scenarios are thoroughly covered.

Since most of the implemented features focus on usability improvements on the frontend—particularly regarding user interaction—the main testing method applied is black-box testing. This approach is well-suited because these features do not depend on critical backend routines or significant changes in the system’s internal logic. Therefore, validating the external behavior of the system is sufficient in most cases, and the use of white-box testing is not required for every feature.

However, white-box testing is applied selectively for components that involve more complex internal logic. For example, features such as data sorting or other processing mechanisms require a deeper verification of internal structures and control flows. In such cases, white-box tests are introduced to ensure correctness and robustness.

Additionally, before any code changes are merged into the main branch, a code review process is conducted. At least one team member performs both static and dynamic analysis of the changes to ensure code quality from the outset. This helps identify potential defects early and maintains a consistently high standard of implementation.

To further enhance test effectiveness, techniques such as boundary value analysis are incorporated. This allows testers to focus on edge cases where errors are more likely to occur. Combined with carefully designed test cases, this approach enables deeper testing while maintaining efficiency.

Overall, the test suites are designed with the goal of achieving high quality under economically reasonable conditions, following the principle of “as many tests as necessary, but as few as possible.” This ensures an optimal balance between test coverage, effort, and development speed.
Link Test:
[TINF24F Feature FR.003](./TINF24F_5-SRS-0v1.md#fr003)

To Dos:

product genau nennen mit commit

test preperation strategy
test execution strategy
material requirement + test environment
Rollen und Verantwortliche
Wie gehen wir mit Fehlern um -> Diagramm
DEBUGGING

Einzelnen Testcases

Alles verlinken (STR und requirements)
Requirements namen anpassen, wenn gregor geändaert hat
Ideen:
AI
White-Box Vorteile
Test Bücher Hintergrund integrieren
