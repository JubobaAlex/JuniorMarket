'use client'

import { useState } from "react"
import '../style/LoginForm.css'
import handleLogin from "../model/handleLogin"
import { useDispatch } from "react-redux"
import { setJwt } from "../model/authSlice"

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<null | string>(null);

    const dispatch = useDispatch();

    const onSubmit = async () => {
        setError(null);

        try {
            const loginData = await handleLogin({
                email,
                password,
            });

            if (process.env.NODE_ENV === 'development') {
                console.log('Авторизация:', loginData);
                console.log('JWT токен:', loginData.access_token);
            }

            dispatch(setJwt(loginData.access_token));

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