import { RouteObject } from 'react-router-dom';
import Index from '@/pages/Index';
import Entertainment from '@/pages/Entertainment';  
import Conversion from '@/pages/Conversion';

const routes: RouteObject[] = [
    {
        path: '/',
        Component: Index
    },
    {
        path: '/entertainment',
        Component: Entertainment
    },
    {
        path: '/conversion',
        Component: Conversion
    }
];

export default routes;