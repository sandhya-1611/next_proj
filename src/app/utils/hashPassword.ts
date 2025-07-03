export const hashPassword = (password: string): string => {
    return btoa(password) // Using base64 encoding just for demo
}
