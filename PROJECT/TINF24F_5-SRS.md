# Software Requirements Specification

**Revision history:** This SRS is tracked with Git.
See the commit history on [GitHub](https://github.com/DHBW-TINF24F/Team5-management-and-docs/commits/).

This Software Requirements Specification (SRS) specifies the work of group 5.
The software and this specification was developed in connection with a university project.

**Author:** Gregor Gottschewski

**Date of last revision:** 25.03.2026

> Read the [IEEE Guide to Software Requirements Specifications](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=278253) or [IEEE Recommended Practice for Software Requirements Specifications](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=720574) before contributing to the SRS.

## Version history

| Version | Changes                                  | Authors             | Date       |
|---------|------------------------------------------|---------------------|------------|
| 1.0     | Initial SRS state                        | Gregor Gottschewski | 18.11.2025 |
| 1.1     | Update requirement IDs and sync with CRS | Gregor Gottschewski | 25.03.2026 |

## Table of Contents

1. [Introduction](#1-introduction)  
   1.1. [Purpose](#11-purpose)  
   1.2. [Definitions and Acronyms](#12-definitions-and-acronyms)  
   1.3. [Scope](#13-scope)  
   1.4. [References](#14-references)  
   1.5. [Overview](#15-overview)
2. [Overall Description](#2-overall-description)  
   2.1. [Product Perspective](#21-product-perspective)  
    2.1.1. [System interfaces](#211-system-interfaces)  
    2.1.2. [User Interfaces](#212-user-interfaces)  
    2.1.3. [Operations](#213-operations)  
   2.2. [Product Functions](#22-product-functions)  
   2.3. [User Characteristics](#23-user-characteristics)  
   2.4. [Limitations](#24-limitations)  
   2.5. [Assumptions and dependencies](#25-assumptions-and-dependencies)
3. [Specific features](#3-specific-features)  
   3.1. [Non-Functional Requirements](#31-non-functional-requirements-nfr)  
   3.2. [External interface requirements](#32-external-interface-requirements)  
    3.2.1. [Availability](#321-availability)  
    3.2.2. [Security and privacy](#322-security-and-privacy)  
    3.2.3. [Maintainability](#323-maintainability)  
4. [Verification](#4verification)  

## 1. Introduction

### 1.1. Purpose

The purpose of this document is to define user interface extensions for the Mnestix Browser.

The following specification is written for the developer team and the customer.
Secondary readers include computer science students.  
Required for reading this specification is knowledge about the Mnestix Browser and its current features (as of 2025-10-03).

### 1.2. Definitions and Acronyms

**_SRS_** is the acronym for Software Requirements Specification.  
**_The software_** refers to all software parts specified here.  
**_The developer team_** includes all developers and organizations listed [here](index#software-requirements-specification).  
**_Extensions_** are further developments of the already existing code base of the Mnestix Browser if not stated further.  
**_The customer_** is the supervising lecturer.  
**_UI_** is an acronym for user interface.  
**_Mnestix_** is a short form of Mnestix Browser.  
**_Power users_** are software users that spend a long time using the software.  
**_Regular users_** are software users that use the software sometimes.  
**_Guest_** is a user that is not registered at the Mnestix Browser instance.  
**_Product_** is a synonym for AAS.

This specification uses terms 'modern hardware' and 'stable connection to the backend' often.
The software was tested on a state of the art with a local Mnestix Browser build.
All loading times refer to this machine and environment.
Note that the repository size influences the loading time.
This software was tested with a 100 item repository.

### 1.3. Scope

The name of the product specified here is _Project Bisasam_.
Project Bisasam refers only to the extensions specified later.
The name Mnestix stays.

Project Bisasam extends the usability and functionality of Mnestix' catalogue feature.
These extensions affect the catalogue/repository dashboard, the product list, the product view and the menu bar.
Project Bisasam covers only the UI extensions specified in this SRS.
All changes strictly refer to the UI.

The goal of project Bisasam is to add additional UI features to increase the Mnestix user experience.

### 1.4. References

- Feature requests where made by our supervising lecturer and can be found at the [DHBW-TINF24F GitHub Organization (root/project-5)](https://github.com/DHBW-TINF24F/.github/blob/main/project5_mnestix_product_catalogue.md)
- The structure of this SRS follows the [ISO/IEC/IEEE 29148:2018 standard](https://ieeexplore.ieee.org/document/8559686)
- Information about Mnestix Browser can be found on [Mnestix-Browser GitHub](https://github.com/eclipse-mnestix/mnestix-browser)
- Requirements table follows [ISO/IEC/IEEE 29148 standard](https://ieeexplore.ieee.org/document/8559686)

### 1.5. Overview

This SRS follows ISO/IEC/IEEE standard 29148:2018 and the older standard IEEE 830-1984.

## 2. Overall description

### 2.1. Product perspective

Project Bisasam extends the product catalog functionality of the [Mnestix Browser](https://github.com/eclipse-mnestix/mnestix-browser/).
The Mnestix Browser simplifies the implementation and visualization of the Asset Administration Shell (AAS).
The new features are implemented by direct modifications to the Mnestix code base.
All interfaces are integrated with existing Mnestix modules.

#### 2.1.1. System interfaces

Communication between Mnestix Browser and Project Bisasam is handled internally.
These APIs are developed by the Mnestix developer team.
Bisasam uses the existing Next.js and TypeScript framework (like Mnestix itself) and does not modify the application architecture.
Project Bisasam requires no other services.

#### 2.1.2. User interfaces

Bisasam enhances catalog management, repository configuration, and product visualization.  
All new UI elements are integrated into the existing Mnestix UI.

Users interact with project Bisasam's extension on all views.
Some extensions affect the repository configuration view and the catalog selection view.
The product view, responsible for listing all products, and the product detail view are part of project Bisasam's extensions.
These changes keep all extisting Mnestix' UI principles.

These changes follow Mnestix’s existing design principles.
All affected elements are configurable and/or selectable by the user.

See the wireframes at [specific requirements](#3-specific-features).

#### 2.1.3. Operations

Project Bisasam shall maintain the existing administration behaviour.
Some new features add additional log messages to provide information.
These log messages are not specified and will only be added if necessarily need for development or administration.

### 2.2. Product functions

The software adds new UI elements and features stated in section [User interfaces](#user-interfaces).
The following content adds additional, non UI-features, and refers to user interfaces.

To increase Mnestix Browser's performance, the code base of the product list should be extended.
Thumbnails shall only load on the user's visible screen.
Additionally to performance improvements, the user experience shall be increased.
These new features cover filtering, sorting and detailed product information.
Some features do not enhance existing features but add new features.
Part of this are eShop interactions and integration of an external nameplate generator.

### 2.3 User characteristics

Mnestix Browser and the corresponding project Bisasam user group is diverse.

Four types of users uses Mnestix Browser (see the [CRS](https://github.com/DHBW-TINF24F/Team5-Mnestix-Docs/PROJECT/CRS.md)): administrators, power users, regular users and guests.
All user groups benefit from project Bisasam's new features.
However, the focus shall be the regular and power users as well as the administrator.
These user groups need fast and reliable features.

The cart and shop feature is the most critical part of project Bisasam.
It has to be accessible for every user group and should bring all relevant information about the selected products.

> See [limitations](#limitations) for more information about the shop.
> Project Bisasam assumes that guests are called upon to register before buying a product.

Project Bisasam shall preserve the existing Mnestix user management functionality unchanged.

### 2.4. Limitations

Project Bisasam covers a shop function with a cart.
Money transactions are outside the scope of this project.

### 2.5. Assumptions and dependencies

- No second Mnestix Browser version is running at the same time
- No modifications of the core Mnestix Browser are allowed
- The Mnestix Browser fork of project Bisasam is installed correctly

## 3. Specific features

Project Bisasam shall add following features to Mnestix Browser.

Verification methods:

- **Test:** Tested by running the system and with logic tests.
- **Demonstration:** Show feature in running system, requirement is visible to user.
- **Inspection:** Requirement can be checked with code analysis or UI-layout-analysis.
- **Load Test:** Requirement can be tested on modern hardware with an automatic or manual load test.

**Overview for navigation:**

### Functional Requirements

**Login Button**
1. [SRS-FR-LOGI-001 - Login Status Display](#srs-fr-logi-001-login-status-display)
2. [SRS-FR-LOGI-002 - Login Button Functionality](#srs-fr-logi-002-login-button-functionality)

**AAS List**  
3. [SRS-FR-LIST-001 - Changed AAS Columns](#srs-fr-list-001-changed-aas-columns)  
4. [SRS-FR-LIST-002 - AAS List Filtering](#srs-fr-list-002-aas-list-filtering)  
5. [SRS-FR-LIST-003 - AAS List Sorting](#srs-fr-list-003-aas-list-sorting)  

**E-Shop-Feature**  
6. [SRS-FR-SHOP-001 - Cart View Access](#srs-fr-shop-001-cart-view-access)  
7. [SRS-FR-SHOP-002 - Cart Products](#srs-fr-shop-002-cart-products)  
8. [SRS-FR-SHOP-003 - Cart Quantity](#srs-fr-shop-003-cart-quantity)  
9. [SRS-FR-SHOP-004 - Add to Cart Button](#srs-fr-shop-004-add-to-cart-button)  
10. [SRS-FR-SHOP-005 - Cart Count Indicator](#srs-fr-shop-005-cart-count-indicator)  
11. [SRS-FR-SHOP-006 - Shop Feature Configuration](#srs-fr-shop-006-shop-feature-configuration)  
12. [SRS-FR-SHOP-007 - Product Price Display](#srs-fr-shop-007-product-price-display)  

**CD-Repositories**  
13. [SRS-FR-CONFIG-001 - CD Repository Configuration](#srs-fr-config-001-cd-repository-configuration)  
14. [SRS-FR-CONFIG-002 - CD Repository Content Inspection](#srs-fr-config-002-cd-repository-content-inspection)  

**Minor UI changes**  

15. [SRS-FR-UI-002 - TechnicalData Submodel Formatting](#srs-fr-ui-002-technicaldata-submodel-formatting)  
16. [SRS-FR-UI-003 - HandoverDocumentation Submodel Formatting](#srs-fr-ui-003-handoverdocumentation-submodel-formatting)  
17. [SRS-FR-LINKED-001 - Linked AAS Navigation](#srs-fr-linked-001-linked-aas-navigation)  

**Other:**

18. [SRS-FR-UI-001 - Repository AAS Entry Count](#srs-fr-ui-001-repository-aas-entry-count)
19. [SRS-FR-NPG-001 - Nameplate Generator](#srs-fr-npg-001-nameplate-generator)

### Non-Functional Requirements

1. [SRS-NFR-PERFORM-001 - AAS List Load Performance](#srs-nfr-perform-001-aas-list-load-performance)
2. [SRS-NFR-PERFORM-002 - Concurrent User Support](#srs-nfr-perform-002-concurrent-user-support)
3. [SRS-NFR-PERFORM-003 - Thumbnail Lazy Loading](#srs-nfr-perform-003-thumbnail-lazy-loading)
4. [SRS-NFR-SEC-001 - Configuration Change Logging](#srs-nfr-sec-001-configuration-change-logging)
5. [SRS-NFR-UI-001 - Responsive Interface](#srs-nfr-ui-001-responsive-interface)
6. [SRS-NFR-PORT-001 - Browser Compatibility](#srs-nfr-port-001-browser-compatibility)
7. [SRS-NFR-SHOP-LANG-001 - Multilingual Support](#srs-nfr-shop-lang-001-multilingual-support)
8. [SRS-NFR-MAINT-001 - Code Quality Standards](#srs-nfr-maint-001-code-quality-standards)

### SRS-FR-LOGI-001 Login Status Display

| ID                  | SRS-FR-LOGI-001                                                                                                                  |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------|
| Reference (CRS)     | [LOGI-FR-001](/PROJECT/TINF24F_5-CRS-0v1.3.md#51-login-logi)                                                                     |
| Reference (SAS)     | [FR.001](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                                        |
| Description         | The system shall display a symbol in the upper-right corner of the menu bar that indicates the current login status of the user. |
| Priority            | Required                                                                                                                         |
| Verification Method | Inspection                                                                                                                       |
| Wireframe           | ![](/PROJECT/assets/srs/fr.001.svg)                                                                                              |

### SRS-FR-LOGI-002 Login Button Functionality

| ID                  | SRS-FR-LOGI-002                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------------|
| Reference (CRS)     | [LOGI-FR-002](/PROJECT/TINF24F_5-CRS-0v1.3.md#51-login-logi)                                        |
| Reference (SAS)     | [FR.002](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                              |
| Description         | All functions and menus of the existing login status button shall be moved to the new login button. |
| Priority            | Optional                                                                                            |
| Verification Method | Demonstration                                                                                       |

### SRS-FR-UI-001 Repository AAS Entry Count

| ID                  | SRS-FR-UI-001                                                                                                          |
|---------------------|------------------------------------------------------------------------------------------------------------------------|
| Reference (CRS)     | [UI-FR-001](/PROJECT/TINF24F_5-CRS-0v1.3.md#52-uiux-ui)                                                                |
| Reference (SAS)     | [FR.003](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system shall display the number of AAS entries per repository in the repository view, next to the repository name. |
| Priority            | Required                                                                                                               |
| Verification Method | Test                                                                                                                   |
| Wireframe           | ![](/PROJECT/assets/srs/fr.003.svg)                                                                                    |

### SRS-FR-NPG-001 Nameplate Generator

| ID                  | SRS-FR-NPG-001                                                                                                                      |
|---------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| Reference (CRS)     | [NPG-FR-001](/PROJECT/TINF24F_5-CRS-0v1.3.md#54-nameplate-generator-npg)                                                            |
| Reference (SAS)     | [FR.004](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system shall provide access to the Nameplate Generator from the product context menu using the given implementation repository. |
| Priority            | Required                                                                                                                            |
| Verification Method | Test                                                                                                                                |
| Wireframe           | ![](/PROJECT/assets/srs/fr.004.svg)                                                                                                 |

### SRS-FR-LIST-001 Changed AAS Columns

| ID                  | SRS-FR-LIST-001                                                                                                                                                   |
|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Reference (CRS)     | [LIST-FR-001](/PROJECT/TINF24F_5-CRS-0v1.3.md#53-aas-list-list)                                                                                                   |
| Reference (SAS)     | [FR.005](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system shall display the columns `ManufacturerName`, `ProductDesignation`, `OrderCode`, `ManufacturerCode`, `GlobalAssetId`, and `CreatedAt` in the AAS list. |
| Priority            | Required                                                                                                                                                          |
| Verification Method | Inspection                                                                                                                                                        |
| Wireframe           | ![](/PROJECT/assets/srs/fr.005.svg)                                                                                                                               |

### SRS-FR-LIST-002 AAS List Filtering

| ID                  | SRS-FR-LIST-002                                                                |
|---------------------|--------------------------------------------------------------------------------|
| Reference (CRS)     | [LIST-FR-002](/PROJECT/TINF24F_5-CRS-0v1.3.md#53-aas-list-list)                |
| Reference (SAS)     | [FR.006](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system shall allow users to filter the AAS list based on query parameters. |
| Priority            | Required                                                                       |
| Verification Method | Test                                                                           |
| Wireframe           | ![](/PROJECT/assets/srs/fr.006.svg)                                            |

### SRS-FR-LIST-003 AAS List Sorting

| ID                  | SRS-FR-LIST-003                                                                    |
|---------------------|------------------------------------------------------------------------------------|
| Reference (CRS)     | [LIST-FR-003](/PROJECT/TINF24F_5-CRS-0v1.3.md#53-aas-list-list)                    |
| Reference (SAS)     | [FR.007](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system shall allow users to sort the AAS list entries by any available column. |
| Priority            | Required                                                                           |
| Verification Method | Test                                                                               |

### SRS-FR-SHOP-001 Cart View Access

| ID                  | SRS-FR-SHOP-001                                                  |
|---------------------|------------------------------------------------------------------|
| Reference (CRS)     | [SHOP-FR-001](/PROJECT/TINF24F_5-CRS-0v1.3.md#58-eshop-shop)     |
| Reference (SAS)     | [FR.008](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system shall provide a cart view accessible via the sidebar. |
| Priority            | Required                                                         |
| Verification Method | Test                                                             |
| Wireframe           | ![](/PROJECT/assets/srs/fr.008.svg)                              |

### SRS-FR-SHOP-002 Cart Products

| ID                  | SRS-FR-SHOP-002                                                        |
|---------------------|------------------------------------------------------------------------|
| Reference (CRS)     | [SHOP-FR-002](/PROJECT/TINF24F_5-CRS-0v1.3.md#58-eshop-shop)           |
| Reference (SAS)     | [FR.009](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system shall list all products added to the cart in the cart view. |
| Priority            | Required                                                               |
| Verification Method | Test                                                                   |
| Wireframe           | ![](/PROJECT/assets/srs/fr.009.svg)                                    |

### SRS-FR-SHOP-003 Cart Quantity

| ID                  | SRS-FR-SHOP-003                                                               |
|---------------------|-------------------------------------------------------------------------------|
| Reference (CRS)     | [SHOP-FR-003](/PROJECT/TINF24F_5-CRS-0v1.3.md#58-eshop-shop)                  |
| Reference (SAS)     | [FR.010](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system shall allow users to edit product quantities within the cart view. |
| Priority            | Required                                                                      |
| Verification Method | Test                                                                          |
| Wireframe           | ![](/PROJECT/assets/srs/fr.010.svg)                                           |

### SRS-FR-SHOP-004 Add to Cart Button

| ID                  | SRS-FR-SHOP-004                                                                                           |
|---------------------|-----------------------------------------------------------------------------------------------------------|
| Reference (CRS)     | [SHOP-FR-004](/PROJECT/TINF24F_5-CRS-0v1.3.md#58-eshop-shop)                                              |
| Reference (SAS)     | [FR.011](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | Each product view shall contain an "Add to cart" button allowing the user to add the product to the cart. |
| Priority            | Required                                                                                                  |
| Verification Method | Test                                                                                                      |
| Wireframe           | ![](/PROJECT/assets/srs/fr.011.svg)                                                                       |

### SRS-FR-SHOP-005 Cart Count Indicator

| ID                  | SRS-FR-SHOP-005                                                               |
|---------------------|-------------------------------------------------------------------------------|
| Reference (CRS)     | [SHOP-FR-005](/PROJECT/TINF24F_5-CRS-0v1.3.md#58-eshop-shop)                  |
| Reference (SAS)     | [FR.012](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The sidebar shall display the total number of products currently in the cart. |
| Priority            | Required                                                                      |
| Verification Method | Inspection                                                                    |
| Wireframe           | ![](/PROJECT/assets/srs/fr.012.svg)                                           |

### SRS-FR-SHOP-006 Shop Feature Configuration

| ID                  | SRS-FR-SHOP-006                                                                                       |
|---------------------|-------------------------------------------------------------------------------------------------------|
| Reference (CRS)     | [SHOP-FR-006](/PROJECT/TINF24F_5-CRS-0v1.3.md#58-eshop-shop)                                          |
| Reference (SAS)     | [FR.013](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system should allow enabling or disabling the shop functionality through an environment variable. |
| Priority            | Optional                                                                                              |
| Verification Method | Inspection                                                                                            |

### SRS-FR-SHOP-007 Product Price Display

| ID                  | SRS-FR-SHOP-008                                                                     |
|---------------------|-------------------------------------------------------------------------------------|
| Reference (CRS)     | [SHOP-FR-007](/PROJECT/TINF24F_5-CRS-0v1.3.md#58-eshop-shop)                        |
| Reference (SAS)     | [FR.015](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system should display a price for each product when the shop module is enabled. |
| Priority            | Optional                                                                            |
| Verification Method | Inspection                                                                          |
| Wireframe           | ![](/PROJECT/assets/srs/fr.015.svg)                                                 |

### SRS-FR-REPO-001 AAS Repository Configuration

| ID                  | SRS-FR-REPO-001                                                                                                |
|---------------------|----------------------------------------------------------------------------------------------------------------|
| Reference (CRS)     | [REPO-FR-001](/PROJECT/TINF24F_5-CRS-0v1.3.md#510-aas-repositories-repo)                                       |
| Reference (SAS)     | [FR.016](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system shall allow users to enable or disable individual AAS repositories within the configuration dialog. |
| Priority            | Required                                                                                                       |
| Verification Method | Test                                                                                                           |
| Wireframe           | ![](/PROJECT/assets/srs/fr.016.svg)                                                                            |

### SRS-FR-CONFIG-001 CD Repository Configuration

| ID                  | SRS-FR-CONFIG-001                                                                           |
|---------------------|---------------------------------------------------------------------------------------------|
| Reference (CRS)     | [CONFIG-FR-001](/PROJECT/TINF24F_5-CRS-0v1.3.md#57-configuration-config)                    |
| Reference (SAS)     | [FR.017](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system shall allow users to configure CD repositories through the configuration dialog. |
| Priority            | Required                                                                                    |
| Verification Method | Test                                                                                        |

### SRS-FR-CONFIG-002 CD Repository Content Inspection

| ID                  | SRS-FR-CONFIG-002                                                                                    |
|---------------------|------------------------------------------------------------------------------------------------------|
| Reference (CRS)     | [CONFIG-FR-002](/PROJECT/TINF24F_5-CRS-0v1.3.md#57-configuration-config)                             |
| Reference (SAS)     | [FR.018](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system should allow users to inspect the contents of CD repositories through the user interface. |
| Priority            | Required                                                                                             |
| Verification Method | Demonstration                                                                                        |

### SRS-FR-UI-002 TechnicalData Submodel Formatting

| ID                  | SRS-FR-UI-002                                                                                                                                                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Reference (CRS)     | [UI-FR-002](https://github.com/DHBW-TINF24F/Team5-mnestix-product-catalogue/blob/1.5.0-product-catalog/PROJECT/TINF24F_5-CRS.md#52-uiux-ui)                                                                           |
| Reference (SAS)     | [FR.019](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system should improve the formatting of the `SM TechnicalData` submodel for better readability. The [SMT 2.0](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Technical_Data/2/0) should be noticed. |
| Priority            | Optional                                                                                                                                                                                                                          |
| Verification Method | Inspection                                                                                                                                                                                                                        |

### SRS-FR-UI-003 HandoverDocumentation Submodel Formatting

| ID                  | SRS-FR-UI-003                                                                                            |
|---------------------|----------------------------------------------------------------------------------------------------------|
| Reference (CRS)     | [UI-FR-003](https://github.com/DHBW-TINF24F/Team5-mnestix-product-catalogue/blob/1.5.0-product-catalog/PROJECT/TINF24F_5-CRS.md#52-uiux-ui)                                                  |
| Reference (SAS)     | [FR.020](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system should improve the formatting of the `HandoverDocumentation` submodel for better readability. |
| Priority            | Optional                                                                                                 |
| Verification Method | Inspection                                                                                               |

### SRS-FR-LINKED-001 Linked AAS Navigation

| ID                  | SRS-FR-LINKED-001                                                                                |
|---------------------|--------------------------------------------------------------------------------------------------|
| Reference (CRS)     | [LINKED-FR-001](/PROJECT/TINF24F_5-CRS-0v1.3.md#55-linked-aas-linked)                            |
| Reference (SAS)     | [FR.021](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system should allow navigation through linked AAS references within submodel visualizations. |
| Priority            | Required                                                                                         |
| Verification Method | Demonstration                                                                                    |

### 3.1. Non-Functional Requirements (NFR)

Overview over all non-functional requirements for navigation:

1. [SRS-NFR-PERFORM-001 - AAS List Load Performance](#srs-nfr-perform-001-aas-list-load-performance)
2. [SRS-NFR-PERFORM-002 - Concurrent User Support](#srs-nfr-perform-002-concurrent-user-support)
3. [SRS-NFR-PERFORM-003 - Thumbnail Lazy Loading](#srs-nfr-perform-003-thumbnail-lazy-loading)
4. [SRS-NFR-SEC-001 - Configuration Change Logging](#srs-nfr-sec-001-configuration-change-logging)
5. [SRS-NFR-UI-001 - Responsive Interface](#srs-nfr-ui-001-responsive-interface)
6. [SRS-NFR-PORT-001 - Browser Compatibility](#srs-nfr-port-001-browser-compatibility)
7. [SRS-NFR-SHOP-LANG-001 - Multilingual Support](#srs-nfr-shop-lang-001-multilingual-support)
8. [SRS-NFR-MAINT-001 - Code Quality Standards](#srs-nfr-maint-001-code-quality-standards)

#### SRS-NFR-PERFORM-001 AAS List Load Performance

| ID                  | SRS-NFR-PERFORM-001                                                                                                                    |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| Reference (CRS)     | [PERFORM-FR-001](/PROJECT/TINF24F_5-CRS-0v1.3.md#56-performance-perform), [Section 6.3](/PROJECT/TINF24F_5-CRS-0v1.3.md#63-efficiency) |
| Reference (SAS)     | [NFR.001](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system shall load the AAS list in a decent time.                                                                                   |
| Category            | Performance                                                                                                                            |
| Verification Method | Measurement                                                                                                                            |

#### SRS-NFR-PERFORM-002 Concurrent User Support

| ID                  | SRS-NFR-PERFORM-002                                                                                                         |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------|
| Reference (CRS)     | [Section 6.2](/PROJECT/TINF24F_5-CRS-0v1.3.md#62-reliability), [Section 6.3](/PROJECT/TINF24F_5-CRS-0v1.3.md#63-efficiency) |
| Reference (SAS)     | [NFR.002](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system shall support concurrent access by at least 10 users without degradation of performance.                         |
| Category            | Performance                                                                                                                 |
| Verification Method | Load Test                                                                                                                   |

#### SRS-NFR-PERFORM-003 Thumbnail Lazy Loading

| ID                  | SRS-NFR-PERFORM-003                                                                                                                                             |
|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Reference (CRS)     | [PERFORM-FR-002](/PROJECT/TINF24F_5-CRS-0v1.3.md#56-performance-perform)                                                                                        |
| Reference (SAS)     | [NFR.008](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                                                                        |
| Description         | The product list view shall load thumbnails and other media content lazily, restricting downloads and rendering to items currently visible on the user's screen. |
| Category            | Performance                                                                                                                                                      |
| Verification Method | Measurement / Load Test / Inspection                                                                                                                              |

#### SRS-NFR-SEC-001 Configuration Change Logging

| ID                  | SRS-NFR-SEC-001                                                                           |
|---------------------|-------------------------------------------------------------------------------------------|
| Reference (CRS)     | [Section 6.2](/PROJECT/TINF24F_5-CRS-0v1.3.md#62-reliability)                             |
| Reference (SAS)     | [NFR.003](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system shall log all configuration changes and user actions that affect repositories. |
| Category            | Security                                                                                  |
| Verification Method | Inspection                                                                                |

#### SRS-NFR-UI-001 Responsive Interface

| ID                  | SRS-NFR-UI-001                                                                                  |
|---------------------|-------------------------------------------------------------------------------------------------|
| Reference (CRS)     | [Section 6.1](/PROJECT/TINF24F_5-CRS-0v1.3.md#61-usability)                                     |
| Reference (SAS)     | [NFR.004](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The interface shall remain responsive when resizing the browser window or using mobile devices. |
| Category            | Usability                                                                                       |
| Verification Method | Demonstration                                                                                   |

#### SRS-NFR-PORT-001 Browser Compatibility

| ID                  | SRS-NFR-PORT-001                                                                     |
|---------------------|--------------------------------------------------------------------------------------|
| Reference (CRS)     | [Section 6.5](/PROJECT/TINF24F_5-CRS-0v1.3.md#65-portability)                        |
| Reference (SAS)     | [NFR.005](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system shall be compatible with current versions of Chrome, Firefox, and Safari. |
| Category            | Compatibility                                                                        |
| Verification Method | Test                                                                                 |

#### SRS-NFR-SHOP-LANG-001 Multilingual Support

| ID                  | SRS-NFR-SHOP-LANG-001                                                             |
|---------------------|-----------------------------------------------------------------------------------|
| Reference (CRS)     | [SHOP-LANG-FR-001](/PROJECT/TINF24F_5-CRS-0v1.3.md#59-language-support-shop-lang) |
| Reference (SAS)     | [NFR.006](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | The system shall provide localized text resources in English and German.          |
| Category            | Maintainability                                                                   |
| Verification Method | Inspection                                                                        |

#### SRS-NFR-MAINT-001 Code Quality Standards

| ID                  | SRS-NFR-MAINT-001                                                                        |
|---------------------|------------------------------------------------------------------------------------------|
| Reference (CRS)     | [Section 6.6](/PROJECT/TINF24F_5-CRS-0v1.3.md#66-maintainability)                        |
| Reference (SAS)     | [NFR.007](/PROJECT/TINF24F_5-SAS.md#7-architectural-views)                                      |
| Description         | Source code shall follow consistent linting and formatting rules defined in the project. |
| Category            | Maintainability                                                                          |
| Verification Method | Inspection                                                                               |

### 3.2. External interface requirements

Project Bisasam shall keep existing APIs and external interfaces.

#### 3.2.1. Availability

Project Bisasam shall maintain the existing stability and availability of the Mnestix Browser.

#### 3.2.2. Security and privacy

Project Bisasam keeps Mnestix Browser secure by keeping all security related features untouched.
The developer Team informed the customer that SRS-FR-LOGI-001 could lead to privacy problems when working in public, because the user name is visible on every view in the upper right corner.

#### 3.2.3. Maintainability

In order to make the changes of project Bisasam maintainable, the developer team ships a documentation of code and functionality at project hand over.
This document shall have two parts:

1. User Instructions
2. Technical Documentation

The user instructions must be written in an understandable way for all types of users defined in the chapter [user characteristics](#user-characteristics).
The technical documentation should cover an overview of project Bisasam written for developers.

To increase development maintainability, new project Bisasam functionalities have to be commented in a proper way.
Project Bisasam adopts official Mnestix' code specification and conventions.

See [Mnestix Code Conventions]() for more information.

## 4.Verification

See [Specific Requirements](#specific-requirements) for more information about verification.
Because most requirements affect the user interface, these requirements are checked using a demonstration in a controlled environment.
