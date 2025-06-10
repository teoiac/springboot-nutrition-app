import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  token: string;
  expiresIn: number;
}

export interface Category {
  id: string;
  name: string;
  postCount?: number;
}

export interface Tag {
  id: string;
  name: string;
  postCount?: number;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author?: {
    id: string;
    name: string;
  };
  category: Category;
  tags: Tag[];
  readingTime?: number;
  createdAt: string;
  updatedAt: string;
  status?: PostStatus;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  categoryId: string;
  tagIds: string[];
  status: PostStatus;
}

export interface UpdatePostRequest extends CreatePostRequest {
  id: string;
}

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}


export interface ApiError {
  status: number;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}


export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: '/api/v1',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response?.data) {
      return error.response.data as ApiError;
    }
    return {
      status: 500,
      message: 'An unexpected error occurred'
    };
  }

  public async getUserProfile(): Promise<UserProfile> {
    const response: AxiosResponse<UserProfile> = await this.api.get('/auth/profile');
    console.log('Profile response:', response.data); // Add this line
    return response.data;
  }
  // Auth endpoints
  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  }

  public logout(): void {
    localStorage.removeItem('token');
  }

  // Posts endpoints
  public async getPosts(params: {
    categoryId?: string;
    tagId?: string;
  }): Promise<Post[]> {
    const response: AxiosResponse<Post[]> = await this.api.get('/posts', { params });
    return response.data;
  }

  public async getPost(id: string): Promise<Post> {
    const response: AxiosResponse<Post> = await this.api.get(`/posts/${id}`);
    return response.data;
  }

  public async createPost(post: CreatePostRequest): Promise<Post> {
    const response: AxiosResponse<Post> = await this.api.post('/posts', post);
    return response.data;
  }

  public async sendContactMessage(contactRequest: ContactRequest): Promise<ContactResponse> {
    const response: AxiosResponse<ContactResponse> = await this.api.post('/contact', contactRequest);
    return response.data;
  }

  public async getContactMessages(): Promise<ContactResponse[]> {
    const response: AxiosResponse<ContactResponse[]> = await this.api.get('/contact');
    return response.data;
  }

  public async getUnreadMessages(): Promise<ContactResponse[]> {
    const response: AxiosResponse<ContactResponse[]> = await this.api.get('/contact/unread');
    return response.data;
  }

  public async countUnreadMessages(): Promise<number> {
    const response: AxiosResponse<number> = await this.api.get('/contact/unread/count');
    return response.data;
  }

  public async markMessageAsRead(id: string): Promise<ContactResponse> {
    const response: AxiosResponse<ContactResponse> = await this.api.patch(`/contact/${id}/read`);
    return response.data;
  }

  public async register(user: { name: string; email: string; password: string }) {
    const response = await this.api.post('/auth/register', {
      name: user.name,
      email: user.email,
      password: user.password
    });
    return response.data;
  }

  public async updatePost(id: string, post: UpdatePostRequest): Promise<Post> {
    const response: AxiosResponse<Post> = await this.api.put(`/posts/${id}`, post);
    return response.data;
  }

  public async deletePost(id: string): Promise<void> {
    await this.api.delete(`/posts/${id}`);
  }

  public async getDrafts(params: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<Post[]> {
    const response: AxiosResponse<Post[]> = await this.api.get('/posts/drafts', { params });
    return response.data;
  }

  // Categories endpoints
  public async getCategories(): Promise<Category[]> {
    const response: AxiosResponse<Category[]> = await this.api.get('/categories');
    return response.data;
  }

  public async createCategory(name: string): Promise<Category> {
    const response: AxiosResponse<Category> = await this.api.post('/categories', { name });
    return response.data;
  }

  public async updateCategory(id: string, name: string): Promise<Category> {
    const response: AxiosResponse<Category> = await this.api.put(`/categories/${id}`, { id, name });
    return response.data;
  }

  public async deleteCategory(id: string): Promise<void> {
    await this.api.delete(`/categories/${id}`);
  }

  // Tags endpoints
  public async getTags(): Promise<Tag[]> {
    const response: AxiosResponse<Tag[]> = await this.api.get('/tags');
    return response.data;
  }

  public async createTags(names: string[]): Promise<Tag[]> {
    const response: AxiosResponse<Tag[]> = await this.api.post('/tags', { names });
    return response.data;
  }

  public async deleteTag(id: string): Promise<void> {
    await this.api.delete(`/tags/${id}`);
  }


}

// Export a singleton instance
export const apiService = ApiService.getInstance();