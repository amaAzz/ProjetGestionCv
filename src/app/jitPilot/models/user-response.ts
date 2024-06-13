export interface UserResponse {
    userId: number;
    firstName: string;
    lastName: string;
    path?: string | null;
    email: string;
    role: string;
    createdAt: Date;
}
