import App from '@/App';
import { store } from '@/store';
import React from 'react';
import { Provider } from 'react-redux';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

const Root: React.FC<any> = () => (
    <BrowserRouter>
        <Provider store={store}>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route path="/:filter" element={<App />} />
                </Route>
            </Routes>
        </Provider>
    </BrowserRouter>
);

export default Root;