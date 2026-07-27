import MainPage from '../pages/main';
import { BrowserRouter, useRoutes } from 'react-router-dom';

function Routes() {
    return useRoutes([
        {
            path: '/',
            element: <MainPage/>,
        },
        // {
        //     path: '*',
        //     element: <PageNotFound/>
        // }
    ]);
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
    )
}