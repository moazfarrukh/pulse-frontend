import {AuthService} from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  message?: string;
  ok: boolean;
}

const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: async (data: LoginInput) => {
      const res = await AuthService.login(data.email, data.password);

      return {
        message: res.data.message || 'Login successful',
        ok: res.ok,
      };
    },
    onSuccess: () => {
      // Invalidate the "me" query key to refetch user data after login
      queryClient.invalidateQueries({ queryKey: ["me"] });

    },
  });
};
  export default useLogin;