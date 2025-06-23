interface Workspace {
    id: string;
    name: string;
    description?: string;
    ownerId: string;
    createdAt: string; 
    updatedAt: string; 
    members: Array<{
        userId: string;
    }>;
    isActive: boolean;
}

export default Workspace;