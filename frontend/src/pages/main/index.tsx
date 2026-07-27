import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

export default function MainPage() {
    const { user, isAuthenticated, isLoading, login, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            {isLoading ?
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                    }}
                >
                    <CircularProgress />
                </Box>
                : <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        textAlign: 'center',
                        px: 2,
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Bookmarks
                    </Typography>

                    {isAuthenticated ? (
                        <>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                                Welcome back{user?.email ? `, ${user.email}` : ''}.
                            </Typography>
                            <Stack direction="column" spacing={2}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/collections')}
                                >
                                    Go to Collections
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate('/bookmarks')}
                                >
                                    Go to Bookmarks
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    sx={{ background: 'red', color: 'white' }}
                                    onClick={logout}
                                >
                                    Log out
                                </Button>
                            </Stack>
                        </>
                    ) : (
                        <>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                                Sign in to see your saved links.
                            </Typography>
                            <Button variant="contained" size="large" onClick={login}>
                                Log in
                            </Button>
                        </>
                    )}
                </Box>}
        </>
    );
}
