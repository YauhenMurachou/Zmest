import { instance2, Post, PostsResponse } from 'src/api/api';

export type CreatePostParams = {
  title: string;
  content: string;
};

export type UpdatePostParams = {
  title?: string;
  content?: string;
};

export type GetPostsParams = {
  limit?: number;
  offset?: number;
};

export const postsApi = {
  /**
   * Get all posts with pagination
   * GET /api/posts?limit=50&offset=0
   */
  async getPosts(params: GetPostsParams = {}): Promise<PostsResponse> {
    const { limit = 50, offset = 0 } = params;
    const response = await instance2.get<PostsResponse>(
      `/posts?limit=${limit}&offset=${offset}`
    );
    return response.data;
  },

  /**
   * Get post by ID
   * GET /api/posts/:id
   * Response format: { post: Post }
   */
  async getPostById(id: number): Promise<Post> {
    const response = await instance2.get<{ post: Post }>(`/posts/${id}`);
    return response.data.post;
  },

  /**
   * Get posts by author
   * GET /api/posts/author/:authorId?limit=50&offset=0
   */
  async getPostsByAuthor(
    authorId: number,
    params: GetPostsParams = {}
  ): Promise<PostsResponse> {
    const { limit = 50, offset = 0 } = params;
    const response = await instance2.get<PostsResponse>(
      `/posts/author/${authorId}?limit=${limit}&offset=${offset}`
    );
    return response.data;
  },

  /**
   * Create a new post
   * POST /api/posts
   * Requires: Authorization header with JWT token
   * Response format: { post: Post }
   */
  async createPost(params: CreatePostParams): Promise<Post> {
    const response = await instance2.post<{ post: Post }>('/posts', params);
    return response.data.post;
  },

  /**
   * Update a post
   * PUT /api/posts/:id
   * Requires: Authorization header with JWT token, must be the author
   * Response format: { post: Post }
   */
  async updatePost(id: number, params: UpdatePostParams): Promise<Post> {
    const response = await instance2.put<{ post: Post }>(`/posts/${id}`, params);
    return response.data.post;
  },

  /**
   * Delete a post
   * DELETE /api/posts/:id
   * Requires: Authorization header with JWT token, must be the author
   */
  async deletePost(id: number): Promise<void> {
    await instance2.delete(`/posts/${id}`);
  },
};
