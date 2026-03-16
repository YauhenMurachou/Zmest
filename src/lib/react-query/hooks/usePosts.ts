import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  CreatePostParams,
  GetPostsParams,
  UpdatePostParams,
  postsApi,
} from 'src/api/postsApi';
import { queryKeys } from 'src/lib/react-query/queryKeys';

/**
 * Get all posts with pagination
 * GET /api/posts?limit=50&offset=0
 */
export const usePosts = (params: GetPostsParams = {}) =>
  useQuery({
    queryKey: queryKeys.posts.list(params),
    queryFn: async () => {
      const data = await postsApi.getPosts(params);
      return data;
    },
  });

/**
 * Get post by ID
 * GET /api/posts/:id
 */
export const usePost = (id: number) =>
  useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: async () => {
      const post = await postsApi.getPostById(id);
      return post;
    },
    enabled: !!id,
  });

/**
 * Get posts by author
 * GET /api/posts/author/:authorId?limit=50&offset=0
 */
export const usePostsByAuthor = (
  authorId: number,
  params: GetPostsParams = {}
) =>
  useQuery({
    queryKey: queryKeys.posts.byAuthor(authorId, params),
    queryFn: async () => {
      const data = await postsApi.getPostsByAuthor(authorId, params);
      return data;
    },
    enabled: !!authorId,
  });

/**
 * Create post mutation
 * POST /api/posts
 * Requires: Authentication
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreatePostParams) => {
      const post = await postsApi.createPost(params);
      return post;
    },
    onSuccess: () => {
      // Invalidate all posts queries (covers lists with/without params, byAuthor with/without params)
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.all,
        predicate: (query) => query.queryKey[0] === 'posts',
      });
    },
  });
};

/**
 * Update post mutation
 * PUT /api/posts/:id
 * Requires: Authentication, must be the author
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      params,
    }: {
      id: number;
      params: UpdatePostParams;
    }) => {
      const post = await postsApi.updatePost(id, params);
      return post;
    },
    onSuccess: (post) => {
      // Invalidate the specific post detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(post.id),
      });
      // Invalidate all posts queries (covers lists with/without params, byAuthor with/without params)
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.all,
        predicate: (query) => query.queryKey[0] === 'posts',
      });
    },
  });
};

/**
 * Delete post mutation
 * DELETE /api/posts/:id
 * Requires: Authentication, must be the author
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, authorId }: { id: number; authorId: number }) => {
      await postsApi.deletePost(id);
      return { id, authorId };
    },
    onSuccess: ({ id }) => {
      // Remove the post from cache
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(id) });
      // Invalidate all posts queries (covers lists with/without params, byAuthor with/without params)
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.all,
        predicate: (query) => query.queryKey[0] === 'posts',
      });
    },
  });
};
