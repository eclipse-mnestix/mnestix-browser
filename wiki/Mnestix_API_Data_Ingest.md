In the following you will learn how you can use the AAS Generator together with the template builder to create AAS.

![General process](https://github.com/user-attachments/assets/7f087e28-3bac-496a-af60-31d4d9f9f158)
### Prerequisites

To use this you need a fully configured Mnestix Browser and Mnestix API instance, like when starting our [`compose.yml` file](https://github.com/eclipse-mnestix/mnestix-browser/blob/main/compose.yml).
For beginners we recommend to use Mnestix API without additional Authentication as it complicates using the AAS Generator.

- Mnestix API
- Mnestix Browser
- A way to call HTTP endpoints (Python, Insomnia, ...)

### 1. Setup

Setup a full Mnestix Infrastructure deployment by running `docker compose -f `[`compose.yml`](https://github.com/eclipse-mnestix/mnestix-browser/blob/main/compose.yml)` up`. 
This will start everything.

### 2. Creating a Data JSON using ETL tools

The Data JSON comes from an ETL (Extract Transform Load) Tool, like [Apache Camel](https://camel.apache.org/) (Open Source), [Soffico Orchestra](https://soffico.de/produkte/) (Paid) or similar tools.
This JSON file can have 

Example data that is extracted from your existing system could look like this
```json
{
    "basis": {
        "serialnumber": "123",
        "manufacturer": "ACME Corp",
        "modelName": "ProductXYZ",
    },
    "productionDate": "2023-05-15"
}
```

### 3. Generate Submodel Template in Mnestix Browser

A template can be generated, by accessing the Template Builder in the Menu under "Templates".
This opens a Menu to see all already generated templates.

Create a new one by clicking "Create new".
For this example we will create a new Nameplate Submodel.
Fill out the static information like "Manufacturer Name". For the dynamic information create a new "Mapping Info" field.

Inside the Mapping Information a JSON Path can be entered where the value will be taken from:

![Generate Template](https://github.com/user-attachments/assets/9ff4d2f9-056b-4b19-a339-7d6a38d55c84)

You can find the identification of the Template in the URL after .../templates:
`MNESTIX_HOST/en/templates/`**`Nameplate_Template_7e18dcd0-c367-4626-a97e-be44f5fe1852`**

Afterwards click "Save Changes" to save the changes.

### 4. Make a request 

To create a submodel from that template you can call the corresponding endpoint in the API:
`/api/DataIngest/{base64EncodedAasId}`
You have to be authenticated (Adding the preconfigured API Key as a "ApiKey" Header)
As the body you can use the defined data JSON from step 2 and append it with the corresponding template IDs.
In our exmample it would look like this:
```json
{
  "data": {
    "basis": {
        "serialnumber": "123",
        "manufacturer": "ACME Corp",
        "modelName": "ProductXYZ",
    },
    "productionDate": "2023-05-15"
},
  "customTemplateIds": [
    "Nameplate_Template_7e18dcd0-c367-4626-a97e-be44f5fe1852"
  ]
}
```

After the POST Request you should see the filled out template in the given AAS.

Here a brief overview how it all works:
![image](https://github.com/user-attachments/assets/672b1a3e-b2b0-4ba1-9a92-033f28a2330b)