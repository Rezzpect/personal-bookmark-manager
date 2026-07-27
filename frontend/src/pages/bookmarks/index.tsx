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
  MenuItem,
  Link as MuiLink,
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

const NO_FILTER = '__all__';
const NO_COLLECTION = '__none__';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterCollectionId, setFilterCollectionId] = useState<string>(NO_FILTER);

  const [createOpen, setCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newCollectionId, setNewCollectionId] = useState<string>(NO_COLLECTION);

  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCollections = async () => {
    try {
      const { data } = await axiosInstance.get<Collection[]>('/collections');
      setCollections(data);
    } catch {
      // Non-fatal: filter/collection picker just won't have options
    }
  };

  const fetchBookmarks = async (collectionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get<Bookmark[]>('/bookmarks', {
        params: { 
            collectionId: collectionId === NO_FILTER ? undefined : collectionId,
            ownerId: user?.id
        },
      });
      setBookmarks(data);
    } catch {
      setError('Could not load bookmarks.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    fetchBookmarks(filterCollectionId);
  }, [filterCollectionId]);

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/bookmarks/${id}`);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } catch {
      setError('Could not delete that bookmark.');
    }
  };

  const resetCreateForm = () => {
    setNewTitle('');
    setNewUrl('');
    setNewNotes('');
    setNewCollectionId(NO_COLLECTION);
  };

  const handleCreate = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    setIsCreating(true);
    try {
      const { data } = await axiosInstance.post<Bookmark>('/bookmarks', {
        title: newTitle.trim(),
        url: newUrl.trim(),
        notes: newNotes.trim() || undefined,
        collectionId:
          newCollectionId === NO_COLLECTION ? undefined : newCollectionId,
        ownerId: user?.id
      });
      // Only show it in the list if it matches the current filter
      if (
        filterCollectionId === NO_FILTER ||
        data.collectionId === filterCollectionId
      ) {
        setBookmarks((prev) => [...prev, data]);
      }
      resetCreateForm();
      setCreateOpen(false);
    } catch {
      setError('Could not create the bookmark.');
    } finally {
      setIsCreating(false);
    }
  };

  const collectionName = (collectionId?: string) =>
    collections.find((c) => c.id === collectionId)?.name;

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6, px: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Button variant="contained" onClick={() => navigate('/')}>
          Return
        </Button>
        <Typography variant="h4" component="h1">
          Bookmarks
        </Typography>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          Create
        </Button>
      </Box>

      <TextField
        select
        label="Filter by collection"
        value={filterCollectionId}
        onChange={(e) => setFilterCollectionId(e.target.value)}
        sx={{ mb: 3, minWidth: 240 }}
      >
        <MenuItem value={NO_FILTER}>All bookmarks</MenuItem>
        {collections.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.name}
          </MenuItem>
        ))}
      </TextField>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : bookmarks.length === 0 ? (
        <Typography color="text.secondary">No bookmarks found.</Typography>
      ) : (
        <List>
          {bookmarks.map((bookmark) => (
            <ListItem
              key={bookmark.id}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(bookmark.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton onClick={() => setSelectedBookmark(bookmark)}>
                <ListItemText
                  primary={bookmark.title}
                  secondary={bookmark.url}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}

      {/* Create bookmark modal */}
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>New bookmark</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <TextField
            autoFocus
            fullWidth
            required
            label="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <TextField
            fullWidth
            required
            label="URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <TextField
            fullWidth
            label="Notes"
            multiline
            minRows={2}
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
          />
          <TextField
            select
            fullWidth
            label="Collection"
            value={newCollectionId}
            onChange={(e) => setNewCollectionId(e.target.value)}
          >
            <MenuItem value={NO_COLLECTION}>No collection</MenuItem>
            {collections.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={isCreating || !newTitle.trim() || !newUrl.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bookmark detail modal */}
      <Dialog
        open={selectedBookmark !== null}
        onClose={() => setSelectedBookmark(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{selectedBookmark?.title}</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
        >
          {selectedBookmark && (
            <>
              <MuiLink
                href={selectedBookmark.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedBookmark.url}
              </MuiLink>
              {selectedBookmark.notes && (
                <Typography variant="body2" color="text.secondary">
                  {selectedBookmark.notes}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Collection:{' '}
                {collectionName(selectedBookmark.collectionId) ??
                  'Uncategorised'}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedBookmark(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
