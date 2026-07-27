import CollectionsPage from '../pages/collections';
import MainPage from '../pages/main';
import BookmarksPage from '../pages/bookmarks';
import { BrowserRouter, useRoutes } from 'react-router-dom';

function Routes() {
    return useRoutes([
        {
            path: '/',
            element: <MainPage/>,
        },
        {
            path: '/collections',
            element: <CollectionsPage/>
        },
        {
            path: '/bookmarks',
            element: <BookmarksPage/>
        }
    ]);
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes />
        </BrowserRouter>
    )
}