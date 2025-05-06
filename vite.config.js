import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({
    path: path.resolve(__dirname, '.env.development')
});

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
        port: process.env.LOCAL_PORT,
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
                target: 'https://127.0.0.1:3000',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
            '/ws': {
                target: 'wss://localhost:3000',
                changeOrigin: true,
                secure: false,
                ws: true,
                rewrite: (path) => path.replace(/^\/ws/, '')
            }
        }
    }
});