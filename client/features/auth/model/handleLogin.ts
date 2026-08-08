import { authData } from "../types/authData";
async function handleLogin(data:Pick<authData , 'email' | 'password'>) {
    try {
        console.log(process.env.NEXT_PUBLIC_API_URL);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
                {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
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