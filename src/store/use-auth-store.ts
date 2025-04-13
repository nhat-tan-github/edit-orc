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
      console.log('Đang gửi yêu cầu đăng nhập với:', credentials);
      
      const apiUrl = 'http://localhost:8000/api/v1/auth/login';
      console.log('API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // Giữ lại option này để gửi cookies nếu cần
      });

      console.log('Status code:', response.status);
      console.log('Response headers:', Object.fromEntries([...response.headers]));
      
      if (response.ok) {
        // Sử dụng json() thay vì text() vì API trả về chuỗi JSON
        const tokenString = await response.json();
        console.log('Response data (token):', tokenString);

        // Kiểm tra nếu có token và là JWT hợp lệ
        if (tokenString && typeof tokenString === 'string' && tokenString.startsWith('eyJ')) {
          console.log('Đăng nhập thành công, lưu token');
          localStorage.setItem('access_token', tokenString);
          localStorage.setItem('username', credentials.username);
          
          set({ 
            accessToken: tokenString,
            isAuthenticated: true,
            username: credentials.username,
            user: { id: '1', email: credentials.username, avatar: '', username: credentials.username, provider: 'github' }
          });

          console.log('Chuyển hướng sau đăng nhập thành công');
          window.location.href = '/';
          
          return { access_token: tokenString };
        } else {
          console.error('Token không hợp lệ:', tokenString);
          return { error: 'Token không hợp lệ' };
        }
      } else {
        const errorText = await response.text();
        console.error('Đăng nhập thất bại:', errorText);
        return { error: errorText || 'Đăng nhập thất bại' };
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
  
  signinWithMagicLink: async ({ email }: { email: string }) => {
    // Giữ phương thức này để tương thích với mã nguồn cũ
    alert('Chức năng đăng nhập qua Magic Link hiện không khả dụng');
    return {};
  },

  // Đăng xuất
  signOut: async () => {
    try {
      const token = get().accessToken;
      console.log('Đang thực hiện đăng xuất');
      
      if (token) {
        // Gọi API đăng xuất
        console.log('Gửi yêu cầu đăng xuất đến server');
        await fetch('http://localhost:8000/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Xóa token và username, reset trạng thái đăng nhập
      console.log('Xóa thông tin đăng nhập khỏi localStorage');
      localStorage.removeItem('access_token');
      localStorage.removeItem('username');
      set({ user: null, isAuthenticated: false, accessToken: null, username: null });
      // Reload trang sau khi đăng xuất
      console.log('Chuyển hướng sau đăng xuất');
      window.location.href = '/';
    }
  },
}));

export default useAuthStore;