import {
  instance2,
  Post,
  PostsResponseData,
  ApiResponse,
  ResultCodeEnum,
} from 'src/api/api';

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
   * Response: { resultCode: 0, messages: [], data: { posts: [...], total?: number } }
   */
  async getPosts(params: GetPostsParams = {}): Promise<PostsResponseData> {
    const { limit = 50, offset = 0 } = params;
    const response = await instance2.get<ApiResponse<PostsResponseData>>(
      `/posts?limit=${limit}&offset=${offset}`
    );
    if (response.data.resultCode !== ResultCodeEnum.Success) {
      throw new Error(response.data.messages[0] || 'Failed to get posts');
    }
    return response.data.data;
  },

  /**
   * Get post by ID
   * GET /api/posts/:id
   * Response: { resultCode: 0, messages: [], data: { post: Post } }
   */
  async getPostById(id: number): Promise<Post> {
    const response = await instance2.get<ApiResponse<{ post: Post }>>(`/posts/${id}`);
    if (response.data.resultCode !== ResultCodeEnum.Success) {
      throw new Error(response.data.messages[0] || 'Failed to get post');
    }
    return response.data.data.post;
  },

  /**
   * Get posts by author
   * GET /api/posts/author/:authorId?limit=50&offset=0
   * Response: { resultCode: 0, messages: [], data: { posts: [...], total?: number } }
   */
  async getPostsByAuthor(
    authorId: number,
    params: GetPostsParams = {}
  ): Promise<PostsResponseData> {
    const { limit = 50, offset = 0 } = params;
    const response = await instance2.get<ApiResponse<PostsResponseData>>(
      `/posts/author/${authorId}?limit=${limit}&offset=${offset}`
    );
    if (response.data.resultCode !== ResultCodeEnum.Success) {
      throw new Error(response.data.messages[0] || 'Failed to get posts');
    }
    return response.data.data;
  },

  /**
   * Create a new post
   * POST /api/posts
   * Requires: Authorization header with JWT token
   * Response: { resultCode: 0, messages: [], data: { post: Post } }
   */
  async createPost(params: CreatePostParams): Promise<Post> {
    const response = await instance2.post<ApiResponse<{ post: Post }>>('/posts', params);
    if (response.data.resultCode !== ResultCodeEnum.Success) {
      throw new Error(response.data.messages[0] || 'Failed to create post');
    }
    return response.data.data.post;
  },

  /**
   * Update a post
   * PUT /api/posts/:id
   * Requires: Authorization header with JWT token, must be the author
   * Response: { resultCode: 0, messages: [], data: { post: Post } }
   */
  async updatePost(id: number, params: UpdatePostParams): Promise<Post> {
    const response = await instance2.put<ApiResponse<{ post: Post }>>(
      `/posts/${id}`,
      params
    );
    if (response.data.resultCode !== ResultCodeEnum.Success) {
      throw new Error(response.data.messages[0] || 'Failed to update post');
    }
    return response.data.data.post;
  },

  /**
   * Delete a post
   * DELETE /api/posts/:id
   * Requires: Authorization header with JWT token, must be the author
   * Response: { resultCode: 0, messages: [], data: {} }
   */
  async deletePost(id: number): Promise<void> {
    const response = await instance2.delete<ApiResponse<Record<string, never>>>(
      `/posts/${id}`
    );
    if (response.data.resultCode !== ResultCodeEnum.Success) {
      throw new Error(response.data.messages[0] || 'Failed to delete post');
    }
  },
};
