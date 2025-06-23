import {AuthService} from "@/services";
import { useMutation } from "@tanstack/react-query";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  token?: string;
  message?: string;
  ok: boolean;
}

 const useLogin = () =>
  useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: async (data: LoginInput) => {
      const res = await AuthService.login(data.email, data.password);
      
      return {
        token: res.data.token,
        message: res.data.message,
        ok: res.ok,
      };
    },
  });
  export default useLogin;