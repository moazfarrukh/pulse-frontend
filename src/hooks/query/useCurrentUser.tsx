import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services";

interface User {
    id: string;
    email: string;
    username: string;
    display_name: string;
    avatar_url: string;
    bio: string;
    phone: string;
    created_at: string;
}

const useCurrentUser = () => {
    return useQuery<User, Error>({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await AuthService.getMe();
            
            if (!res.ok) {
                throw new Error(res.data?.message || "Failed to fetch user data");
            }
            
            return res.data;
        },
    });
};

export default useCurrentUser;