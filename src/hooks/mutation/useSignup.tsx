import {AuthService} from "@/services";
import { useMutation } from "@tanstack/react-query";

interface SignupInput {
  email: string;
  username: string;
  display_name: string;
  password: string;
}

interface SignupResponse {
  token?: string;
  message?: string;
  ok: boolean;
}

const useSignup = () =>
  useMutation<SignupResponse, Error, SignupInput>({
    mutationFn: async (data: SignupInput) => {
      const res = await AuthService.signup(data.email, data.password, data.username, data.display_name);

      return {
        token: res.data.token,
        message: res.data.message,
        ok: res.ok,
      };
    },
  });
export default useSignup;