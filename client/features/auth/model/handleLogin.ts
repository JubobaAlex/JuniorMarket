import { authData } from "../types/authData";
async function handleLogin(data:Pick<authData , 'email' | 'password'>) {
    try {
        const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(data),
                },
            );
            if(!response.ok) {
                 const error = await response.json();
                    console.log(error);
                    throw new Error(JSON.stringify(error));
            }
            return await response.json()
    }

    catch(errors) {
        console.log(errors)
        throw errors;
    }
}
export default handleLogin;