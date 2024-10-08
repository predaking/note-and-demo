import { message } from "antd";

const host = 'http://localhost:3000';

export const formUpload = (url: string, data: XMLHttpRequestBodyInit, options?: any) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(xhr.response);
                return;
            }
        }
        xhr.open('post', url, true);
        // xhr.withCredentials = true; 
        xhr.send(data);
    })
}

export const request = (url: string, data?: any, method: string = 'GET') => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const res = JSON.parse(xhr.response);
                if (res.code) {
                    message.error(res.msg);
                    reject(res);
                } else {
                    resolve(res);
                }
            } else {
                console.log('err: ', xhr.response);
                reject(xhr.response);
            }
        };
        xhr.open(method, `${host}${url}`, true);
        xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    });
};