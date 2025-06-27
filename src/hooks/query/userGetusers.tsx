import { UserService } from "@/services";
import {  User } from "@/types";
import { useQuery } from "@tanstack/react-query";


const useGetUsers = () => {
    return useQuery<User[], Error>({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await UserService.getUsers();
            if (!res.ok) {
                throw new Error(res.data?.message || "Failed to fetch users");
            }
            return res.data;
        },
    });
};

export default useGetUsers;