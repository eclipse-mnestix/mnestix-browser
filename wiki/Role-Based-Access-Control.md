### Role Based Access Control (RBAC)

Mnestix currently uses a basic RBAC approach when `AUTHENTICATION_FEATURE_FLAG` is set to `true`.

A not logged-in user is allowed to see the following pages with all features:

- Dashboard, List (Note: If the BaSyx repository requires authentication, no data will be displayed.)

Every logged-in user is allowed to visit following pages:

- Dashboard, List, Templates

If a logged-in user has the 'mnestix-admin' role set, the user is able to visit following pages:

- Dashboard, List, Templates, Settings (ID Settings, Data Sources, Role Management)

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


### Dynamic Role Based Access Control

To change roles and repository permissions during runtime, we use the Basyx security repository and security submodel.
If set up correctly with the corresponding docker compose file 
(see [here](https://github.com/eclipse-mnestix/mnestix-browser/wiki/Docker-Compose-Files)) and `USE_BASYX_RBAC` 
is set to `true`, the `mnestix-admin` can view all configured roles
and their permissions to AAS IDs or Submodel IDs on the Settings UI under the role management section.
In future implementations it will also be possible to change these roles and permissions in the UI.
More information about the Basyx role based access control management can be found 
[here](https://github.com/eclipse-basyx/basyx-java-server-sdk/tree/main/examples/BaSyxDynamicRBAC).

