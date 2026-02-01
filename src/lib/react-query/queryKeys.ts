/**
 * Centralized query keys factory for React Query
 * This helps maintain consistency and avoid typos in query keys
 */
export const queryKeys = {
  // Auth queries
  auth: {
    me: ['auth', 'me'] as const,
  },

  // Posts queries
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (params?: { limit?: number; offset?: number }) =>
      [...queryKeys.posts.lists(), params] as const,
    detail: (id: number) => [...queryKeys.posts.all, 'detail', id] as const,
    byAuthor: (authorId: number, params?: { limit?: number; offset?: number }) =>
      [...queryKeys.posts.all, 'author', authorId, params] as const,
  },
};
