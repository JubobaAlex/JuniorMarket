import { authData } from "../types/authData";

async function handleRegister(data: authData) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data),
        },
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(JSON.stringify(error));
    }

    return response.json();
}

export default handleRegister;