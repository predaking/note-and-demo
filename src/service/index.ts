import { message } from "antd";

const host = 'https://localhost:3000';

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

export const request = (url: string, data: any = {}, method: string = 'GET') => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, host, true);
        xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const res = JSON.parse(xhr.response);
                if (res.code) {
                    message.error(res.msg);
                    reject(res);
                } else {
                    resolve(res);
                }
            }
        };
        xhr.onerror = (err) => {
            console.log('err: ', err);
            reject(err);
        }
    });
};