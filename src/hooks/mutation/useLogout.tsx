import {AuthService} from "@/services";
import  { useUserStore } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";


interface LogoutResponse {
  message?: string;
  ok: boolean;
}

const useLogout = () => {
  const queryClient = useQueryClient();
  const { removeCurrentUser } = useUserStore();
  return useMutation<LogoutResponse, Error>({
    mutationFn: async () => {
      const res = await AuthService.logout();

      return {
        message: res.data.message || 'Logout successful',
        ok: res.ok,
      };
    },
    onSuccess: () => {
      // Invalidate the "me" query key to refetch user data after logout
      queryClient.invalidateQueries({ queryKey: ["me"] });
      removeCurrentUser(); // Clear the current user from the store
    // Navigate to the home/root page after logout
    window.location.href = '/';
    },
  });
};
  export default useLogout;