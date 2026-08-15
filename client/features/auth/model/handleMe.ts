import { authData } from "../types/authData";
async function handleMe(): Promise<authData> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
            credentials: 'include',
        },
    );

    if (!response.ok) {
        throw new Error('Пользователь не авторизован');
    }

    return response.json();
}
export default handleMe;