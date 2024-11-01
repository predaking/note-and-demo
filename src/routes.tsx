import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
const Index = lazy(() => import('./pages/Index'));
const Entertainment = lazy(() => import('./pages/Entertainment'));
const Conversion = lazy(() => import('./pages/Conversion'));

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Index />
    },
    {
        path: '/entertainment',
        element: <Entertainment />
    },
    {
        path: '/conversion',
        element: <Conversion />
    }
];

export default routes;