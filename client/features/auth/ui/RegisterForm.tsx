'use client'

import { useState } from "react"
import '../style/RegisterForm.css'
import handleRegister from "../model/handleRegister"
import handleLogin from "../model/handleLogin"
export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER');
    const [error, setError] = useState<null | string>(null)
    
    const onSubmit = async () => {
        setError(null)
        try {
            const data = await handleRegister({
                email,
                password,
                role,
            });

            const loginData = await handleLogin({
                email,
                password
            });

            if (process.env.NODE_ENV === 'development') {
                console.log('Регистрация:', data);
                console.log('Авторизация:', loginData);
                console.log('JWT токен:', loginData.access_token);
            }
        } catch (err) {
            if(err instanceof Error) {
                setError(err.message)
            } else {
                setError('Произлошла ошибка')
            }
        }
    };

    return (
        <div className="container-register">
            <div className="container-pre">
                <div className="container-text-register">
                    <h2>Регистрация</h2>
                </div>
                
                <div className="container-input-register">
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

                <div className="container-button-register">
                    <div style={{display:'flex', justifyContent:'center'}}>
                        <h2>Выберите кто вы</h2>
                    </div>
                    <div className="role-buttons-container">
                        <button 
                            className={`role-button ${role === 'BUYER' ? 'BUYER' : ''}`} 
                            onClick={() => setRole('BUYER')}
                        >
                            Покупатель
                        </button>
                        <button 
                            className={`role-button ${role === 'SELLER' ? 'SELLER' : ''}`} 
                            onClick={() => setRole('SELLER')}
                        >
                            Продавец
                        </button>
                    </div>
                </div>

                <div className="continue-container">
                    <button className="continue-button" onClick={onSubmit}>
                        Продолжить
                    </button>
                </div>
            </div>
        </div>
    )
}