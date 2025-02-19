import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import Header from './components/header';
import Footer from './components/footer';
import Register from './components/register';
import { Provider } from './store';
import 'normalize.css'
import './index.css';

const App = () => {
    const router = useRoutes(routes);

    return (
        <Provider>
            <Suspense fallback={<div>Loading...</div>} >
                {router}
            </Suspense>
            <Register />
            {/* <Header /> */}
            {/* <Footer /> */}
        </Provider>
    );
}

export default App;
