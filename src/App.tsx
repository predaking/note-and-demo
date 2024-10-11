import React, { Suspense, createContext } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import Header from './components/header';
import Footer from './components/footer';
import { state, dispatch } from './store';

import './index.css';

const App = () => {
    const router = useRoutes(routes);
    const Context = createContext(state);

    return (
        <Context.Provider 
            value={{
                state,
                dispatch
            }}
        >
            <Suspense fallback={<div>Loading...</div>}>
                {router}
            </Suspense>
            <Header />
            <Footer />
        </Context.Provider>
    );
}

export default App;
