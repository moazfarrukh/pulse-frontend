import {AuthService} from "@/services";
import { useMutation } from "@tanstack/react-query";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  message?: string;
  ok: boolean;
}

 const useLogin = () =>
  useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: async (data: LoginInput) => {
      const res = await AuthService.login(data.email, data.password);

      return {
        message: res.data.message || 'Login successful',
        ok: res.ok,
      };
    },
  });
  export default useLogin;