import { ResultType } from "@/interface";
import { message } from "antd";

// const host = 'https://10.203.81.15:3000';
const host = 'https://192.168.1.54:3000';


export const formUpload = (url: string, data: XMLHttpRequestBodyInit, options?: any) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(new Error(`Upload failed with status: ${xhr.status}`));
                }
            }
        }
        xhr.onerror = (error) => {
            reject(error);
        };
        xhr.open('post', `${host}${url}`, true);
        xhr.withCredentials = true;
        xhr.send(data);
    })
}

const request = (method: string = 'get', url: string, data: any = {}): Promise<ResultType> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, `${host}${url}`, true);
        xhr.withCredentials = true;
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && (xhr.status === 200 
                || xhr.status === 401)
            ) {
                const res: ResultType = JSON.parse(xhr.response);
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

export const get = (url: string, data: any = {}): Promise<ResultType> => {
    return request('GET', url, data);
}

export const post = (url: string, data: any = {}): Promise<ResultType> => {
    return request('POST', url, data);
}