import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../utils/axiosInstance';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Collection {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface Bookmark {
  id: string;
  url: string;
  title: string;
  notes?: string;
  collectionId?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isBookmarksLoading, setIsBookmarksLoading] = useState(false);
  const [bookmarksError, setBookmarksError] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCollections = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<Collection[]>('/collections',{
        params:{
            ownerId:user?.id
        }
      });
      setCollections(data);
    } catch {
      setError('Could not load collections.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/collections/${id}`);
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError('Could not delete that collection.');
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setIsCreating(true);
    try {
      const { data } = await axiosInstance.post<Collection>('/collections', {
        name: newName.trim(),
        ownerId: user?.id
      });
      setCollections((prev) => [...prev, data]);
      setNewName('');
      setCreateOpen(false);
    } catch {
      setError('Could not create the collection.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenCollection = async (collection: Collection) => {
    setSelectedCollection(collection);
    setIsBookmarksLoading(true);
    setBookmarksError(null);
    try {
      const { data } = await axiosInstance.get<Bookmark[]>(
        `/collections/${collection.id}/bookmarks`
      );
      setBookmarks(data);
    } catch {
      setBookmarksError('Could not load bookmarks for this collection.');
    } finally {
      setIsBookmarksLoading(false);
    }
  };

  const handleCloseBookmarksModal = () => {
    setSelectedCollection(null);
    setBookmarks([]);
    setBookmarksError(null);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 6, px: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Button variant="contained" onClick={() => navigate('/')}>
          Return
        </Button>
        <Typography variant="h4" component="h1">
          Collections
        </Typography>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          Create
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : collections.length === 0 ? (
        <Typography color="text.secondary">
          No collections yet. Create one to get started.
        </Typography>
      ) : (
        <List>
          {collections.map((collection) => (
            <ListItem
              key={collection.id}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(collection.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton onClick={() => handleOpenCollection(collection)}>
                <ListItemText primary={collection.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {/* Create collection modal */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>New collection</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Collection name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={isCreating || !newName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Collection bookmarks modal */}
      <Dialog
        open={selectedCollection !== null}
        onClose={handleCloseBookmarksModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{selectedCollection?.name}</DialogTitle>
        <DialogContent>
          {isBookmarksLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : bookmarksError ? (
            <Alert severity="error">{bookmarksError}</Alert>
          ) : bookmarks.length === 0 ? (
            <Typography color="text.secondary">
              No bookmarks in this collection yet.
            </Typography>
          ) : (
            <List>
              {bookmarks.map((bookmark) => (
                <ListItem key={bookmark.id} disablePadding>
                  <ListItemText
                    primary={bookmark.title}
                    secondary={bookmark.url}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBookmarksModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
