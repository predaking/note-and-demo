import { RouteObject } from 'react-router-dom';
import Index from '@/pages/Index';
import Entertainment from '@/pages/Entertainment';  
import ThreeKingdomsDebate from '@/pages/Entertainment/ThreeKingdomsDebate';
import Ai from '@/pages/Ai';

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
        path: '/ai',
        Component: Ai
    }
];

export default routes;