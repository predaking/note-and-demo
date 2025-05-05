import { ResultType } from "@/interface";
import { message } from "antd";

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
        xhr.open('post', url, true);
        xhr.withCredentials = true;
        xhr.send(data);
    })
}

const request = (method: string = 'get', url: string, data: any = {}): Promise<ResultType> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
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

const read = (reader?: any, decoder?: any, resolve?: any, callback?: any) => {
    reader?.read().then(({ done, value } : { done: any, value: any }) => {
        if (done) {
            resolve();
            return;
        };
        const chunk = decoder.decode(value);
        callback(JSON.parse(chunk));
        read(reader, decoder, resolve, callback);
    });
}

export const streamRequest = (
    url: string, 
    method: 'GET' | 'POST', 
    body: any, 
    callback: Function, 
    headers?: any
): Promise<ResultType> => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    ...(headers || {}) 
                },
                body: JSON.stringify(body)
            })
    
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            read(reader, decoder, resolve, callback);
        } catch (error) {
            reject(error);
        }
    })
}
