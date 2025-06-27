import {UserService} from "@/services";
import { useMutation, useQueryClient} from "@tanstack/react-query";

interface EditUserInput {
  email: string;
  display_name: string;
  username: string;
  password?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  avatarFile?: File | null; // Add support for File object
}

interface EditUserResponse {
  message?: string;
  ok: boolean;
  avatar_url?: string; // Return new avatar URL if uploaded
}

const useEditUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<EditUserResponse, Error, EditUserInput>({
    mutationFn: async (data: EditUserInput) => {
        const formData = new FormData();
        
        if (data.avatarFile) {
          formData.append('image', data.avatarFile);
        }
        
        formData.append('email', data.email);
        formData.append('display_name', data.display_name);
        formData.append('username', data.username);
          
        if (data.phone) formData.append('phone', data.phone);
        if (data.bio) formData.append('bio', data.bio);

        const res = await UserService.updateUserWithFile(formData);

        return {
          message: res.data.message,
          ok: res.ok,
          avatar_url: res.data.avatar_url,
        };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
};

export default useEditUser;
