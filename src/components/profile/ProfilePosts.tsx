import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Post } from 'src/api/api';
import Loader from 'src/components/common/atoms/loader/Loader';
import { PostCard } from 'src/components/posts/PostCard';
import {
  useAuth,
  useCreatePost,
  useDeletePost,
  usePostsByAuthor,
  useUpdatePost,
} from 'src/lib/react-query/hooks';

import styles from './ProfilePosts.module.css';

type ProfilePostsProps = {
  authorId: number | null;
  isOwner: boolean;
};

const ProfilePosts: FC<ProfilePostsProps> = ({ authorId, isOwner }) => {
  const { t } = useTranslation();
  const { data: currentUser } = useAuth();
  const { data: postsData, isLoading } = usePostsByAuthor(authorId ?? 0, {
    limit: 50,
    offset: 0,
  });
  const createPost = useCreatePost();
  const deletePost = useDeletePost();
  const updatePost = useUpdatePost();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editing, setEditing] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      await createPost.mutateAsync({
        title: title.trim(),
        content: content.trim(),
      });
      setTitle('');
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id: number, authorIdParam: number) => {
    if (window.confirm(String(t('posts.confirmDelete')))) {
      deletePost.mutate({ id, authorId: authorIdParam });
    }
  };

  const startEdit = (post: Post) => {
    setEditing(post);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditTitle('');
    setEditContent('');
  };

  const saveEdit = async () => {
    if (!editing || !editTitle.trim() || !editContent.trim()) return;
    try {
      await updatePost.mutateAsync({
        id: editing.id,
        params: { title: editTitle.trim(), content: editContent.trim() },
      });
      cancelEdit();
    } catch (err) {
      console.error(err);
    }
  };

  if (authorId == null) return null;

  const posts = postsData?.posts ?? [];

  return (
    <section className={styles.section}>
      <Typography variant="h6" className={styles.sectionTitle}>
        {t('profile.posts')}
      </Typography>

      {isOwner && (
        <Card className={styles.formCard} elevation={0}>
          <CardContent className={styles.formCardContent}>
            <form onSubmit={handleCreate} className={styles.form}>
              <TextField
                fullWidth
                size="small"
                placeholder={t('posts.title') ?? ''}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                size="small"
                placeholder={t('posts.content') ?? ''}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                multiline
                minRows={2}
                className={styles.input}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Button
                type="submit"
                variant="contained"
                size="medium"
                disabled={
                  !title.trim() || !content.trim() || createPost.isPending
                }
                className={styles.submitBtn}
              >
                {createPost.isPending
                  ? t('posts.publishing')
                  : t('profile.addPost')}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {editing && isOwner && (
        <Card className={styles.formCard} elevation={0}>
          <CardContent className={styles.formCardContent}>
            <Typography variant="subtitle2" className={styles.editLabel}>
              {t('posts.editPost')}
            </Typography>
            <TextField
              fullWidth
              size="small"
              label={t('posts.title')}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className={styles.input}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              size="small"
              label={t('posts.content')}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              multiline
              minRows={2}
              className={styles.input}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <div className={styles.editActions}>
              <Button size="medium" onClick={cancelEdit}>
                {t('profile.back')}
              </Button>
              <Button
                variant="contained"
                size="medium"
                onClick={saveEdit}
                disabled={
                  !editTitle.trim() ||
                  !editContent.trim() ||
                  updatePost.isPending
                }
              >
                {updatePost.isPending ? t('posts.saving') : t('profile.save')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className={styles.loaderWrap}>
          <Loader isFetching />
        </div>
      ) : posts.length === 0 ? (
        <div className={styles.empty}>
          <Typography variant="body2" color="text.secondary">
            {t('posts.empty')}
          </Typography>
        </div>
      ) : (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard
                post={post}
                isAuthor={currentUser?.id === post.authorId}
                onDelete={handleDelete}
                onEdit={startEdit}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ProfilePosts;
