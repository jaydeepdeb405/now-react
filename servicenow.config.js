module.exports = {
    /**
     * ServiceNow instance URL
     * Provide url in this format 'https://dev99999.service-now.com/'
     */
    HOST             : '',   
    /**
     * ServiceNow instance username
     * This will be used as credential for REST in DEVELOPMENT mode
     */      
    USERNAME         : '',   
    /**
     * ServiceNow instance password
     * This will be used as credential for REST in DEVELOPMENT mode
     */ 
    PASSWORD         : '',  
    /**
     * Base URL for the React application
     * This is usually /now/appname for global & /x/namespace/appname for scoped apps
     */ 
    APP_URL_BASE     : '',  
    /**
     * sys_id of ServiceNow UX source code
     * This can be found on the starter page after creating the React app in ServiceNow
     */  
    SCRIPT_RECORD_ID : '',
    /**
     * CHANGE THIS ONLY IF NPM START DOESN'T START DEVELOPMENT SERVER
     * Port number - Default value is 5000
     */  
    DEV_SERVER_PORT : 5000      
};