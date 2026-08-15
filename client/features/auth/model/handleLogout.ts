async function handleLogout(): Promise<void> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
            method: 'POST',
            credentials: 'include',
        },
    );

    if (!response.ok) {
        const error = await response.json();

        throw new Error(
            error.message || 'Ошибка выхода из аккаунта',
        );
    }
}

export default handleLogout;