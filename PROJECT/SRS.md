# Software Requirements Specification

**Revision history:** This SRS is tracked with Git.
See the commit history on [GitHub](https://github.com/DHBW-TINF24F/Team5-management-and-docs/commits/).

This Software Requirements Specification (SRS) specifies the work of group 5.
The software and this specification was developed in connection with a university project.

**Author:** Gregor Gottschewski

**Date of last revision:** 26.10.2025

> Read the [IEEE Guide to Software Requirements Specifications](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=278253) or [IEEE Recommended Practice for Software Requirements Specifications](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=720574) before contributing to the SRS.

## Version history

|Version|Changes|Authors|
|-|-|-|
|1.0|Initial SRS state|Gregor Gottschewski|

## Table of Contents

1. [Introduction](#introduction)  
    1.1. [Purpose](#purpose)  
    1.2. [Definitions and Acronyms](#definitions-and-acronyms)  
    1.3. [Scope](#scope)  
    1.4. [References](#references)  
    1.5. [Overview](#overview)  
2. [Overall Description](#overall-description)  
    2.1. [Product Perspective](#product-perspective)  
        2.1.1. [System interfaces](#system-interfaces)  
        2.1.2. [User Interfaces](#user-interfaces)  
        2.1.3. [Operations](#operations)  
    2.2. [Product Functions](#product-functions)  
    2.3. [User Characteristics](#user-characteristics)  
    2.4. [Limitations](#limitations)  
    2.5. [Assumptions and dependencies](#assumptions-and-dependencies)  
3. [Specific features](#specific-features)  
    3.1. [Non-Functional Requirements](#non-functional-requirements-nfr)  
    3.2. [External interface requirements](#external-interface-requirements)  
        3.2.1. [Availability](#availability)  
        3.2.2. [Security and privacy](#security-and-privacy)  
        3.2.3. [Maintainability](#maintainability)  
4. [Verfication](#verification)

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
The software was tested on a MacBook Pro 2024 (M4 Pro, 48 GB, macOS 15.7.1) with a local Mnestix Browser build.
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

* Features requests where made by our supervising lecturer and can be found at the [DHBW-TINF24F GitHub Organization (root/project-5)](https://github.com/DHBW-TINF24F/.github/blob/main/project5_mnestix_product_catalogue.md)
* The structure of this SRS follows the [ISO/IEC/IEEE 29148:2018 standard](https://ieeexplore.ieee.org/document/8559686)
* Information about Mnestix Browser can be found on [Mnestix-Browser GitHub](https://github.com/eclipse-mnestix/mnestix-browser)
* Requirements table follows [ISO/IEC/IEEE 29148 standard](https://ieeexplore.ieee.org/document/8559686)

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

* No second Mnestix Browser version is running at the same time
* No modifications of the core Mnestix Browser are allowed
* The Mnestix Browser fork of project Bisasam is installed correctly

## 3. Specific features

Project Bisasam shall add following features to Mnestix Browser.

Verification methods:

* **Test:** Tested by running the system and with logic tests.
* **Demonstration:** Show feature in running system, requirement is visible to user.
* **Inspection:** Requirement can be checked with code analysis or UI-layout-analysis.
* **Load Test:** Requirement can be tested on modern hardware with an automatic or manual load test.

**Overview for navigation:**

1. [FR.001](#fr001)
2. [FR.002](#fr002)
3. [FR.003](#fr003)
4. [FR.004](#fr004)
5. [FR.005](#fr005)
6. [FR.006](#fr006)
7. [FR.007](#fr007)
8. [FR.008](#fr008)
9. [FR.009](#fr009)
10. [FR.010](#fr010)
11. [FR.011](#fr011)
12. [FR.012](#fr012)
13. [FR.013](#fr013)
14. [FR.014](#fr014)
15. [FR.015](#fr015)
16. [FR.016](#fr016)
17. [FR.017](#fr017)
18. [FR.018](#fr018)
19. [FR.019](#fr019)
20. [FR.020](#fr020)
21. [FR.021](#fr021)

### FR.001

|ID|FR.001|
|-|-|
|Description|The system shall display a symbol in the upper-right corner of the menu bar that indicates the current login status of the user.|
|Priority|Required|
|Verfication Method|Inspection|
|Wireframe|![](/PROJECT/assets/srs/fr.001.svg)|

### FR.002

|ID|FR.002|
|-|-|
|Description|The system should integrate all functions and menus of the existing login status button into the new login status symbol.|
|Priority|Optional|
|Verfication Method|Demonstration|

### FR.003

|ID|FR.003|
|-|-|
|Description|The system shall display the number of AAS entries per repository in the repository view, next to the repository name.|
|Priority|Required|
|Verfication Method|Test|
|Wireframe|![](/PROJECT/assets/srs/fr.003.svg)|

### FR.004

|ID|FR.004|
|-|-|
|Description|The system shall provide access to the Nameplate Generator from the product context menu using the given implementation repository.|
|Priority|Required|
|Verfication Method|Test|
|Wireframe|![](/PROJECT/assets/srs/fr.004.svg)|

### FR.005

|ID|FR.005|
|-|-|
|Description|The system shall display the columns `ManufacturerName`, `ProductDesignation`, `OrderCode`, `ManufacturerCode`, `GlobalAssetId`, and `CreatedAt` in the AAS list.|
|Priority|Required|
|Verfication Method|Inspection|
|Wireframe|![](/PROJECT/assets/srs/fr.005.svg)|

### FR.006

|ID|FR.006|
|-|-|
|Description|The system shall allow users to filter the AAS list based on query parameters.|
|Priority|Required|
|Verfication Method|Test|
|Wireframe|![](/PROJECT/assets/srs/fr.006.svg)|

### FR.007

|ID|FR.007|
|-|-|
|Description|The system shall allow users to sort the AAS list entries by any available column.|
|Priority|Required|
|Verfication Method|Test|

### FR.008

|ID|FR.008|
|-|-|
|Description|The system shall provide a cart view accessible via the sidebar and under the path `/cart`.|
|Priority|Required|
|Verfication Method|Test|
|Wireframe|![](/PROJECT/assets/srs/fr.008.svg)|

### FR.009

|ID|FR.009|
|-|-|
|Description|The system shall list all products added to the cart in the cart view. | Required | Ensures cart transparency and user awareness.|
|Priority|Required|
|Verfication Method|Test|
|Wireframe|![](/PROJECT/assets/srs/fr.009.svg)|

### FR.010

|ID|FR.010|
|-|-|
|Description|The system shall allow users to edit product quantities within the cart view.|
|Priority|Required|
|Verfication Method|Test|
|Wireframe|![](/PROJECT/assets/srs/fr.010.svg)|

### FR.011

|ID|FR.011|
|-|-|
|Description|Each product view shall contain an “Add to cart” button allowing the user to add the product to the cart.|
|Priority|Required|
|Verfication Method|Test|
|Wireframe|![](/PROJECT/assets/srs/fr.011.svg)|

### FR.012

|ID|FR.012|
|-|-|
|Description|The sidebar shall display the total number of products currently in the cart.|
|Priority|Required|
|Verfication Method|Inspection|
|Wireframe|![](/PROJECT/assets/srs/fr.012.svg)|

### FR.013

|ID|FR.013|
|-|-|
|Description|The system should allow enabling or disabling the shop functionality through an environment variable in the `.env` file (`SHOP_ENABLED_FLAG`).|
|Priority|Optional|
|Verfication Method|Inspection|

### FR.014

|ID|FR.014|
|-|-|
|Description|The system should support integration with an external payment provider.|
|Priority|Optional|
|Verfication Method|Demonstration|

### FR.015

|ID|FR.015|
|-|-|
|Description|The system should display a price for each product when the shop module is enabled.|
|Priority|Optional|
|Verfication Method|Inspection|
|Wireframe|![](/PROJECT/assets/srs/fr.015.svg)|

### FR.016

|ID|FR.016|
|-|-|
|Description|The system shall allow users to enable or disable individual AAS repositories within the configuration dialog.|
|Priority|Required|
|Verfication Method|Test|
|Wireframe|![](/PROJECT/assets/srs/fr.016.svg)|

### FR.017

|ID|FR.017|
|-|-|
|Description|The system shall allow users to configure CD repositories through the configuration dialog.|
|Priority|Required|
|Verfication Method|Test|

### FR.018

|ID|FR.018|
|-|-|
|Description|The system should allow users to inspect the contents of CD repositories through the user interface.|
|Priority|Optional|
|Verfication Method|Demonstration|

### FR.019

|ID|FR.019|
|-|-|
|Description|The system should improve the formatting of the `SM TechnicalData` submodel for better readability. The [SMT 2.0](https://github.com/admin-shell-io/submodel-templates/tree/main/published/Technical_Data/2/0) should be noticed.|
|Priority|Optional|
|Verfication Method|Inspection|

### FR.020

|ID|FR.020|
|-|-|
|Description|The system should improve the formatting of the `HandoverDocumentation` submodel for better readability.|
|Priority|Optional|
|Verfication Method|Inspection|

### FR.021

|ID|FR.021|
|-|-|
|Description|The system should allow navigation through linked AAS references within submodel visualizations.|
|Priority|Optional|
|Verfication Method|Demonstration|

### 3.1. Non-Functional Requirements (NFR)

Overview over all non-functionaly requirements for navigation:

1. [NFR.001](#nfr001)
2. [NFR.002](#nfr002)
3. [NFR.003](#nfr003)
4. [NFR.004](#nfr004)
5. [NFR.005](#nfr005)
6. [NFR.006](#nfr006)
7. [NFR.007](#nfr007)

#### NFR.001

|ID|NFR.001|
|-|-|
|Description|The system shall load the AAS list with up to 100 entries in under 3 seconds.|
|Category|Performance|
|Verfication Method|Measurement|

#### NFR.002

|ID|NFR.002|
|-|-|
|Description|The system shall support concurrent access by at least 10 users without degradation of performance.|
|Category|Performance|
|Verfication Method|Load Test|

#### NFR.003

|ID|NFR.003|
|-|-|
|Description|The system shall log all configuration changes and user actions that affect repositories.|
|Category|Security|
|Verfication Method|Inspection|

#### NFR.004

|ID|NFR.004|
|-|-|
|Description|The interface shall remain responsive when resizing the browser window or using mobile devices.|
|Category|Usability|
|Verfication Method|Demonstration|

#### NFR.005

|ID|NFR.005|
|-|-|
|Description|The system shall be compatible with current versions of Chrome, Firefox, and Safari.|
|Category|Compatibility|
|Verfication Method|Test|

#### NFR.006

|ID|NFR.006|
|-|-|
|Description|The system shall provide localized text resources in English and German.|
|Category|Maintainability|
|Verfication Method|Inspection|

#### NFR.007

|ID|NFR.007|
|-|-|
|Description|Source code shall follow consistent linting and formatting rules defined in the project.|
|Category|Maintainability|
|Verfication Method|Inspection|

### 3.2. External interface requirements

Project Bisasam shall keep existing APIs and external interfaces.

#### 3.2.1. Availability

Project Bisasam shall maintain the existing stability and availability of the Mnestix Browser.

#### 3.2.2. Security and privacy

Project Bisasam keeps Mnestix Browser secure by keeping all security related features untouched.
The developer Team informed the customer that FR1 could lead to privacy problems when working in public, because the user name is visible on every view in the upper right corner.

#### 3.2.3. Maintainability

In order to make the changes of project Bisasam maintainable, the developer team ships a documentation of code and functionality at project hand over.
This document shall have two parts:

1. User Instructions
2. Technical Documentation

The user instructions must be written in a understandable way for all types of users defined in the chapter [user characteristics](#user-characteristics).
The technical documentation should cover an overview of project Bisasam written for developers.

To increase development maintainability, new project Bisasam functionalities have to be commented in a proper way.
Project Bisasam adopts official Mnestix' code specification and conventions.

See [Mnestix Code Conventions]() for more information.

## 4.Verification

See [Specific Requirements](#specific-requirements) for more information about verification.
Because most requirements affect the user interface, these requirements are checked using a demonstration in a controlled environment.
