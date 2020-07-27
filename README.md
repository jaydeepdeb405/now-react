# now-react
Node.js application to build React applications in ServiceNow.   
- Only ServiceNow instance version Orlando & up are supported.   
- The package supports SASS, ReactRouter out of the box.    
- For modification of Favicon & Metadata, the package comes with ReactFavicon & ReactMetaTags plugins.   
- Also, an HTTP client (axios) is pre setup in the package. If you're new to axios, you can use RestMessage (yes, similar to ServiceNow RestMessage).

# Required configuration:

### ServiceNow instance configuration:

The application contains a ServiceNow update set which is required for the solution. It can be found on the root folder.

1. Go to Retrieved Update Sets -> Import Update Set from XML (List link)
2. Upload the update set -> Preview it -> Commit it
3. After committing the Update Set the user will be able to see an Application menu called 'React SPA' with 2 modules 'Create React App' & 'Remove React App'.
These modules can be used to manage (create/delete) React applications inside the instance.
> Create/Manage modules will let you only manage the React applications inside the current Application scope.
4. On creating the a React application in ServiceNow, it will redirect the user to the application, which will show some configuration data, it will also add a Module link to the React application under the same Application Menu. 
> These configuration data will be required in step 3 of **Local system configuration**.

### Local system configuration:

1. Install Node.js in your local system.
2. Clone the repository or extract it in your local system.
3. Find servicenow.config.js in root folder & enter the following details:
    - HOST - Your ServiceNow instance URL (eg.- https://dev99999.service-now.com)
    - USERNAME - Your instance user id. This will be used to deploy the application & also for API calls to the instance when running the project locally
    - PASSWORD - Your instance password. This will be used to deploy the application & also for API calls to the instance when running the project locally
    - APP_URL_BASE - Obtain from Step 4 of **ServiceNow instance configuration**. This will be used to setup React Base Route
    - SCRIPT_RECORD_ID - Obtain from Step 4 of **ServiceNow instance configuration**. This will be used to deploy the application.
    - DEV_SERVER_PORT - For development mode only, the port on which the server runs locally. Only change if required.
4. In a command line, navigate to root of the extracted/cloned directory & run 'npm install'. This will install all the required dependencies.
5. The application can be run in 2 ways:
    - Development mode - This starts the application in localhost. Can be started by 'npm start'.
    - Deployment mode - This bundles the whole project along with all the image assets & deploys it to the configured ServiceNow instance. The bundled scripts & assets can be found under /dist directory. Can be started by 'npm run build'.

### Known issues:
> CORS error in development mode   
In development mode, during ajax calls users may face CORS errors, this is not a bug, its just standard HTTP access control to control HTTP requests origination from client side to server side.   
Workaround is to use a browser extenstion to avoid CORS errors, which auto inserts the CORS headers to each API request
