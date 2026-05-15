
# User Manual - Team 5 Mnestix Product Catalogue

| Author | Project | Course | Clients |
|:--------:|:-----------:|:---------------:|:--------:|
| Felix Hennerich | Mnestix Product Catalogue | TINF24F | Markus Rentschler, Pawel Wojcik

---

## **Table of Contents**
1. [Login Status in the Header](#1-login-status-in-the-header)
2. [Simplified Technical Data View](#2-simplified-technical-data-view)
3. [Filter AAS by AssetKind](#3-filter-aas-by-assetkind)
4. [Configure CD Repositories](#4-configure-cd-repositories)
5. [Sort the AAS List](#5-sort-the-aas-list)
6. [Shopping Cart Functionality](#6-shopping-cart-functionality)


---

## **1. Login Status in the Header**
**Issue:** [#1 – Move Login Button to Header](https://github.com/eclipse-mnestix/mnestix-browser/issues/566)

### **Description**
The login button has been moved from the **sidebar to the header**. This ensures your **login status is always visible**, regardless of the page you are on.

### **User Instructions**
- **Login:**
  Click the **"Login"** button in the header to sign in.
  <img width="728" height="310" alt="Bildschirmfoto 2026-05-15 um 08 58 37" src="https://github.com/user-attachments/assets/875b011c-f2de-4662-a5a0-313bdd14bb16" />


- **Logout:**
  After logging in, the button will change to **"Logout"**. Click it to end your session.

- **Status Display:**
  The button will display your current **login status** (e.g., username or "Guest").


---

## **2. Simplified Technical Data View**
**Issue:** [#2 – Improve Technical Data View Usability](https://github.com/eclipse-mnestix/mnestix-browser/issues/567)

### **Description**
The **Technical Data View** has been streamlined. Instead of opening **up to five dropdown menus** to access data, you now only need to use **a single dropdown menu**.

### **User Instructions**
1. Navigate to the **Technical Data View**.
2. Select the desired **category from the single dropdown menu**.
   <img width="801" height="458" alt="Bildschirmfoto 2026-05-15 um 09 04 06" src="https://github.com/user-attachments/assets/e509923b-8d28-4bb7-9ed6-af3dee540235" />
3. The data will **automatically display** without requiring additional steps.

---
**Note:**
If you previously accessed data through multiple menus, you can now find it **directly in the main dropdown**.

---

## **3. Filter AAS by AssetKind**
**Issue:** [#3 – Add AssetKind Filter](https://github.com/eclipse-mnestix/mnestix-browser/issues/568)

### **Description**
You can now **filter the AAS (Asset Administration Shell) list** by **AssetKind types**. You can:
- Select **individual types** (e.g., only "TypeA").
- **Combine 2 or 3 types** (e.g., "TypeA" and "TypeB").

### **User Instructions**
1. Open the **AAS List**.
2. Use the **filter options** at the top of the list:
   - Click the **checkboxes** for the desired AssetKind types.
     <img width="557" height="234" alt="Bildschirmfoto 2026-05-15 um 09 06 08" src="https://github.com/user-attachments/assets/c1f10022-bcd7-4f11-924b-d0e306c87f90" />
3. The list will **automatically update** to show only the selected types.
4. To reset all filters, click **"Show All"**.

---
**Important:**
- Filtering is done **locally** and does not affect server data.
- A **maximum of 100 items** are cached for filtering.

---

## **4. Configure CD Repositories**
**Issue:** [#4 – Configure CD Repositories](https://github.com/eclipse-mnestix/mnestix-browser/issues/571)

### **Description**
In the **Settings**, you can now **enable or disable CD (Continuous Deployment) repositories**. This allows for **flexible use of different sources**.

### **User Instructions**
1. Go to **Settings** (gear icon in the navigation).
2. Select the **"Repositories"** tab.
3. You will see a **list of all available repositories**.
4. **Enable/Disable:**
   - Toggle the **switch** for each repository to enable or disable it.
   <img width="595" height="230" alt="Bildschirmfoto 2026-05-15 um 09 07 15" src="https://github.com/user-attachments/assets/1bba4d88-dc1f-47a3-8732-f1135c08af66" />

5. Changes are **saved automatically**.

---
**Note:**
- Disabled repositories **will not be used for queries or updates**.
- Changes take effect **immediately** for your session.

---

## **5. Sort the AAS List**
**Issue:** [#5 – Sort AAS List Alphabetically](https://github.com/eclipse-mnestix/mnestix-browser/issues/575)

### **Description**
The **AAS List** can now be **sorted alphabetically by any column**. The sorting is also reflected in the **URL**, allowing you to share the sorted view.

### **User Instructions**
1. Open the **AAS List**.
2. Click on the **column header** (e.g., "Name", "Type") you want to sort by.
   - An **arrow (↑ or ↓)** indicates the current sort direction.
3. **Change Sort Direction:**
   - Click the same column header again to reverse the order (e.g., from A-Z to Z-A).
   <img width="561" height="154" alt="Bildschirmfoto 2026-05-15 um 09 08 28" src="https://github.com/user-attachments/assets/b4fcadf0-770b-4164-8d9c-1a9b1f811c1c" />

4. The **URL updates automatically** (e.g., `?sort=name&order=asc`).
   - You can **copy and share this link** to retain the sorting.

---
**Example URLs:**
- `?sort=name&order=asc` → Sorted by name in ascending order.
- `?sort=type&order=desc` → Sorted by type in descending order.

---
## **6. Shopping Cart Functionality**
**Issue:** [#6 – eShop/Cart Features](https://github.com/eclipse-mnestix/mnestix-browser/issues/573)

### **Description**
The platform now offers a **shopping cart feature** for selected products. The cart is **locally stored** and persists even after navigating to other pages.

---
### **User Instructions**

#### **Add Products to Cart**
1. Navigate to a **product page**.
2. Click the **"Add to Cart"** button.
3. A **badge** in the sidebar/menu will display the **number of items** in your cart.

#### **Manage Shopping Cart**
1. Click the **cart icon** in the sidebar/menu.
2. You will see a **list of all added products**, including:
   - **Product name**
   - **Quantity** (can be increased or decreased)
   - **Price** (if available)
3. **Adjust Quantity:**
   - Use the **+** and **–** buttons to change the quantity.
4. **Remove Items:**
   - Click the **trash icon** next to the product to remove it.

#### **Clear Cart**
- Click **"Clear Cart"** to remove all items.

---
**Important:**
- The cart is **stored locally in your browser** (`localStorage`).
- Data **persists even after closing and reopening the browser**.
- **Multi-tab Support:** Changes to the cart are **synchronized across all open tabs**.
- **Shop Disabled:**
  If the shop feature is disabled for your instance, the cart **will not appear**.

---

Note: This file was developed with mistral.ai as a supporting tool
