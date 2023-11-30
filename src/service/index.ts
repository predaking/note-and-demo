export const formUpload = (url: any, data: XMLHttpRequestBodyInit, options?: any) => {
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