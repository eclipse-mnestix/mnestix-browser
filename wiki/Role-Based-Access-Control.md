### Role Based Access Control

Mnestix currently uses a basic RBAC approach when `AUTHENTICATION_FEATURE_FLAG` is set to `true`.

A not logged-in user is allowed to see the following pages with all features:

- Dashboard, List (Note: If the BaSyx repository requires authentication, no data will be displayed.)

Every logged-in user is allowed to visit following pages:

- Dashboard, List, Templates

If a logged-in user has the 'mnestix-admin' role set, the user is able to visit following pages:

- Dashboard, List, Templates, Settings (ID Settings, Data Sources)

### Configuring RBAC:

Since we support Keycloak and Azure Entra ID as authentication providers, you are able to configure mnestix roles in
both of them.
To do so, create the role `mnestix-admin` in either Keycloak or Azure Entra ID and assign it to a chosen user.  
Nothing needs to be configured inside Mnestix.

### Keycloak

The default Mnestix realm is preconfigured with the **'mnestix-admin'** role. To grant this role to another user, follow these steps:

1. Log in to the Keycloak Admin Console.
2. Navigate to **Users** and select the desired user.
3. Go to the **Role Mapping** tab and click on **Assign Role**.
4. Use the **Filter by Clients** option and select **mnestix-browser-client-demo mnestix-admin**.
5. Assign the **'mnestix-admin'** role to the user.  
