import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api';
import { setToken } from '../../utils/storage';

const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await registerUser({ username, password });
            setToken(response.token);
            navigate('/tasks');
        } catch (err) {
            setError('Erro ao cadastrar. Tente novamente.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Cadastro</h2>
            {error && <p className="error">{error}</p>}
            <div>
                <label htmlFor="username">Usuário:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Senha:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Cadastrar</button>
        </form>
    );
};

export default RegisterForm;