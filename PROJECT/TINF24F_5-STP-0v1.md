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

# Test specification
<table>
  <tr>
    <th colspan="3">Test Case</th>
  </tr>
  <tr>
    <td><b>ID</b></td>
    <td colspan="2">TS-LOGIN-C-001</td>
  </tr>
  <tr>
    <td><b>Name</b></td>
    <td colspan="2">Login functions</td>
  </tr>
  <tr>
    <td><b>REQ_ID</b></td>
    <td colspan="2">TO DO</td>
  </tr>
  <tr>
    <td><b>Description</b></td>
    <td colspan="2">
This test case verifies the correct functionality of the new login button. 
It verifies the correct display of the new button and the support of every account feature. 
The test setup consists of the latest version of mnestix and the version before the implementation commit 
<a href="https://github.com/DHBW-TINF24F/Team5-mnestix-product-catalogue/commit/c01aa0f499a8e04d0220c3b361ed3c98c5483295">c01aa0f</a>.
</td>
<tr>
  <th colspan="3">Test Steps</th>
</tr>
  <tr>
    <th>Step</th>
    <th>Action</th>
    <th>Expected Result</th>
  </tr>
  <tr>
    <td>1</td>
    <td>Visit Mnestix and view dashboard</td>
    <td>Dashboard is visible</td>
  </tr>
  <tr>
  <td>2</td>
  <td>Search for the user icon in the upper right corner</td>
  <td>User finds the icon in the upper right corner</td>
</tr>
<tr>
  <td>3</td>
  <td>Hover over or click on the user icon</td>
  <td>A properties dialog with different account options appears</td>
</tr>
<tr>
  <td>4</td>
  <td>Enter correct login credentials</td>
  <td>User is successfully logged in</td>
</tr>
<tr>
  <td>5</td>
  <td>Select "Log out"</td>
  <td>User is logged out</td>
</tr>
<tr>
  <td>6</td>
  <td>Log in again</td>
  <td>User is logged in again</td>
</tr>
<tr>
  <td>7</td>
  <td>Open the old Mnestix version, access the login menu, and collect account options</td>
  <td>The new dropdown menu in the latest Mnestix version provides the same account options and links them correctly</td>
</tr>
</table>








<table>
  <tr>
    <th colspan="3">Test Case</th>
  </tr>
  <tr>
    <td><b>ID</b></td>
    <td colspan="2">TS-REPCOUNT-C-002</td>
  </tr>
  <tr>
    <td><b>Name</b></td>
    <td colspan="2">Repository entry counts</td>
  </tr>
  <tr>
    <td><b>REQ_ID</b></td>
    <td colspan="2">TO DO</td>
  </tr>
  <tr>
    <td><b>Description</b></td>
    <td colspan="2">
This test case verifies the correct functionality of the new repository setting feature. 
It verifies that the correct number is displayed next to the repository. 
</td>
<tr>
  <th colspan="3">Test Steps</th>
</tr>
  <tr>
    <th>Step</th>
    <th>Action</th>
    <th>Expected Result</th>
  </tr>
  <tr>
    <td>1</td>
    <td>Open Mnestix Browser</td>
    <td>Dashboard is visible</td>
  </tr>
  <tr>
  <td>2</td>
  <td>Enter repository settings menu</td>
  <td>Activated repositories are displayed </td>
</tr>
<tr>
  <td>3</td>
  <td>Check the number next to the repository name</td>
  <td>The correct number is displayed next to each repository depending on the amount of entries</td>
</tr>
</table>




<table>
  <tr>
    <th colspan="3">Test Case</th>
  </tr>
  <tr>
    <td><b>ID</b></td>
    <td colspan="2">TS-SORTING-F-003</td>
  </tr>
  <tr>
    <td><b>Name</b></td>
    <td colspan="2">Asset List Sorting</td>
  </tr>
  <tr>
    <td><b>REQ_ID</b></td>
    <td colspan="2">TO DO</td>
  </tr>
  <tr>
    <td><b>Description</b></td>
    <td colspan="2">
This test case verifies the correct functionality of the new sorting logic for the asset list. 
It verifies the correct sorting logic for the columns ManufacturerName, ProductDesignation, OrderCode, ManufacturerCode, GlobalAssetId, and CreatedAt.
The test setup consists of the latest version of the mnestix browser and is supported by an additional unit test.
</td>
<tr>
  <th colspan="3">Test Steps</th>
</tr>
  <tr>
    <th>Step</th>
    <th>Action</th>
    <th>Expected Result</th>
  </tr>
  <tr>
    <td>1</td>
    <td>Navigate to AAS List</td>
    <td>An unsorted AAS List is visible</td>
  </tr>
  <tr>
  <td>2</td>
  <td>Verify that the correct test data is inserted</td>
  <td>Correct entries are shown in the table</td>
</tr>
  <tr>
  <td>3</td>
  <td>Hover over an abitrary column</td>
  <td>Small arrows implying sorting are visible</td>
</tr>
<tr>
  <td>4</td>
  <td>Click on any colum header</td>
  <td>Column is sorted alphabetically</td>
</tr>
</table>

<table>
  <tr>
    <th colspan="5">Test Data – TD-SORTING-F-003</th>
  </tr>
  <tr>
    <td><b>Repository</b></td>
    <td colspan="4">http://mnestix-api:5064/repo</td>
  </tr>
  <tr>
    <th>#</th>
    <th>Dataset / Column</th>
    <th>Sort Order</th>
    <th>First Entry</th>
    <th>Result</th>
  </tr>
  <tr>
    <td>1</td>
    <td>Manufacturer Name</td>
    <td>A–Z</td>
    <td>Gottfried Wilhelm Leibniz Universität Hannover</td>
    <td>PASS</td>
  </tr>
  <tr>
    <td>2</td>
    <td>Manufacturer Name</td>
    <td>A–Z</td>
    <td>XITASO GmbH</td>
    <td>FAIL</td>
  </tr>
  <tr>
    <td>3</td>
    <td>Asset ID</td>
    <td>A–Z</td>
    <td>https://aas2.uni-h.de/lni0729</td>
    <td>PASS</td>
  </tr>
  <tr>
    <td>4</td>
    <td>AAS ID</td>
    <td>Z–A</td>
    <td>https://aas2.uni-h.de/lni0729</td>
    <td>FAIL</td>
  </tr>
  <tr>
    <td>5</td>
    <td>Product Designation</td>
    <td>A–Z</td>
    <td>Individueller Kugelschreiber</td>
    <td>PASS</td>
  </tr>
</table>









Link Test:
[TINF24F Feature FR.003](./TINF24F_5-SRS-0v1.md#fr003)

To Dos:
Matrix feature / test
jeder test überschrift
inhaltsverzeichnis
test suits

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
