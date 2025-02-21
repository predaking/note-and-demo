import { RouteObject } from 'react-router-dom';
import Index from '@/pages/Index';
import Entertainment from '@/pages/Entertainment';  
import Conversion from '@/pages/Conversion';
import ThreeKingdomsDebate from '@/pages/Entertainment/ThreeKingdomsDebate';

const routes: RouteObject[] = [
    {
        path: '/',
        Component: Index
    },
    {
        path: '/entertainment',
        Component: Entertainment,
    },
    {
        path: '/entertainment/threeKingdomsDebate',
        Component: ThreeKingdomsDebate
    },
    {
        path: '/conversion',
        Component: Conversion
    }
];

export default routes;