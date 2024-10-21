import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('app');

if (rootElement) {
    createRoot(rootElement).render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}

