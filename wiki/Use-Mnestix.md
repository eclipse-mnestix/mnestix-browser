### Upload your first AAS

We provide a simple AAS in the folder **test-data** which you can use as a first test AAS.
You can upload the `.aasx` file to your BaSyx repository by using the upload endpoint of BaSyx (check
`http://localhost:8081/swagger-ui/index.html` and search for the `/upload` endpoint to get more information).  
Afterward, you can visit your running Mnestix Browser and search for the AAS ID `https://vws.xitaso.com/aas/mnestix` to
visualize the test AAS.

### Personalization

It is possible to change the look and feel by setting a theme color and a personal logo when deploying the Mnestix
Browser, see [here](https://github.com/eclipse-mnestix/mnestix-browser/wiki/Mnestix-Configuration-Settings#how-to-set-a-custom-logo).

### BaSyx API

- Mnestix is using BaSyx, by appending /repo to our URLs, we are forwarding the requests to BaSyx via
  proxy: [BaSyx AAS API Collection](https://app.swaggerhub.com/apis/Plattform_i40/Entire-API-Collection/V3.0#/Asset%20Administration%20Shell%20Repository%20API/GetAssetAdministrationShellById)
- With this, BaSyx endpoints can be reached through Mnestix.
    - AAS Repository Api: http://localhost:3000/repo/shells/{YourAasIdInBase64}
    - Submodel Repository Api: http://localhost:3000/repo/submodels/{YourAasIdInBase64}
    - The BaSyx Swagger UI gives a detailed overview of all available
      endpoints: http://localhost:8081/swagger-ui/index.html