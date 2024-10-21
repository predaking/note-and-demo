import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { defineConfig as babelConfig } from "vite-plugin-importer";
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        babelConfig({
            libraryName: 'antd',  
            libraryDirectory: 'es',  
            style: 'css', // 默认为 'css'，你也可以选择 'less' 
        })
    ],
    resolve: {
        alias: [{
            find: '@',
            replacement: path.resolve(__dirname, 'src')
        }],
    }
});