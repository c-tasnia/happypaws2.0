import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { showToast } = useOutletContext();
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            showToast("Successfully logged in!");
            navigate('/');
        } catch (err) {
            showToast("Failed to log in. Please check your credentials.", true);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-center mb-6" style={{ color: '#1a6b5c' }}>Welcome Back!</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label text-sm font-semibold">Email</label>
                        <input
                            type="email"
                            className="input input-bordered w-full focus:outline-teal-600"
                            placeholder="hello@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label text-sm font-semibold">Password</label>
                        <input
                            type="password"
                            className="input input-bordered w-full focus:outline-teal-600"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn w-full mt-4 text-white border-none" style={{ background: '#1a6b5c' }}>
                        Login
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-600">
                    New to Happy Paws? <Link to="/register" className="font-bold hover:underline" style={{ color: '#1a6b5c' }}>Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;