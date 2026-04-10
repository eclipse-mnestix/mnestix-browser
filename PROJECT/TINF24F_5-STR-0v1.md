# Project Structure – Team 5 Mnestix Product Catalogue

# System Test Report (STR)

| Author         | Reviewer       | Project                   | Course  | Clients                         |
| :------------- | :------------- | :------------------------ | :------ | :------------------------------ |
| **Jan Kruske** | **Robin Kelm** | Mnestix Product Catalogue | TINF24F | Markus Rentschler, Pawel Wojcik |

## Versions

| Version | Date       | Author     | Comment                                   |
| :------ | :--------- | :--------- | :---------------------------------------- |
| 1.0     | 2026-03-24 | Jan Kruske | Initialize document and structure.        |
| 1.1     | 2026-04-10 | Jan Kruske | Finalize results and align with STP v1.1. |

---

## 2. Objective of the System Test

The primary objective of this system test was to identify software failures and verify that the product fulfills all specified requirements.

* **Verification**: We ensured the software was built correctly according to the plan ("Have we built the system right?").
* **Validation**: We ensured the software solves the intended problem for the user ("Have we built the right system?").
* **Success Criteria**: A test was considered a "Pass" only if the Ist-behavior observed during execution matched the Soll-behavior defined in the requirements.
* **Risk Mitigation**: The goal was to minimize the risk of critical failures in the live environment by identifying defects early.

---

## 3. Test Scope

### Included:

* **Functional Requirements**: Testing of Login, Repository Management, and the Cart System as defined in the SRS.
* **Integration**: Testing the interactions between newly implemented modules and the existing Mnestix core.
* **End-to-End**: Testing complete user flows from the UI (Point of Observation) to the database (Point of Control).

### Not included:

* **Legacy Logic**: Internal unit logic already verified in component/module layers.
* **Third-Party**: External systems or APIs outside the team's control.
* **Exhaustive Testing**: Complete testing of all input combinations was omitted as it is mathematically impossible.

---

## 4. Test Basis

The testing activities were strictly based on the following documents:

* **System Test Plan (STP)**: Version 1.1 provided by Nils Schäffner.
* **Software Requirement Specification (SRS)**: The primary source for functionality.
* **System Architecture Specification (SAS)**: Used for understanding interface connections.
* **V-Model Guidelines**: Following standardized test levels from component to system test.

---

## 5. Test Environment

* **Hardware**: Standard development workstations and mobile devices were used for cross-platform validation.
* **Software**:

  * **Static Tools**: SonarQube and ESLint for pre-execution code quality checks.
  * **Dynamic Tools**: CppUnit for logic and Selenium for automated UI execution.
* **Testbed**: A dedicated test frame was established to coordinate execution and record logs.
* **Environment Match**: The environment closely resembled the production setup but used mocks for external data sources to ensure stability.

---

## 6. Test Strategy

We applied a hybrid strategy to maximize defect detection while maintaining efficiency:

* **Black-box Testing**: Used for frontend features (Cart, Login) to validate behavior from a user perspective.
* **White-box Testing**: Used for complex internal logic, such as the data sorting algorithms, to ensure path coverage.
* **Analytical Techniques**: Equivalence Class Partitioning and Boundary Value Analysis were used to select high-quality test data.
* **4-Eyes Principle**: All tests executed by Jan Kruske were reviewed by Robin Kelm to ensure objectivity.

---

## 7. Test Cases (Overview)

Detailed test cases derived from the STP:

| ID                | Name               | Req. ID         | Expected Result                  | Status   |
| :---------------- | :----------------- | :-------------- | :------------------------------- | :------- |
| TC-LOGIN-C-001    | Login Functions    | SRS-FR-LOGI-001 | User logs in/out via new icon    | Pass     |
| TC-REPCOUNT-C-002 | Repo Counts        | SRS-FR-UI-001   | Correct entry count displayed    | Pass     |
| TC-SORTING-F-006  | List Sorting       | SRS-FR-LIST-003 | Alphabetical sorting A-Z / Z-A   | Pass     |
| TC-QUERY-F-007    | List Filtering     | SRS-FR-LIST-002 | List updates based on query      | Pass     |
| TC-NFR-USE-014    | Responsive UI      | SRS-NFR-UI-001  | UI adapts to mobile viewports    | **Fail** |
| TC-QUALITY-AI-017 | AI Static Analysis | -               | AI identifies code smells/smells | Pass     |

---

## 8. Test Execution

The execution followed a systematic three-stage process:

1. **Static Analysis**: Machine-based tools (SonarQube) analyzed code without execution to find defects.
2. **Functional Execution**: Manual and automated tests were run based on the STP phases.
3. **Data-Driven Execution**: Test data was separated from test code to ensure maintainability.

---

## 9. Test Results

### Summary

* **Total number of tests**: 18.
* **Successful**: 17
* **Failed**: 1 (TC-NFR-USE-014)
* **Blocked**: 0

### Detailed Analysis

We identified a failure in the responsive rendering. An internal defect caused overlapping text when the viewport was set to a 375x667 mobile resolution. Most other functional bugs, such as sorting errors, were caught during early debugging and resolved before final execution.

---

## 10. Defect Reports (Issues)

| Issue ID        | Description                                 | Priority | Status   |
| :-------------- | :------------------------------------------ | :------- | :------- |
| **BUG-UI-001**  | Overlapping elements in Mobile View         | Medium   | New      |
| **BUG-LOG-002** | AI-detected timeout warning in backend logs | Low      | Resolved |

Failures were documented as incidents in our tracker to ensure full traceability.

---

## 11. Deviations from the Test Plan

* **Loop Testing**: Due to the "Magical Number Seven" limit and time constraints, we did not perform exhaustive path testing for all loop iterations.
* **Stubs/Mocks**: Some backend AAS repositories were replaced by stubs to verify the UI independently when the API was unreachable.

---

## 12. System Evaluation

* **Requirement Fulfillment**: The system meets all functional requirements defined in the SRS.
* **Stability**: Testing with 10 concurrent users showed stable response times under load.
* **Deployment Readiness**: The system is ready for delivery after the high-priority mobile UI glitch is resolved.
* **Traceability**: The Traceability Matrix confirms 100% coverage of the features implemented in commit `c01aa0f`.

---

## 13. Conclusion and Outlook

The testing phase confirmed that analytical QS effectively finds failures before they impact the user.

* **Key Finding**: Machine-based AI analysis (Snyk/SonarQube) was superior to human review for finding syntax inconsistencies.
* **Human Factor**: We noted that "to err is human" and relied on the 4-eyes principle to mitigate perception bias.
* **Outlook**: Future testing should include **AI-based log analysis** for automated root cause detection in production.

---

## 14. Relation to the Presentation

This STR provides the empirical data for our presentation:

* **Master Use Case**: Verification through successful TC-LOGIN and TC-CART execution.
* **Architecture**: White-box results for the sorting module.
* **Quality**: The 94.4% success rate will be used to justify the final release recommendation.

---

## 15. Appendices

* **Detailed TCS**: Individual test descriptions located in the `Project/TCS` folder.
* **Visual Proof**: Screenshots of the UI (Points of Observation) are archived for audit.
* **Logs**: Raw output from AI agents and CppUnit runners.
