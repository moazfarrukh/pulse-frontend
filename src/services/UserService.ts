import axiosClient from "@/clients/axios";
import { isAxiosError } from "axios";

const UserService = {
    async getUsers() {
        try {
            const response = await axiosClient.get(`/users`);
            return {
                data: response.data,
                ok: true,
            };
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const message = error.response?.data?.message || "Failed to fetch users";
                return {
                    data: { message, ok: false },
                    ok: false,
                };
            }
            return {
                data: { message: "Something went wrong", ok: false },
                ok: false,
            };
        }
    },
    

    async updateUserWithFile(formData: FormData) {
        try {
            const response = await axiosClient.put(`/users`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return {
                data: response.data,
                ok: true,
            };
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const message = error.response?.data?.message || "Failed to update user";
                return {
                    data: { message, ok: false },
                    ok: false,
                };
            }
            return {
                data: { message: "Something went wrong", ok: false },
                ok: false,
            };
        }
    },

    async uploadAvatar(formData: FormData) {
        try {
            const response = await axiosClient.post(`/users/upload-avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return {
                data: response.data,
                ok: true,
            };
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const message = error.response?.data?.message || "Failed to upload avatar";
                return {
                    data: { message, ok: false },
                    ok: false,
                };
            }
            return {
                data: { message: "Something went wrong", ok: false },
                ok: false,
            };
        }
    },
};

export default UserService;