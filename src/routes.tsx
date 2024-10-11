import React, { lazy } from 'react';
const Index = lazy(() => import('./pages/Index'));
const Entertainment = lazy(() => import('./pages/Entertainment'));

const routes = [
    {
        path: '/',
        element: <Index />
    },
    {
        path: '/entertainment',
        element: <Entertainment />
    }
];

export default routes;