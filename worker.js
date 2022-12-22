self.onmessage = function ({ data }) {
    postMessage(JSON.parse(data));
}