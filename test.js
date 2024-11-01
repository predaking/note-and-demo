const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const convertWmfToPng = async (inputWmf) => {
    // 使用 LibreOffice 将 WMF 转换为 PNG
    await execAsync(`soffice --headless --convert-to png ${inputWmf}`);

    // 获取生成的 PNG 文件名
    const inputPng = inputWmf.replace('.wmf', '.png');

    // 生成临时输出文件名
    const outputPng = `trimmed_${inputPng}`;

    // 使用 ImageMagick 裁剪图片
    await execAsync(`convert ${inputPng} -trim +repage ${outputPng}`);

    // 读取生成的 PNG 文件并转换为 Base64
    const pngData = fs.readFileSync(outputPng);
    //   const base64Png = pngData.toString('base64');

    // 删除中间生成的 PNG 文件
    fs.unlinkSync(inputPng);
    fs.unlinkSync(outputPng);

    return pngData;
}

export default convertWmfToPng;

// convertWmfToPng('image1.wmf').then((pngData) => {
//     console.log(pngData);
// });


