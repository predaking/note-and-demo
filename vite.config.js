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
            key: fs.readFileSync(path.resolve(__dirname, 'predaking.key')),
            cert: fs.readFileSync(path.resolve(__dirname, 'predaking.crt'))
        },
        proxy: {
            '/ollama': {
                target: 'http://localhost:11434',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/ollama/, '')
            },
            '/api': {
                target: 'https://10.203.81.15:3000',
                // target: '//192.168.1.54:3000',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
        }
    }
});