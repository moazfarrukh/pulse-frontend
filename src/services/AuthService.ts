import axiosClient from "@/clients/axios";
import { isAxiosError } from "axios";

const AuthService = {
  async login(email: string, password: string) {
    try {
      const response = await axiosClient.post(`/auth/login`, {
        email,
        password,
      });
      return {
        data: response.data,
        ok: true,
      };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || "Login failed";
        return {
          data: {
            message,
            ok: false,
          },
          ok: false,
        };
      }
      return {
        data: {
          message: "Something went wrong",
          ok: false,
        },
        ok: false,
      };
    }
  },

  async signup(
    email: string,
    password: string,
    username: string,
    display_name: string
  ) {
    try {
      const response = await axiosClient.post(`/auth/signup`, {
        email,
        password,
        username,
        display_name,
      });
      return {
        data: response.data,
        ok: true,
      };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || "Signup failed";
        return {
          data: {
            message,
            ok: false,
          },
          ok: false,
        };
      }
      return {
        data: {
          message: "Something went wrong",
          ok: false,
        },
        ok: false,
      };
    }
  },
  async getMe() {
    try {
      const response = await axiosClient.get(`/auth/me`, {
        withCredentials: true
      });
      return {
        data: response.data,
        ok: true,
      };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to fetch user data";
        return {
          data: {
            message,
            ok: false,
          },
          ok: false,
        };
      }
      return {
        data: {
          message: "Something went wrong",
          ok: false,
        },
        ok: false,
      };
    }
  }
};



export default AuthService;