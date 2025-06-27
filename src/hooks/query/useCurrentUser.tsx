import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services";
import { useUserStore } from "@/store";

interface User {
    id: number;
    email: string;
    username: string;
    display_name: string;
    avatar_url: string;
    bio: string;
    phone: string;
    created_at: string;
}
const useCurrentUser = () => {
    const { setCurrentUser } = useUserStore();
    
    return useQuery<User, Error>({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await AuthService.getMe();
            
            if (!res.ok) {
                throw new Error(res.data?.message || "Failed to fetch user data");
            }
            
            const data = res.data;
            setCurrentUser(data);
            return data;
        }
    });
};

export default useCurrentUser;