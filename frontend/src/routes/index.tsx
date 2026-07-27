import CollectionsPage from '../pages/collections';
import MainPage from '../pages/main';
import BookmarksPage from '../pages/bookmarks';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import RequireAuth from '../components/authguard';

function Routes() {
    return useRoutes([
        {
            path: '/',
            element: <MainPage />,
        },
        {
            path: '/collections',
            element:
                <RequireAuth>
                    <CollectionsPage />
                </RequireAuth>
        },
        {
            path: '/bookmarks',
            element:
                <RequireAuth>
                    <BookmarksPage />
                </RequireAuth>

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