import { User } from "@/interfaces/editor";
import { create } from "zustand";

// Thêm interface cho credentials đăng nhập
interface LoginCredentials {
  username: string;
  password: string;
}

// Thêm interface cho response của API 
interface AuthResponse {
  access_token?: string;
  token_type?: string;
  error?: string;
}

interface AuthStore {
  user: User | null;
  username: string | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signinWithMagicLink: ({ email }: { email: string }) => Promise<any>;
  signinWithGithub: () => Promise<any>;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  username: localStorage.getItem('username'),
  accessToken: localStorage.getItem('access_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  setUser: (user) => set({ user }),

  // Đăng nhập với API của bạn
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // Lưu token và username vào localStorage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('username', credentials.username);
        
        // Cập nhật state trong store
        set({ 
          accessToken: data.access_token,
          isAuthenticated: true,
          username: credentials.username,
          // Tạm thời đặt user với username từ credentials
          user: { id: '1', email: credentials.username, avatar: '' }
        });

        // Chuyển hướng tới trang chính sau khi đăng nhập thành công
        window.location.href = '/';
        
        return data;
      } else {
        return { error: data.detail || 'Đăng nhập thất bại' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Không thể kết nối đến server' };
    }
  },

  signinWithGithub: async () => {
    // Giữ phương thức này để tương thích với mã nguồn cũ
    alert('Chức năng đăng nhập qua Github hiện không khả dụng');
    return {};
  },
  
  signinWithMagicLink: async () => {
    // Giữ phương thức này để tương thích với mã nguồn cũ
    alert('Chức năng đăng nhập qua Magic Link hiện không khả dụng');
    return {};
  },

  // Đăng xuất
  signOut: async () => {
    try {
      const token = get().accessToken;
      
      if (token) {
        // Gọi API đăng xuất
        await fetch('http://localhost:8000/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Xóa token và username, reset trạng thái đăng nhập
      localStorage.removeItem('access_token');
      localStorage.removeItem('username');
      set({ user: null, isAuthenticated: false, accessToken: null, username: null });
      // Reload trang sau khi đăng xuất
      window.location.href = '/';
    }
  },
}));

export default useAuthStore;
