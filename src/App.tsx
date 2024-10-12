import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import Header from './components/header';
import Footer from './components/footer';
import { Provider } from './store';

import './index.css';

const App = () => {
    const router = useRoutes(routes);

    return (
        <Provider>
            <Suspense fallback={<div>Loading...</div>}>
                {router}
            </Suspense>
            <Header />
            <Footer />
        </Provider>
    );
}

export default App;
