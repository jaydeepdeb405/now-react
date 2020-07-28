const fs = require('fs');
const axios = require('axios');
const servicenowConfig = require('./servicenow.config');

const BUNDLED_ASSETS_DIR_PATH = './dist/images';
const BUNDLED_SCRIPT_PATH = './dist/bundle.js';

const DEFAULT_CONFIG = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    auth: {
        username: servicenowConfig.USERNAME,
        password: servicenowConfig.PASSWORD
    }
};

(async function main() {
    try {
        const bundleData = fs.readFileSync(BUNDLED_SCRIPT_PATH, 'utf-8');

        console.log('\nScript bundling complete\n\nUploading scripts...\n');
        _uploadBundledScript(bundleData)
            .then(() => {
                const applicationUrl = servicenowConfig.HOST + servicenowConfig.APP_URL_BASE;
                console.log('Script upload complete\n');

                _handleAssets()
                    .then(response => {
                        console.log(`${response}\nOpening application in browser : '${applicationUrl}'\n`);
                        require("openurl").open(applicationUrl);
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => {
                error.hasOwnProperty('response') ? console.log(`Error while uploading script, Error : ${error.response.data.error.message}`) :
                    console.log(`Error while uploading script, Error : ${error.message}`);
            });
    }
    catch (error) {
        console.error(`Error while bundling script, ${error}`)
    }
})();

function _handleAssets() {
    return new Promise((resolve, reject) => {
        try {
            const supportedExtentions = ['jpg', 'png', 'bmp', 'gif', 'jpeg', 'ico', 'svg'];
            let imageData = [];

            console.log(`Uploading image assets...\n`);
            fs.readdirSync(BUNDLED_ASSETS_DIR_PATH).map((fileName) => {
                const fileExtn = fileName.split('.').pop();
                if (supportedExtentions.indexOf(fileExtn) !== -1) {
                    let image = {};
                    image.name = fileName;
                    image.format = `image/${fileExtn}`;
                    image.scope = servicenowConfig.APP_SCOPE;
                    imageData.push(image);
                } else {
                    console.error(`"${fileName}" ignored, unsupported image extension ${fileExtn}`);
                }
            });


            _createDBImageRecords(imageData)
                .then(response => {
                    const imageRecords = response.data.result || [];
                    let imageAttachmentsPromises = [];

                    imageRecords.forEach((image) => {
                        const operation = image.operation;
                        if (operation === 'ignored') console.log(`"${image.name}" ignored, image with same name present`);
                        else {
                            imageAttachmentsPromises.push(new Promise((resolve, reject) => {
                                _createImageAttachment(image)
                                    .then(() => {
                                        console.log(`"${image.name}" ${operation}`);
                                        resolve();
                                    })
                                    .catch(error => {
                                        error.hasOwnProperty('response') === true ?
                                            console.log(`${image.name} - Attachment upload error : ${error.response.data.error.message}, ${error.response.data.error.detail}`) :
                                            console.log(`${image.name} - Attachment upload error : ${error.message}`);
                                        reject();
                                    });
                            }));
                        }
                    });
                    Promise.all(imageAttachmentsPromises).then(() => resolve(`\n${imageAttachmentsPromises.length} images uploaded\n`));
                })
                .catch(error => {
                    reject(`Error while creating images : ${error.message}`);
                });
        } catch (error) {
            reject(`Error while handling assets, ${error}`);
        }
    });
}

function _uploadBundledScript(bundleData) {
    return _postRequest(`/api/488924/react_spa_provider/script/${servicenowConfig.SCRIPT_RECORD_ID}`, { script: escape(bundleData) }, DEFAULT_CONFIG);
}

function _createDBImageRecords(images) {
    return _postRequest(`/api/488924/react_spa_provider/images?overwrite=${servicenowConfig.OVERWRITE_IMAGE_ATTACHMENTS}`, { images }, DEFAULT_CONFIG);
}

function _createImageAttachment(image) {
    let defaultConfig = Object.assign({}, DEFAULT_CONFIG);
    defaultConfig.headers = {
        'Accept': 'application/json',
        'Content-Type': image.format
    };
    return _postRequest(`/api/now/attachment/file?table_name=db_image&table_sys_id=${image.sys_id}&file_name=image`, fs.createReadStream(`${BUNDLED_ASSETS_DIR_PATH}/${image.name}`), defaultConfig);
}

function _postRequest(relativePath, requestBody, config) {
    return axios.post(`${servicenowConfig.HOST}${relativePath}`, requestBody, config);
}

