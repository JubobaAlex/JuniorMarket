'use client'

import { useState } from "react"
import '../style/RegisterForm.css'
import handleRegister from "../model/handleRegister"

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'BUYER' | 'SELLER'>('BUYER');
    
    const onSubmit = async () => {
        try {
            const data = await handleRegister({
                email,
                password,
                role,
            });
            console.log(data);
        } catch (err) {
            console.error(err);
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
                        type="text" 
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