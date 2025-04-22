

export interface UserLogin {
    username: string
    password: string
}

export interface User {
    username: string,
    email: string,
    fullName: string,
    role: string
}

export interface LoginRes {
    success: boolean,
    message: string,
    token: string,
    user: User
}
