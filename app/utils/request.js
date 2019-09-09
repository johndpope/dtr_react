import axios from 'axios';

function parseJSON(response) {
    if (response.status === 204 || response.status === 205) {
    return null;
    }
    return response;
}


function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
    return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

const request = (url, options) => {
    return axios.post(url, options)
    .then(checkStatus)
    .then(parseJSON);
}

export default request;