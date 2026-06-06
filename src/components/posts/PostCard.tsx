import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import { FC } from 'react';

import { Post } from 'src/api/api';

import styles from './PostCard.module.css';

export const formatPostDate = (dateStr?: string) => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return dateStr;
  }
};

type PostCardProps = {
  post: Post;
  isAuthor: boolean;
  onDelete: (id: number, authorId: number) => void;
  onEdit: (post: Post) => void;
};

export const PostCard: FC<PostCardProps> = ({
  post,
  isAuthor,
  onDelete,
  onEdit,
}) => (
  <Card className={styles.card} elevation={0}>
    <CardContent className={styles.cardContent}>
      <Box className={styles.header}>
        <Typography variant="subtitle1" className={styles.title}>
          {post.title}
        </Typography>
        {isAuthor && (
          <Box className={styles.actions}>
            <IconButton
              size="small"
              aria-label="edit"
              onClick={() => onEdit(post)}
              className={styles.iconBtn}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              aria-label="delete"
              onClick={() => onDelete(post.id, post.authorId)}
              className={styles.iconBtn}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
      <Typography variant="caption" className={styles.meta}>
        {post.author?.name ??
          post.author?.username ??
          post.author?.login ??
          `User #${post.authorId}`}
        {' · '}
        {formatPostDate(post.createdAt)}
      </Typography>
      <Typography variant="body2" className={styles.content}>
        {post.content}
      </Typography>
    </CardContent>
  </Card>
);
