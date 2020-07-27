const fs = require('fs');
const axios = require('axios');
const servicenowConfig = require('./servicenow.config');

const requestHeaders = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    auth: {
        username: servicenowConfig.USERNAME,
        password: servicenowConfig.PASSWORD
    }
};

(function main() {
    const bundleData = fs.readFileSync('./dist/bundle.js', 'utf-8');

    console.log('\nScript bundling complete\n\nUploading scripts...\n');
    _uploadScriptBundle(bundleData)
        .then(response => {
            console.log('Script upload complete\n');
            const pageUrl = response.data.result.pageUrl;
            const imageAssetsPromises = _sendImageAssets();

            Promise.all(imageAssetsPromises)
                .then(() => {
                    console.log(`\n${imageAssetsPromises.length} image assets processed\n`);
                    if (pageUrl !== null) { require("openurl").open(pageUrl); console.log(`Opening application in browser : '${pageUrl}'\n`); }
                    else console.log("Unable to open URL");
                })
                .catch((error) => console.log(error));
        })
        .catch(error => {
            if (error.response) {
                console.log(`Status : ${error.response.status}/${error.response.data.status}`);
                console.log(`Error message : ${error.response.data.error.message}`);
                console.log(`Error details : ${error.response.data.error.detail}`);
            }
            else console.log(`Error : ${error.message}`);
        });

})();

function _sendImageAssets() {
    let images = _buildImagePayload();
    let imageUploadPromises = [];

    console.log('Bundling & uploading image assets... \n');

    images.forEach(image => {
        imageUploadPromises.push(_handleImage(image));
    });

    return imageUploadPromises;
}

function _handleImage(image) {
    return new Promise((resolve, reject) => {
        _createImageFile(image).then(response => {
            if (response.data.hasOwnProperty('result') === true && response.data.result.hasOwnProperty('sys_id') === true) {
                image.sys_id = response.data.result.sys_id;
                _uploadImageBinary(image)
                    .then(() => { console.log(`${image.name} uploaded`); resolve(); })
                    .catch(error => {
                        if (error.response) {
                            console.log(`${image.name} - Binary upload error : ${error.response.data.error.message}, ${error.response.data.error.detail}`);
                        }
                        else console.log(`Error : ${error.message}`);
                        resolve();
                    });
            }
            else throw `${image.name} - error: image record creation failed`;
        }).catch(error => {
            if (error.response) {
                console.log(`${image.name} - error: ${error.response.data.error.message}, ${error.response.data.error.detail}`);
            }
            else console.log(`Error : ${error.message || error}`);
            resolve();
        });
    });
}

function _buildImagePayload() {
    return fs.readdirSync('./dist/images').map((fileName) => {
        let image = {};
        const fileExtn = fileName.substr(fileName.lastIndexOf('.') + 1);
        image.name = fileName;
        image.type = `image/${fileExtn}`;
        image.sys_id = '';
        return image;
    });
}

function _uploadScriptBundle(bundleData) {
    return _postRequest(`/api/488924/react_spa_provider/inject_react/${servicenowConfig.SCRIPT_RECORD_ID}`, { script: escape(bundleData) }, requestHeaders);
}

function _createImageFile(image) {
    return _postRequest('/api/now/table/db_image', { name: image.name }, requestHeaders);
}

function _uploadImageBinary(image) {
    let headers = Object.assign({}, requestHeaders);
    headers.headers = {
        'Accept': 'application/json',
        'Content-Type': image.type
    };
    return _postRequest(`/api/now/attachment/file?table_name=db_image&table_sys_id=${image.sys_id}&file_name=image`, fs.createReadStream(`./dist/images/${image.name}`), headers);
}

function _postRequest(relativePath, requestBody, headers) {
    return axios.post(`${servicenowConfig.HOST}${relativePath}`, requestBody, headers);
}

