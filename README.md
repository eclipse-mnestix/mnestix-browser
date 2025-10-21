<p align="right">
  <picture>
    <source srcset="src/assets/XitasoLogo.svg"  media="(prefers-color-scheme: dark)">
    <img src="src/assets/XitasoLogoBlack.svg" width=20%>
  </picture>
</p>
<p align="center">
 <img src="public/android-chrome-192x192.png" alt="Mnestix Logo">
</p>
<h1 style="text-align: center">Mnestix</h1>

[![Made by XITASO](https://img.shields.io/badge/Made_by_XITASO-005962?style=flat-square)](https://xitaso.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-005962.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![Yarn License](https://img.shields.io/badge/YARN-V1.22.22-005962?style=flat-square)]()
[![Join our Community](https://img.shields.io/badge/Join_our_Community-005962?style=flat-square)](https://xitaso.com/kompetenzen/mnestix/#support)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/eclipse-mnestix/mnestix-browser)

### Welcome to the Mnestix Community!

Mnestix Browser is an open source software designed to simplify the implementation of the Asset Administration Shell.
Together
with increasing contributions from users and developers, a growing community is working on further development under the
leadership of XITASO, a leading high-end software development company in the engineering industry.
Mnestix Browser is the perfect tool to demonstrate the power and potential of AAS (**Asset Administration Shells**) for
the
implementation of standardized digital twins. It opens the way for use cases such as the Digital Product Passport (DPP).

You can find a demo [here](https://mnestix.xitaso.net/).
Some screenshots can be found in the [screenshots folder](screenshots).

### **If you need support feel free to contact us through our website [here](https://xitaso.com/kompetenzen/mnestix/#support).**

<p align="center">
  <a href="https://xitaso.com/en/competences/mnestix-2/#optin_form">
    <img height="200px" alt="Subscribe to our Newsletter" src="https://github.com/user-attachments/assets/46f1de98-a756-4943-9346-6915d323637f" />
  </a>
</p>

## Quickstart

All you need to start your first Mnestix instance is the `compose.yml` (or clone the repository).
In the root directory run the following command and open http://localhost:3000 in your web browser.

```shell
docker compose up
```

### If you want to further configure your mnestix instance, go to our [wiki](https://github.com/eclipse-mnestix/mnestix-browser/wiki).


## Feature Overview

The Mnestix Browser enables you to browse through the different AAS Dataspaces.
It allows you to **visualize Asset Administration Shells and their submodels**. It supports the AAS Metamodel and API in
version 3.

You configure the endpoint of an AAS repository and browse the different AAS, if a Discovery Service is available, it is
also possible to search for AssetIds and visualize the corresponding AAS.

Mnestix AAS Browser is also **optimized for mobile view** to have a **great user experience** on mobile phones.

Mnestix can **visualize every submodel** even if it is not standardized by IDTA. There are some submodels **visualized
in an extra user-friendly manner**. These are:

- Digital Nameplate
- Handover Documentation
- Carbon Footprint
- **and more!**

Moreover, dedicated visualizations for submodels can be added as a further feature.
