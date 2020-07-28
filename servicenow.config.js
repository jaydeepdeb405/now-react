module.exports = {
    /**
     * ServiceNow instance URL
     * Provide url in this format 'https://dev99999.service-now.com/' (Always prefix with https://)
     */
    HOST                        : '',   
    /**
     * ServiceNow instance username
     * This will be used as credential for REST in DEVELOPMENT mode
     */      
    USERNAME                    : '',   
    /**
     * ServiceNow instance password
     * This will be used as credential for REST in DEVELOPMENT mode
     */ 
    PASSWORD                    : '',  
    /**
     * ServiceNow application scope
     * Scope is 'global' for Global application & 'x_namespace_applicationname' for scoped applications
     * Leaving this empty auto defaults to Global application
     */ 
    APP_SCOPE                   : '',
    /**
     * Base URL for the React application
     * This is usually /now/appname for global & /x/namespace/reactappname for scoped applications
     */ 
    APP_URL_BASE                : '',  
    /**
     * sys_id of ServiceNow UX source code
     * This can be found on the starter page after creating the React app in ServiceNow
     */  
    SCRIPT_RECORD_ID            : '',
    /**
     * ServiceNow Image overwrite setting 
     * If true, it will update/overwrite the existing images with the same name in the instance, happens on every 'npm run build'
     * Browser cache needs to erased in order to see the overwritten images
     * Leaving this empty auto defaults to false
     */ 
    OVERWRITE_IMAGE_ATTACHMENTS : false,
    /**
     * CHANGE THIS ONLY IF NPM START DOESN'T START DEVELOPMENT SERVER
     * Port number - Default value is 5000
     */  
    DEV_SERVER_PORT             : 5000      
};
