import { instance, Post, PostsResponse } from 'src/api/api';

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
    const response = await instance.get<PostsResponse>(
      `/posts?limit=${limit}&offset=${offset}`
    );
    return response.data;
  },

  /**
   * Get post by ID
   * GET /api/posts/:id
   */
  async getPostById(id: number): Promise<Post> {
    const response = await instance.get<Post>(`/posts/${id}`);
    return response.data;
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
    const response = await instance.get<PostsResponse>(
      `/posts/author/${authorId}?limit=${limit}&offset=${offset}`
    );
    return response.data;
  },

  /**
   * Create a new post
   * POST /api/posts
   * Requires: Authorization header with JWT token
   */
  async createPost(params: CreatePostParams): Promise<Post> {
    const response = await instance.post<Post>('/posts', params);
    return response.data;
  },

  /**
   * Update a post
   * PUT /api/posts/:id
   * Requires: Authorization header with JWT token, must be the author
   */
  async updatePost(id: number, params: UpdatePostParams): Promise<Post> {
    const response = await instance.put<Post>(`/posts/${id}`, params);
    return response.data;
  },

  /**
   * Delete a post
   * DELETE /api/posts/:id
   * Requires: Authorization header with JWT token, must be the author
   */
  async deletePost(id: number): Promise<void> {
    await instance.delete(`/posts/${id}`);
  },
};
