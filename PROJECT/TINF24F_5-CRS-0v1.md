# Customer Requirements Specification (CRS)

## Project: Eclipse Mnestix Product Catalog
**Version:** 1.9
**Author:** Julian Schumacher
**Date:** 26.10.2025
**Institution:** DHBW Stuttgart

---

## Document Version History
| Version | Date | Author | Change-description |
|----------|------|---------|-------------|
| 1.0 | 05.11.2025 | Julian Schumacher | Initial Version |

## Table of Contents
1. [Introduction](#1-introduction)
2. [Description of the Current Situation](#2-description-of-the-current-situation)
3. [Stakeholder Analysis](#3-stakeholder-analysis)
4. [Description of the Target Concept](#4-description-of-the-target-concept)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Constraints and Assumptions](#7-constraints-and-assumptions)
8. [Scope of Delivery](#8-scope-of-delivery)
9. [Acceptance Criteria](#9-acceptance-criteria)
10. [Conclusion](#10-conclusion)
11. [Glossary](#11-glossary)
12. [References](#12-references)

## 1. Introduction

The purpose of this document is to describe the customer requirements for the enhancement of the *Eclipse Mnestix Product Catalog Viewer* - as specified [here](https://github.com/DHBW-TINF24F/.github/blob/main/project5_mnestix_product_catalogue.md) on GitHub -, an open-source component within the Eclipse ecosystem that provides visualization and interaction capabilities for Asset Administration Shells (AAS). This document serves as a Customer Requirements Specification, written in accordance with the German standard **DIN 69901** for project management. It formulates the expectations, goals, and framework conditions from the customer’s perspective without prescribing technical implementation details.

The project aims to improve usability, configurability, performance, and functionality of the existing viewer while maintaining full compatibility with AAS v3 and BaSyx. The viewer will ultimately serve as a reference implementation for educational and industrial applications within the context of Industry 4.0, enabling users to explore digital representations of physical products, components, and systems in an intuitive and efficient manner.

---

## 2. Description of the Current Situation

<img width="2255" height="1802" alt="image" src="https://github.com/user-attachments/assets/a5380bd2-57de-4750-9e6e-5053cc0f5005" />

The current Mnestix Product Catalog Viewer is functional but limited in usability and scalability. While it can access and display AAS repositories, it targets engineers rather than general users and lacks intuitive navigation, visual feedback, and responsiveness.

The configuration dialog offers only minimal control over repositories. Users cannot enable or disable specific AAS sources dynamically, nor can they inspect Concept Description (CD) repositories in a meaningful way. Repository data is loaded synchronously, resulting in blocking user interfaces and poor responsiveness when large datasets or slow servers are involved. The login status is not persistently visible, which can lead to confusion about authentication states, especially when interacting with multiple back-end servers.

In the product list, assets of all kinds are shown without distinction between actual product types and auxiliary entries. This results in cluttered views that reduce usability. Sorting and filtering options are either limited or unavailable. Moreover, the display of images and submodel data is inefficient, as all assets are loaded at once, including non-visible thumbnails. The presentation of technical data and documentation submodels is inconsistent and visually unstructured.

These limitations hinder the viewer’s effectiveness as a user-friendly product catalog for industrial use cases and educational demonstrations. While the system successfully connects to BaSyx servers and fetches AAS data, its interaction design and performance characteristics do not yet reflect the standards expected from a digital twin browser in a modern Industry 4.0 context.

---


## 3. Stakeholder Analysis

| Stakeholder | Role / Interest | Expectations | Influence |
|--------------|----------------|---------------|-----------|
| **End Users (Engineers, Product Managers)** | Daily users of the catalog | Simple navigation, clear data presentation, stable performance | High |
| **Developers / Maintainers** | Implement new features and fix issues | Clean modular architecture, minimal technical debt, good documentation | High |
| **Eclipse & IDTA** | Ecosystem coordinators | Alignment with Industry 4.0 standards | Medium |
| **Academic Supervisors / Project Sponsors** | Oversight and evaluation | Comprehensive documentation, measurable improvement and requirement satisfaction | Medium |
| **Community Contributors** | Potential future maintainers | Clear contribution guidelines, usable interface, understandable codebase | Low |

---

## 4. Description of the Target Concept

The target concept envisions a significantly improved Mnestix Viewer that combines technical accuracy with user-centered design. The enhanced system shall provide a clear, responsive, and intuitive web interface that continuously displays the login status, offers refined configuration capabilities, and supports asynchronous data handling. The overall goal is to achieve an interaction flow that allows both technical and non-technical users to navigate through large sets of digital twins without performance bottlenecks or unnecessary cognitive load, so more users can benefit from the AAS ecosystem. Simultaneously, this will enable user to access relevant product information quickly on the go through mobile devices and mobile networks, which may have limited bandwidth or limit ed data plans.

In the configuration view, users will be able to add, remove, and manage AAS repositories dynamically. They will also have the possibility to enable or disable individual repositories without modifying configuration files manually. The system shall present Concept Description repositories as inspectable entities, allowing users to view semantic definitions and relationships that underpin the AAS structure. These configuration options will be persisted locally, ensuring that user preferences remain intact between sessions.

The catalog view shall display all connected repositories together with a visible count of contained product entries. This gives immediate feedback on repository content and data availability. The product list will implement non-blocking, asynchronous loading mechanisms to ensure that data retrieval never freezes the UI. The viewer will display only AAS instances whose AssetKind is “Type”, while those marked “NotApplicable” will be excluded to maintain relevance. Sorting and filtering operations will be available through query parameters and on-screen controls, enabling users to organize product data by manufacturer, product designation, or order code. Thumbnail images will be loaded on demand for visible items only, reducing unnecessary bandwidth consumption and improving performance on slow connections or devices.

The product detail view will integrate the external **Nameplate Generator** (as specified on GitHub [here](https://github.com/ttrsf/TINF22F-Team2-Nameplate-Generator)) to allow the creation of standardized digital nameplates directly from an AAS instance, in order to comply with future standards of industry 4.0 environments. The Nameplate Generator integration ensures compliance with relevant DIN and IEC standards for digital product passports. Furthermore, it will display structured submodels for Technical Data, Bill of Material (BOM), and Handover Documentation in a consistent and readable format. The BOM section will provide interactive links to related AAS entries, thereby supporting the exploration of hierarchical product structures. Finally, an additional eShop module will allow actions such as “Add to Cart” and “Show Cart”, preparing the foundation for transactional extensions in later project phases and providing a more consistent and familiar user experience.

The system remains compatible with BaSyx and existing AAS servers while improving stability and usability. It will serve as a demonstrator that bridges the gap between industrial semantics and real-world usability.

---

## 5. Functional Requirements

| Requirement ID | Short Description | Details |
|----------------|------------------|---------|
| FR-001 | The system shall display the user login status permanently in the header section. | Provides immediate authentication feedback and maintains a visible login indicator throughout the session. |
| FR-002 | The new login button shall take over all the features of the existing login button | All features, including menus, error handling etc. shall be preserved. |
| FR-003 | The number of AAS entries per repository shall be displayed | in the repository overview, there shall be a number indicating the count of AAS entries available in each repository. |
| FR-004 | The Nameplate Generator shall be integrated into the product detail view | The Nameplate Generator shall be accessible via the context menu in the product detail view, using the fiven implementation repository, which can be found [here](https://github.com/ttrsf/TINF22F-Team2-Nameplate-Generator) |
| FR-005 | The system shall display multiple columns in the AAS list | for better overview and usability, the AAS list shall display multiple columns, including ManufacturerName, ProductDesignation, OrderCode, ManufacturerCode, globalAssetId and createdAt. |
| FR-006 | The system shall allow users to filter the AAS list based on query parameters | The AAS list shall support filtering based on the attributes ManufacturerName, ProductDesignation, OrderCode, ManufacturerCode, globalAssetId and createdAt via URL parameters. |
| FR-007 | The system shall allow users to sort the AAS list by any available column | The AAS list shall support sorting based on the attributes ManufacturerName, ProductDesignation, OrderCode, ManufacturerCode, globalAssetId and createdAt via columns or query parameters as specified in FR-005. |
| FR-008 | The system shall provide a cart view | For the extended eShop funtionality, the system shall provide a cart view accesible via the sidebar or via url with the path /cart. |
| FR-009 | The system shall list all products added to the cart in the cart view | The cart view shall list all products added to the cart, displaying at least the ManufacturerName, ProductDesignation and OrderCode of each product. |
| FR-010 | product quantities should be editable in the cart | The system shall provide the user with the option to modify the quantity of each product in the cart. |
| FR-011 | The system shall provide the option to add products to the cart | In the product detail view, the system shall provide an "Add to Cart" button that allows users to add the currently viewed product to their cart. |
| FR-012 | The sidebar shall indicate the total number of products in the cart | The sidebar shall display a cart icon with a badge or number indicating the total number of products currently in the cart. |
| FR-013 | The eShop System shall be disableable via configuration | The eShop functionality shall be optional and can be enabled or disabled via the `.env` file with the flag `SHOP_ENABLED_FLAG`. |
| FR-014 | The system shall support integration with an external payment gateway | The eShop system shall be designed to allow future integration with external payment gateways for processing transactions. |
| FR-015 | The system shall display product prices | In the product overview there shall be a price attribute displayed for each product, which is also reflected in the cart view, if the eShop module is active. |
| FR-016 | The system shall allow users to enable or disable individual AAS repositories | Users shall be able to enable or disable specific AAS repositories through the configuration view without removing them entirely. |
| FR-017 | The system shall allow users to enable or disable individual CD repositories | Users shall be able to enable or disable specific CD repositories through the configuration view without removing them entirely. |
| FR-018 | Users shall be able to inspect the content of CD repositories | The system shall allow users to view the content of CD repositories through the user interface. |
| FR-019 | The `SMTechnicalData` formatting shall be improved | The `SMTechnicalData` submodel shall be presented in a structured layout with consistent column widths, readable formatting, and clear section labels for better readability. |
| FR-020 | The `SMHandoverDocumentation` formatting shall be improved | The `SMHandoverDocumentation` submodel shall be presented in a structured layout with consistent column widths, readable formatting, and clear section labels for better readability. |
| FR-021 | Navigating through linked AAS references should be possible (Bill of material) | The system shall allow navigation through linked AAS references within submodel visualizations. |
| FR-022 | The product list view shall retrieve AAS data asynchronously to avoid blocking the interface. | Ensures a non-blocking interface and optimized performance, especially on mobile networks. |
| FR-023 | The product list view shall load thumbnails and other media content lazily, restricted to visible items on screen. | Loads only visible media elements to conserve data and improve performance. |


---

## 6. Non-Functional Requirements

The non-functional requirements define qualitative aspects that determine the overall quality of the viewer. The system must be reliable, efficient, maintainable, and user-friendly while remaining compliant with Eclipse licensing and open-source standards.

### 6.1 Usability

The user interface must follow modern design principles of clarity, consistency, and intuitive interaction. Navigation elements shall be uniformly placed and labeled. Error messages must be understandable to non-technical users and provided in the same language the system is provided in. Visual feedback should indicate ongoing loading operations and completed actions. All user-flows - from repository configuration to product inspection - must be accomplishable with minimal clicks and without manual page reloads. Color schemes should ensure sufficient contrast and readability in both light and dark modes.

### 6.2 Reliability

The system must remain stable under varying network conditions. It shall handle network timeouts, invalid responses, and unavailable repositories without causing crashes or data loss. A mechanism for graceful degradation shall ensure that essential functions remain operational even when some data sources are offline. Session management must be robust, preserving login state until explicit logout or session timeout. Any unexpected behavior must be logged for later analysis.

### 6.3 Efficiency

Performance is a central criterion for user acceptance. Repository data must load asynchronously, with visual content rendered incrementally to minimize perceived latency. Caching strategies shall reduce redundant requests. Memory consumption must remain within reasonable limits to allow operation on standard hardware and common web browsers.

### 6.4 Modifiability

Since the Mnestix project is open source, the system must be easy to extend and modify. The codebase should follow clean architecture principles with clear separation of concerns between UI logic and data handling. Components should be modular and self-contained to enable independent enhancements. Documentation and comments must explain dependencies and data flows clearly to facilitate contributions from external developers.
All contributions in this project must comply with project guidelines and also be open-source.

### 6.5 Portability

The application must run on all major desktop operating systems through standard web browsers. No installation beyond accessing a URL should be required. The system should be deployable in local networks for testing and accessible via public servers for demonstration purposes. Platform-specific dependencies must be minimized to ensure cross-compatibility and long-term maintainability.

### 6.6 Maintainability

As an open-source project, the system must be modular, well-documented, and easy to extend.
The project must include adequate documentation covering architecture, setup, and usage. Automated tests for key functions shall verify system stability where possible.

### 6.7 Risk Acceptance

Known risks include possible incompatibilities between BaSyx server versions, delays in repository responses, and potential merge conflicts when integrating changes into the official Eclipse Mnestix repository. These risks are considered acceptable within the scope of an educational and open-source project, provided that regular testing and synchronization with upstream branches are performed. The system should include fallback mechanisms to mitigate temporary service outages.

---

## 7. Constraints and Assumptions

### 7.1 Constraints
- The system must remain open-source under the **Eclipse Public License (EPL)**.
- All developments must align with the **Eclipse Mnestix architecture**.
- Dependencies must be compatible with **modern browsers (Chrome, Firefox, Edge)**.
- Development shall use the existing **Node.js + React** technology stack.

---

## 8. Scope of Delivery

The final delivery will include the enhanced Mnestix Product Catalog Viewer source code with all implemented improvements merged into a public repository. Comprehensive documentation will describe installation, configuration, and usage procedures. A test documentation will be provided to verify functionality. The deliverables will also include a short presentation demonstrating the improved user interface and performance characteristics.

---

## 9. Acceptance Criteria

The system will be accepted if it meets all functional and non-functional requirements, including visible login status, dynamic configuration, stable Nameplate Generator integration, and responsive data handling. Performance benchmarks must confirm that the system responds within the defined time constraints. Only when these criteria are met will the system be considered ready for final review and contribution to the Eclipse Mnestix project.

## 9.1. Acceptance Test Cases

| ID | Description | Verification Method |
|----|--------------|----------------------|
| AC-01 | Login status is always visible in the header. | Manual UI Test |
| AC-02 | Repositories can be added, disabled, and viewed. | Functional Test |
| AC-03 | Product list supports filtering and sorting. | Integration Test |
| AC-04 | Nameplate Generator is accessible via the product view. | Functional Test |
| AC-05 | Non-blocking repository loading confirmed. | Performance Test |
| AC-06 | eShop features (cart, add/remove items) function as expected. | User Acceptance Test |
| AC-07 | System runs stably with multiple AAS servers. | System Test |

---

## 10. Conclusion

This Customer Requirements Specification defines the expectations and quality criteria for the enhancement of the Eclipse Mnestix Product Catalog Viewer. It serves as the foundation for further technical specifications and development planning. The improved viewer will represent a significant step toward a usable and scalable Industry 4.0 visualization tool, bridging the gap between complex industrial data structures and an accessible user experience. By fulfilling the requirements described herein, the project contributes not only to the Eclipse open-source ecosystem but also to the broader goal of advancing digital twin technologies in education and industry.

---

## 11. Glossary

| Term | Definition |
|------|-------------|
| **AAS (Asset Administration Shell)** | Digital representation of an industrial asset in the context of Industry 4.0. |
| **BaSyx** | Eclipse framework providing middleware for Industry 4.0 systems. |
| **IDTA** | Industrial Digital Twin Association — maintains AAS specifications. |
| **Repository** | A data source containing AAS objects. |
| **Nameplate Generator** | External service generating standardized digital nameplates for products. |
| **SM (Submodel)** | A specific subset of AAS data describing one aspect of an asset. |
| **Mnestix** | Open-source browser and visualization tool for AAS data. |

---

## 12. References
1. [Eclipse Mnestix Project](https://github.com/eclipse-mnestix/mnestix-browser)
2. [Project Specification](https://github.com/DHBW-TINF24F/.github/blob/main/project5_mnestix_product_catalogue.md)
3. [AASX Package Explorer](https://github.com/eclipse-aaspe/package-explorer)
4. [Eclipse BaSyx](https://basyx.org/get-started/introduction)
5. [IDTA Specifications](https://industrialdigitaltwin.org/content-hub/downloads)
6. [Nameplate Generator Project](https://github.com/ttrsf/TINF22F-Team2-Nameplate-Generator)
