import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';
import fs from 'fs';

export default defineConfig({
    plugins: [
        react()
    ],
    resolve: {
        alias: [{
            find: '@',
            replacement: path.resolve(__dirname, 'src')
        }],
    },
    server: {
        https: {
            key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem'))
        }
    }
});