const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const app = express();

const upload = multer({ dest: 'uploads/' });

app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const execAsync = promisify(exec);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

app.post('/convert', upload.single('file'), async (req, res) => {
    const inputWmfPath = req.file.path;
    const outputPngPath = path.join(path.dirname(inputWmfPath), path.basename(inputWmfPath, '.wmf') + '.png');

    try {
        // 使用 LibreOffice 将 WMF 转换为 PNG
        console.log(`Converting ${inputWmfPath} to PNG using LibreOffice...`);
        await execAsync(`soffice --headless --convert-to png ${inputWmfPath} --outdir ${path.dirname(inputWmfPath)}`);

        // 检查是否生成了 PNG 文件
        if (!fs.existsSync(outputPngPath)) {
            throw new Error('Failed to convert WMF to PNG using LibreOffice.');
        }

        // 使用 ImageMagick 裁剪图片
        console.log(`Trimming PNG image using ImageMagick...`);
        await execAsync(`convert ${outputPngPath} -trim +repage ${outputPngPath}`);

        // 读取生成的 PNG 文件
        const pngData = await readFileAsync(outputPngPath);

        // 发送 PNG 文件到客户端
        res.contentType('image/png');
        res.send(`data:image/png;base64,${pngData.toString('base64')}`);
    } catch (error) {
        console.error('Error during conversion:', error);
        res.status(500).send('Conversion failed');
    } finally {
        // 删除中间生成的文件
        await unlinkAsync(inputWmfPath).catch(console.error);
        if (fs.existsSync(outputPngPath)) await unlinkAsync(outputPngPath).catch(console.error);
    }
});


// server.requestTimeout = 1000; 可以手动设置超时时间
app.listen(9090);
