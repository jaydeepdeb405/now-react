import axios from 'axios';

class RestMessage {

    constructor(endpoint, httpMethod, requestHeaders, requestBody) {
        this.endpoint = endpoint || '';
        this.httpMethod = httpMethod || '';
        this.auth = null;
        this.requestHeaders = requestHeaders || {};
        this.requestBody = requestBody || {};
        this.timeoutMs = 0;
    }

    getEndpoint() {
        return this.endpoint;
    }

    getRequestBody() {
        return this.requestBody;
    }

    getRequestHeader(headerName) {
        return this.requestHeaders[headerName];
    }

    getRequestHeaders() {
        return this.requestHeaders;
    }

    setBasicAuth(username, password) {
        this.auth = { username, password };
    }

    setEndpoint(endpoint) {
        this.endpoint = endpoint;
    }

    setHttpMethod(httpMethod) {
        this.httpMethod = httpMethod;
    }

    setQueryParameter(name, value) {
        const paramIndex = this.endpoint.lastIndexOf('?');
        const delimiter = paramIndex === -1 ? '?' : '&';
        this.endpoint += `${delimiter}${name}=${value}`;
    }

    setRequestBody(requestBody) {
        this.requestBody = requestBody;
    }

    setRequestHeader(name, value) {
        this.requestHeaders[name] = value;
    }

    setStringParameter(name, value) {
        this.setStringParameterNoEscape(name, escape(value));
    }

    setStringParameterNoEscape(name, value) {
        String.prototype.interpolate = function(name, value) {
            if(this.indexOf(name) === -1) return this;
            else return new Function(name, `return \`${this}\`;`)(value);
        }
        this.endpoint = this.endpoint.interpolate(name, value);
        let requestBodyStr = JSON.stringify(this.requestBody);
        this.requestBody = JSON.parse(requestBodyStr.interpolate(name, value));
    }

    setHttpTimeout(timeoutMs) {
        this.timeoutMs = timeoutMs;
    }

    async execute() { 
        if(this.endpoint === '') throw 'Endpoint not specified';
        if(this.httpMethod === '') throw 'HTTP Method not specified';
        const axiosParams = {
            url: this.endpoint,
            method: this.httpMethod,
            headers: this.requestHeaders,
            data: this.requestBody,
            timeout: this.timeoutMs
        };
        this.auth === null ? null : axiosParams.auth = this.auth;
        const axiosResponse = await axios(axiosParams);
        return {
            getBody: () => { return axiosResponse.data.result || {} },
            getStatusCode: () => { return axiosResponse.status || 0 },
            getHeader: (name) => { return axiosResponse.headers[name] },
            getAllHeaders: () => { return axiosResponse.headers || {} }
        };
    }

    executeAsync() { 
        if(this.endpoint === '') throw 'Endpoint not specified';
        if(this.httpMethod === '') throw 'HTTP Method not specified';
        const axiosParams = {
            url: this.endpoint,
            method: this.httpMethod,
            headers: this.requestHeaders,
            data: this.requestBody,
            timeout: this.timeoutMs
        };
        this.auth === null ? null : axiosParams.auth = this.auth;
        return axios(axiosParams);
    }

}

export default RestMessage;