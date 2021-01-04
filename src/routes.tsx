import React from "react";
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/home';
import Point from './pages/point';


const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact />
            <Route component={Point} path="/cadastrar" />
        </BrowserRouter>
    )
}

export default Routes;
