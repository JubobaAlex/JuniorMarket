'use client'

import { useState } from "react"
import '../style/LoginForm.css'
import handleLogin from "../model/handleLogin"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { setUser } from "../model/authSlice"
import handleMe from "../model/handleMe"
export default function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<null | string>(null);

    const dispatch = useDispatch();

    const onSubmit = async () => {
        setError(null);

        try {
            await handleLogin({
                email,
                password,
            });

            const user = await handleMe();

            dispatch(setUser(user));
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Произошла ошибка');
            }
        }
    };

    return (
        <div className="container-login">
            <div className="container-pre-login">

                <div className="container-text-login">
                    <h2>Вход</h2>
                </div>

                <div className="container-input-login">
                    <input
                        placeholder="Введите вашу почту"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <input
                        placeholder="Введите пароль"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <div className="login-continue-container">
                    <button
                        className="login-continue-button"
                        onClick={onSubmit}
                    >
                        Войти
                    </button>
                </div>

            </div>
        </div>
    );
}