# System Test Report (STR)

## Project: Eclipse Mnestix Product Catalog

<h3 align="center">Customer: Rentschler, Wojcik, XITASO</h3>
<h3 align="center">Created by Jan Kruske</h3>

| Author         | Reviewer       | Project                   | Course  | Clients                         |
| :------------- | :------------- | :------------------------ | :------ | :------------------------------ |
| **Jan Kruske** | **Robin Kelm** | Mnestix Product Catalogue | TINF24F | Markus Rentschler, Pawel Wojcik |

## Document Version History

| Version | Date       | Author     | Comment                                                  |
| :------ | :--------- | :--------- | :------------------------------------------------------- |
| 1.0     | 2026-03-24 | Jan Kruske | Initialize document and structure.                       |
| 1.1     | 2026-04-10 | Jan Kruske | Adapt results and align with STP v1.1.                   |
| 1.2     | 2026-04-24 | Jan Kruske | Finalize document — all tests passed.                    |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Objective of the System Test](#2-objective-of-the-system-test)
3. [Test Scope](#3-test-scope)
4. [Test Basis](#4-test-basis)
5. [Test Environment](#5-test-environment)
6. [Test Strategy](#6-test-strategy)
7. [Test Cases and Results](#7-test-cases-and-results)
8. [Test Execution Summary](#8-test-execution-summary)
9. [Defect Reports](#9-defect-reports)
10. [Deviations from the Test Plan](#10-deviations-from-the-test-plan)
11. [Traceability Matrix](#11-traceability-matrix)
12. [System Evaluation](#12-system-evaluation)
13. [Conclusion and Outlook](#13-conclusion-and-outlook)

---

## 1. Introduction

This System Test Report documents the results of the system-level testing for the **Mnestix Product Catalogue** project (Project Bisasam), developed by Team 5 of course TINF24F at DHBW Stuttgart. The project enhances the Eclipse Mnestix Browser with new UI features including an eShop cart module, AAS list sorting and filtering, repository configuration improvements, and Nameplate Generator integration.

This report is based on the System Test Plan (STP) v1.1 authored by Nils Schäffner and covers all test suites and test cases defined therein. Testing was performed by **Jan Kruske** (executor) under review by **Robin Kelm** (reviewer), following the four-eyes principle. All tests were executed after the Code Freeze on 10.04.2026, with final bug fixes completed by 14.04.2026.

---

## 2. Objective of the System Test

- **Verification**: Confirm the software was built according to specification ("Have we built the system right?").
- **Validation**: Confirm the software solves the intended problem for the user ("Have we built the right system?").
- **Success Criteria**: A test was considered a **Pass** only if the observed (Ist) behavior fully matched the specified (Soll) behavior from the SRS and STP. Any deviation was classified as Fail or Blocked.
- **Risk Mitigation**: Identify remaining defects before final delivery to minimize production failures.

All 18 test cases defined in the STP were executed. The final run confirms **all tests passed** with no open defects at release.

---

## 3. Test Scope

### 3.1 Included

- All functional requirements from the SRS v1.1 mapped in the STP (Login, Repository Management, AAS List Sorting and Filtering, Cart System, Product Price Display)
- Non-functional requirements (performance, audit logging, responsive UI, browser compatibility, code quality)
- Integration between new modules and the existing Mnestix core (Next.js, TypeScript, BaSyx backend)
- AI-based static code analysis and log analysis
- End-to-end user flows from UI to backend

### 3.2 Not Included

- Unchanged legacy Mnestix modules not modified by Project Bisasam
- External third-party services (payment gateways, external AAS servers)
- Exhaustive combinatorial input testing (equivalence classes and boundary values used instead)
- Live production deployment verification

---

## 4. Test Basis

| Document | Version | Author | Role in Testing |
| :------- | :------ | :----- | :-------------- |
| System Test Plan (STP) | 1.1 | Nils Schäffner | Primary test specification |
| Software Requirements Specification (SRS) | 1.1 | Gregor Gottschewski | Source of expected behavior |
| Customer Requirements Specification (CRS) | 1.3 | Julian Schumacher | Acceptance criteria reference |
| Software Architecture Specification (SAS) | 1.0 | Bruno Lange | Interface and integration reference |

---

## 5. Test Environment

**Hardware:** Standard development workstations (Windows 10/11, macOS); mobile devices for responsive UI verification; dedicated Docker-based test server (mnestix-api + BaSyx backend at `http://mnestix-api:5064/repo`).

**Software:**

| Tool | Purpose |
| :--- | :------ |
| ESLint / Prettier | Static linting and formatting compliance |
| SonarQube / Claude | AI-based static code and log analysis |
| Selenium | End-to-end UI test execution |
| k6 | Concurrent user load testing |
| Chrome DevTools | Responsive design verification |
| Chrome, Firefox, Safari (latest) | Cross-browser compatibility testing |

**Test Data:** BaSyx repository pre-populated with entries from Gottfried Wilhelm Leibniz Universität Hannover, XITASO GmbH, and others. Mock stubs used where live API was unavailable to isolate UI behavior.

---

## 6. Test Strategy

- **Requirements-Based Testing:** Every test case derived from a specific SRS requirement; coverage verified via the Traceability Matrix (Section 11).
- **Black-Box Testing:** Applied to all frontend features (Cart, Login, List) — tested by observable behavior only.
- **White-Box Testing:** Applied selectively to sorting and filtering logic for internal path coverage.
- **Analytical Techniques:** Equivalence Class Partitioning and Boundary Value Analysis for test data selection.
- **4-Eyes Principle:** Jan Kruske executed all tests; Robin Kelm reviewed all results independently. No developer tested their own feature.
- **AI-Assisted Analysis:** Static code and log analysis supplemented manual testing.

---

## 7. Test Cases and Results

### 7.1 TS-USER-01 — Login Functions

**TC-LOGIN-C-001** | Req: SRS-FR-LOGI-001, SRS-FR-LOGI-002 | Date: 2026-04-11 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Visit Mnestix and view dashboard | Dashboard visible | Dashboard rendered correctly | ✅ |
| 2 | Search for user icon in upper-right corner | Icon found | New login status icon visible in menu bar | ✅ |
| 3 | Hover/click on user icon | Account options dialog appears | Dropdown with full account options appeared | ✅ |
| 4 | Enter correct login credentials | User logged in | User authenticated; icon updated to logged-in state | ✅ |
| 5 | Select "Log out" | User logged out | Logout successful; icon reset | ✅ |
| 6 | Log in again | User logged in again | Re-authentication successful | ✅ |
| 7 | Compare account options with old Mnestix version | New dropdown has same options | All legacy options preserved in new component | ✅ |

The new login status indicator is permanently visible in the header across all views. All existing login button functionality was correctly migrated. The team noted (as documented in the SRS) that the visible username in the header may be a minor privacy concern in public settings — this is a known and accepted trade-off.

---

### 7.2 TS-REPOSITORY-02 — Repository Management

**TC-REPCOUNT-C-002** | Req: SRS-FR-UI-001 | Date: 2026-04-11 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Open Mnestix Browser | Dashboard visible | Dashboard loaded successfully | ✅ |
| 2 | Enter repository settings menu | Repositories listed | All configured repositories visible | ✅ |
| 3 | Check number next to each repository name | Correct entry count shown | Counts matched actual AAS entries (verified by API query); count = 0 displayed correctly for empty repositories | ✅ |

---

**TC-CONFIG-F-003** | Req: SRS-FR-REPO-001 | Date: 2026-04-11 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Navigate to "Einstellungen" → "Datenquellen" | Configuration page displayed | Settings page loaded | ✅ |
| 2 | Verify repository list is shown | All repositories visible | All repositories listed | ✅ |
| 3 | Click "Alles bearbeiten" for a repository | Edit dialog opens | Dialog opened with all fields populated | ✅ |
| 4 | Toggle active/inactive switch to disable | Repository marked inactive | Repository marked inactive; removed from catalog view | ✅ |
| 5 | Save and return to overview | State persists | Inactive state persisted after returning to overview | ✅ |
| 6 | Re-enable repository | Repository active again | Entries visible again in catalog | ✅ |

Enable/disable state is persisted in local storage and survives page reloads. Disabling a repository removes its entries from the product list without requiring a page refresh.

---

**TC-CONFIG-C-004** | Req: SRS-FR-CONFIG-001 | Date: 2026-04-12 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Navigate to "/de/settings" → "Datenquellen" | Configuration page displayed | Settings page loaded | ✅ |
| 2 | Select a CD repository entry and click "Alles bearbeiten" | Edit dialog opens | Dialog opened with all fields populated | ✅ |
| 3 | Inspect fields (Name, Image URL, AAS Repository URL, AAS Searcher URL) | All fields visible and populated | All four fields present and prefilled | ✅ |
| 4 | Modify one or more fields | Updated values accepted | Changes accepted without validation errors | ✅ |
| 5 | Save changes | Changes reflected in list | Repository list updated immediately | ✅ |
| 6 | Reload the page | Values remain | Values persisted correctly after page reload | ✅ |

---

**TC-CONFIG-C-005** | Req: SRS-FR-CONFIG-002 | Date: 2026-04-12 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Navigate to "Einstellungen" → "Datenquellen" | Repository overview displayed | Settings page loaded | ✅ |
| 2 | Select an active CD repository | Repository interactable | Repository selected | ✅ |
| 3 | Trigger content inspection via UI | Content view opens | Content view opened showing CD entries | ✅ |
| 4 | Verify repository data displayed | Content visible and structured | Structured list of Concept Descriptions with semantic IDs | ✅ |
| 5 | Browse content (expand elements, navigate) | Content navigable without errors | All entries expandable; navigation worked without errors | ✅ |

---

### 7.3 TS-AAS-LIST — Asset Administration Shell List

**TC-SORTING-F-006** | Req: SRS-FR-LIST-001, SRS-FR-LIST-003 | Date: 2026-04-13 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Navigate to AAS List | Unsorted list visible | All six columns present (ManufacturerName, ProductDesignation, OrderCode, ManufacturerCode, GlobalAssetId, CreatedAt) | ✅ |
| 2 | Verify test data inserted | Correct entries in table | All expected test data entries present | ✅ |
| 3 | Hover over a column header | Sort arrows visible | Sort indicators appeared on all column headers | ✅ |
| 4 | Click any column header | Column sorted alphabetically | Ascending sort applied; second click reversed to descending | ✅ |

**Test Data (TD-SORTING-F-006):**

| # | Column | Sort Order | Expected First Entry | Result |
| :- | :----- | :--------- | :------------------- | :----- |
| 1 | Manufacturer Name | A–Z | Gottfried Wilhelm Leibniz Universität Hannover | ✅ PASS |
| 2 | Manufacturer Name | A–Z | XITASO GmbH (must NOT be first) | ✅ PASS |
| 3 | Asset ID | A–Z | https://aas2.uni-h.de/lni0729 | ✅ PASS |
| 4 | AAS ID | Z–A | https://aas2.uni-h.de/lni0729 (must NOT be first) | ✅ PASS |
| 5 | Product Designation | A–Z | Individueller Kugelschreiber | ✅ PASS |

Sorting state is reflected in URL query parameters, enabling bookmarkable sorted views.

---

**TC-QUERY-F-007** | Req: SRS-FR-LIST-002 | Date: 2026-04-13 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Navigate to AAS List | All items displayed | Full product list loaded | ✅ |
| 2 | Verify test data inserted | Correct entries in table | All expected entries present | ✅ |
| 3 | Insert test queries into query bar | Output matches test data definition | All filter results matched expectations | ✅ |

**Test Data (TD-QUERY-F-007):**

| # | Query | Should Contain | Should NOT Contain | Result |
| :- | :---- | :------------- | :----------------- | :----- |
| 1 | `Kugelschreiber` | Individueller Kugelschreiber – Gottfried Wilhelm Leibniz Universität Hannover | — | ✅ PASS |
| 2 | `Kugelschreiber` | — | XITASO GmbH | ✅ PASS |
| 3 | `https://aas2.uni-h.de/lni0729` | https://aas2.uni-h.de/lni0729 | — | ✅ PASS |
| 4 | `https://` | — | No over-matching on partial URL prefix | ✅ PASS |

Filtering is case-insensitive and applies across all defined columns simultaneously. Filter state is also reflected in URL parameters.

---

### 7.4 TS-SHOPPING-CART-03 — Cart System

**TC-CART-C-008** | Req: SRS-FR-SHOP-001, SRS-FR-SHOP-005 | Date: 2026-04-14 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Click on cart icon in sidebar | Cart view displayed | Cart view rendered at `/cart` | ✅ |
| 2 | Navigate directly to `/cart` | Cart view displayed | Cart view loaded via direct URL | ✅ |
| 3 | Add products to cart | Sidebar counter increases | Counter badge updated in real-time | ✅ |

The badge is hidden when the cart is empty and appears only once an item is added. Real-time updates require no page reload.

---

**TC-CART-F-009** | Req: SRS-FR-SHOP-002, SRS-FR-SHOP-004 | Date: 2026-04-14 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Navigate to a product detail page | Product details displayed | Product detail view loaded with all submodel data | ✅ |
| 2 | Click "Add to cart" | Product added to cart | Product added; prompt offered "Go to Cart" or "Continue Shopping" | ✅ |
| 3 | Navigate to cart view | Product listed in cart | Product shown with ManufacturerName, ProductDesignation, OrderCode | ✅ |
| 4 | Add multiple different products | All products listed | All products listed; quantities initialized to 1 | ✅ |

**Test Data (TD-CART-F-009):**

| # | Product | Action | Expected in Cart | Result |
| :- | :------ | :----- | :--------------- | :----- |
| 1 | Individueller Kugelschreiber | Add once | Qty: 1 | ✅ PASS |
| 2 | XITASO GmbH product | Add twice | Qty: 2 | ✅ PASS |
| 3 | Any product | Do not add | Not listed | ✅ PASS |

Cart content is persisted in local storage and survives page reloads and browser restarts.

---

**TC-CART-F-010** | Req: SRS-FR-SHOP-003, SRS-FR-SHOP-006 | Date: 2026-04-14 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Add product to cart | Quantity = 1 | Initial quantity set to 1 | ✅ |
| 2 | Increase quantity | Quantity updated | Quantity increased; total price updated in real-time | ✅ |
| 3 | Decrease quantity | Quantity decreased | Quantity decreased correctly | ✅ |
| 4 | Set `SHOP_ENABLED_FLAG=false` and reload | Shop disabled/hidden | Cart icon gone from sidebar; `/cart` inaccessible | ✅ |
| 5 | Set `SHOP_ENABLED_FLAG=true` and reload | Shop enabled | Cart icon and `/cart` fully restored | ✅ |

**Test Data (TD-CART-F-010):**

| # | Initial Qty | Action | Expected Qty | Result |
| :- | :---------- | :----- | :----------- | :----- |
| 1 | 1 | Increase by 1 | 2 | ✅ PASS |
| 2 | 2 | Decrease by 1 | 1 | ✅ PASS |
| 3 | 1 | Decrease by 1 | Item removed; empty cart message shown | ✅ PASS |

The numeric input correctly rejects non-integer and negative values. The `SHOP_ENABLED_FLAG` leaves no remnant UI elements when disabled.

---

**TC-CART-C-011** | Req: SRS-FR-SHOP-007 | Date: 2026-04-15 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Set `SHOP_ENABLED_FLAG=true` and start app | Shop enabled | App started with shop active | ✅ |
| 2 | Navigate to product listing page | Products with price displayed | Price column visible in listing | ✅ |
| 3 | Inspect a product card | Price visible (numeric with currency) | Price displayed on each card | ✅ |
| 4 | Navigate to product detail page | Price shown in detail view | Price field present in detail view | ✅ |
| 5 | Verify multiple products | Each product shows its own price | Individual prices shown per product | ✅ |
| 6 | Set `SHOP_ENABLED_FLAG=false` and reload | No prices shown | No price elements rendered | ✅ |
| 7 | Navigate again to product listing | Products shown without prices | Listing loaded without any price fields | ✅ |

When a product has no defined price attribute, a fallback indicator is shown instead of an error. Total cart price recalculates correctly on quantity changes.

---

### 7.5 TS-NON-FUNCTIONAL-REQUIREMENTS-04 — Non-Functional Requirements

**TC-NFR-PERF-012** | Req: SRS-NFR-PERFORM-002 | Date: 2026-04-15 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Start all services in test environment | Services reachable | Docker Compose stack started; health checks passed | ✅ |
| 2 | Simulate 10 concurrent users with k6 | 10 VUs active | 10 VUs successfully spawned | ✅ |
| 3 | Execute typical user flows | All requests return HTTP 200 | 100% HTTP 200; no 4xx or 5xx errors | ✅ |
| 4 | Measure response times | Average < 1s | Avg ~420ms; p95 ~870ms — within threshold | ✅ |
| 5 | Monitor logs and resource usage | No errors or resource exhaustion | No errors; CPU peaked at ~60%; memory stable | ✅ |

---

**TC-NFR-SEC-013** | Req: SRS-NFR-SEC-001 | Date: 2026-04-16 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Start app with `LOG_LEVEL=info` | Logging initialized | Log output confirmed active | ✅ |
| 2 | Create a new repository | Log entry created | Entry with timestamp, action type, and resource ID logged | ✅ |
| 3 | Update repository configuration | Change logged | Update logged including changed values | ✅ |
| 4 | Delete repository | Deletion logged | Deletion event logged with repository ID | ✅ |
| 5 | Inspect log output | Contains timestamp, action, resource, user/context | All required fields present in JSON log entries | ✅ |

---

**TC-NFR-USE-014** | Req: SRS-NFR-UI-001 | Date: 2026-04-16 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Set viewport to 1920×1080 | Desktop layout correct | Desktop layout rendered; all columns visible | ✅ |
| 2 | Resize to 1024×768 | Layout adapts without overflow | Table columns rearranged; no horizontal scroll | ✅ |
| 3 | Resize to 375×667 (mobile) | Mobile layout activated | Navigation collapsed to burger menu | ✅ |
| 4 | Inspect DOM and CSS | No broken layouts or overlapping elements | No layout issues detected at any breakpoint | ✅ |
| 5 | Interact with UI in each viewport | All elements remain usable | All buttons, inputs, navigation usable at all sizes | ✅ |

This test previously failed in v1.1 due to BUG-UI-001 (overlapping elements on mobile). The fix was confirmed successful in this final run.

---

**TC-NFR-COMP-015** | Req: SRS-NFR-PORT-001 | Date: 2026-04-17 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Open in latest Chrome | No errors; UI correct | Rendered correctly; no console errors | ✅ |
| 2 | Open in latest Firefox | No errors; UI correct | Rendered correctly; no console errors | ✅ |
| 3 | Open in latest Safari | No errors; UI correct | Rendered correctly on macOS Safari | ✅ |
| 4 | Execute key workflows in all browsers | Consistent behavior | Identical behavior across all three browsers | ✅ |
| 5 | Check console and network tab | No browser-specific errors | No errors; all requests completed successfully | ✅ |

Minor visual differences in font rendering between Safari and Chrome were noted but are not functional defects.

---

**TC-NFR-MAINT-016** | Req: SRS-NFR-MAINT-001 | Date: 2026-04-17 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Install project dependencies | All tools available | `npm install` completed; ESLint and Prettier available | ✅ |
| 2 | Run `eslint` | No errors (exit code 0) | ESLint exited with code 0 | ✅ |
| 3 | Run `prettier --check` | All files compliant | No files required reformatting | ✅ |
| 4 | Run CI pipeline | Linting/formatting stage passes | GitHub Actions CI passed on main branch | ✅ |

---

### 7.6 TS-ARTIFICIAL-INTELLIGENCE-ANALYSIS-05 — AI-Based Analysis

**TC-QUALITY-AI-017** | AI-Based Static Code Analysis | Date: 2026-04-18 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Provide repository access to AI agent | Codebase ingested | All source files indexed | ✅ |
| 2 | Execute AI analysis with structured prompt | Categorized findings returned | Findings in categories: Security, Code Smells, Performance, Architecture | ✅ |
| 3 | Review reported issues | Findings traceable to code locations | All findings referenced file paths and line numbers | ✅ |
| 4 | Validate findings against manual review | Results consistent with expert evaluation | Consistent with internal reviews; no false critical findings | ✅ |

| # | Input | Key Findings | Action Taken |
| :- | :---- | :----------- | :----------- |
| 1 | Full repository | Minor: unused variables in 2 files; missing null-check in CartManager helper | Both fixed before release |
| 2 | Cart Service component | Price formatting logic should be extracted to utility function (maintainability) | Accepted and refactored |

---

**TC-QUALITY-AI-018** | AI-Based Log Analysis and Failure Detection | Date: 2026-04-18 | **✅ PASS**

| Step | Action | Expected Result | Observed Result | Status |
| :--- | :----- | :-------------- | :-------------- | :----- |
| 1 | Provide application logs to AI agent | Logs ingested | Log files confirmed ingested | ✅ |
| 2 | Run AI log analysis | Anomalies identified | Anomalies categorized by severity | ✅ |
| 3 | Request clustering of log entries | Meaningful failure clusters | Three clusters: API timeouts, UI rendering events, cart state changes | ✅ |
| 4 | Review root cause hypotheses | Plausible root causes with evidence | BUG-LOG-002 root cause (slow AAS response under load) correctly identified | ✅ |

AI-assisted log analysis reduced root cause identification time significantly compared to manual log inspection.

---

## 8. Test Execution Summary

| Metric | Value |
| :----- | :---- |
| Total Test Cases Executed | 18 |
| Passed | 18 |
| Failed | 0 |
| Blocked | 0 |
| **Pass Rate** | **100%** |
| Defects Found | 2 (both resolved before final release) |
| Open Defects at Release | 0 |

**Results by Test Suite:**

| Test Suite | Test Cases | Passed | Failed | Pass Rate |
| :--------- | :--------- | :----- | :----- | :-------- |
| TS-USER-01 (Login) | 1 | 1 | 0 | 100% |
| TS-REPOSITORY-02 (Repository) | 4 | 4 | 0 | 100% |
| TS-AAS-LIST (AAS List) | 2 | 2 | 0 | 100% |
| TS-SHOPPING-CART-03 (Cart) | 4 | 4 | 0 | 100% |
| TS-NON-FUNCTIONAL-04 (NFR) | 5 | 5 | 0 | 100% |
| TS-AI-ANALYSIS-05 (AI) | 2 | 2 | 0 | 100% |
| **Total** | **18** | **18** | **0** | **100%** |

**Execution Timeline:**

| Date | Activities |
| :--- | :--------- |
| 2026-04-10 | Code Freeze confirmed; initial static analysis and linting |
| 2026-04-11 | TC-LOGIN-C-001, TC-REPCOUNT-C-002, TC-CONFIG-F-003 |
| 2026-04-12 | TC-CONFIG-C-004, TC-CONFIG-C-005 |
| 2026-04-13 | TC-SORTING-F-006, TC-QUERY-F-007 |
| 2026-04-14 | TC-CART-C-008, TC-CART-F-009, TC-CART-F-010 |
| 2026-04-15 | TC-CART-C-011, TC-NFR-PERF-012 |
| 2026-04-16 | TC-NFR-SEC-013, TC-NFR-USE-014 |
| 2026-04-17 | TC-NFR-COMP-015, TC-NFR-MAINT-016 |
| 2026-04-18 | TC-QUALITY-AI-017, TC-QUALITY-AI-018 |
| 2026-04-24 | Final review and STR finalization |

---

## 9. Defect Reports

### BUG-UI-001: Overlapping Elements in Mobile View

| Field | Value |
| :---- | :---- |
| **ID** | BUG-UI-001 |
| **Found in** | TC-NFR-USE-014 (initial run, v1.1) |
| **Description** | Text elements overlapped in the cart view at 375×667 mobile viewport. A missing CSS media query breakpoint caused product name and price fields to overflow their containers. |
| **Priority** | Medium |
| **Assigned To** | Gregor Gottschewski |
| **Fix** | Added responsive breakpoint and adjusted flex layout in the cart item component |
| **Verified** | 2026-04-14 by Jan Kruske |
| **Status** | ✅ Closed / Resolved |

### BUG-LOG-002: AI-Detected Timeout Warning in Backend Logs

| Field | Value |
| :---- | :---- |
| **ID** | BUG-LOG-002 |
| **Found in** | TC-QUALITY-AI-018 |
| **Description** | Recurring timeout warnings during the load test — AAS API response time exceeded the default request timeout threshold under concurrent load. |
| **Priority** | Low |
| **Assigned To** | Bruno Lange |
| **Fix** | Added configurable `AAS_REQUEST_TIMEOUT_MS` environment variable with an increased default value |
| **Verified** | 2026-04-16 by Jan Kruske (re-run of TC-NFR-PERF-012) |
| **Status** | ✅ Closed / Resolved |

---

## 10. Deviations from the Test Plan

| # | Deviation | Reason | Impact |
| :- | :-------- | :----- | :----- |
| 1 | Exhaustive loop/path testing omitted | Time constraints; equivalence classes used instead | Low — critical paths and boundary values covered |
| 2 | Mock stubs substituted for live AAS API in some runs | Intermittent BaSyx API unavailability during execution | Low — stub accurately represents API contract; integration verified separately |
| 3 | TC-NFR-USE-014 failed in initial run (v1.1) | BUG-UI-001 present at first execution; fixed and re-verified | None at final release |

---

## 11. Traceability Matrix

| Requirement | TC-LOGIN-C-001 | TC-REPCOUNT-C-002 | TC-CONFIG-F-003 | TC-CONFIG-C-004 | TC-CONFIG-C-005 | TC-SORTING-F-006 | TC-QUERY-F-007 | TC-CART-C-008 | TC-CART-F-009 | TC-CART-F-010 | TC-CART-C-011 | TC-NFR-PERF-012 | TC-NFR-SEC-013 | TC-NFR-USE-014 | TC-NFR-COMP-015 | TC-NFR-MAINT-016 |
| :---------- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| SRS-FR-LOGI-001     | ✔ | | | | | | | | | | | | | | | |
| SRS-FR-LOGI-002     | ✔ | | | | | | | | | | | | | | | |
| SRS-FR-UI-001       | | ✔ | | | | | | | | | | | | | | |
| SRS-FR-REPO-001     | | | ✔ | | | | | | | | | | | | | |
| SRS-FR-CONFIG-001   | | | | ✔ | | | | | | | | | | | | |
| SRS-FR-CONFIG-002   | | | | | ✔ | | | | | | | | | | | |
| SRS-FR-LIST-001     | | | | | | ✔ | | | | | | | | | | |
| SRS-FR-LIST-002     | | | | | | | ✔ | | | | | | | | | |
| SRS-FR-LIST-003     | | | | | | ✔ | | | | | | | | | | |
| SRS-FR-SHOP-001     | | | | | | | | ✔ | | | | | | | | |
| SRS-FR-SHOP-002     | | | | | | | | | ✔ | | | | | | | |
| SRS-FR-SHOP-003     | | | | | | | | | | ✔ | | | | | | |
| SRS-FR-SHOP-004     | | | | | | | | | ✔ | | | | | | | |
| SRS-FR-SHOP-005     | | | | | | | | ✔ | | | | | | | | |
| SRS-FR-SHOP-006     | | | | | | | | | | ✔ | | | | | | |
| SRS-FR-SHOP-007     | | | | | | | | | | | ✔ | | | | | |
| SRS-NFR-PERFORM-002 | | | | | | | | | | | | ✔ | | | | |
| SRS-NFR-SEC-001     | | | | | | | | | | | | | ✔ | | | |
| SRS-NFR-UI-001      | | | | | | | | | | | | | | ✔ | | |
| SRS-NFR-PORT-001    | | | | | | | | | | | | | | | ✔ | |
| SRS-NFR-MAINT-001   | | | | | | | | | | | | | | | | ✔ |

**Coverage: 21 / 21 requirements — 100%**

---

## 12. System Evaluation

All functional and non-functional requirements from SRS v1.1 have been verified. The system meets all mandatory requirements. Optional requirements that were implemented (shop feature toggle, product price display) also passed their corresponding test cases.

Performance under concurrent load is within acceptable thresholds (~420ms avg, ~870ms p95). Asynchronous data loading and lazy thumbnail loading effectively reduce perceived latency and bandwidth consumption. The codebase is fully compliant with linting and formatting standards; no critical security vulnerabilities were found. Both defects identified during testing were resolved and verified before the final release.

The system is **ready for final delivery and handover**. The CI/CD pipeline passes on the main branch.

---

## 13. Conclusion and Outlook

All 18 test cases defined in STP v1.1 were executed and passed with a **100% pass rate**. Two defects were found during intermediate runs and fully resolved before the final execution.

**Key Findings:**
- **AI-assisted quality assurance** caught defects (CartManager null-check, API timeout root cause) that manual review had missed, proving its value as a supplementary QA method.
- **The four-eyes principle** maintained objectivity and prevented perception bias throughout all test activities.
- **BUG-UI-001** (mobile responsiveness) was the only functional failure across the entire test run, demonstrating overall high implementation quality.
- **Lazy loading and asynchronous data fetching** met performance targets under realistic concurrent load.

**Outlook:** Future iterations should consider automated regression tests (Selenium) for cart and login flows, AI-based log monitoring in production, and WCAG accessibility testing as an additional non-functional requirement.

The project team recommends the system for final delivery to the customer.

---

*Created by Jan Kruske (inf24027@lehre.dhbw-stuttgart.de)*  
