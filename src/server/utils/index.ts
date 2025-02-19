export const sendToClient = (type: string, data: any) => {
    return JSON.stringify({
        type,
        data
    })
};