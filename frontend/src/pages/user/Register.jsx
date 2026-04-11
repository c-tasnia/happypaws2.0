import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const { showToast } = useOutletContext();
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(email, password);
            showToast(`Hello, ${name}! Welcome to Happy Paws 🐾`);
            navigate('/');
        } catch (err) {
            showToast("Failed to create account.", true);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-10">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#1a6b5c' }}>Join Happy Paws</h2>
                <p className="text-center text-gray-500 mb-6 text-sm italic">Help us find every paw a home.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="form-control">
                        <label className="label text-sm font-semibold">Your Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="input input-bordered w-full focus:outline-teal-600"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label text-sm font-semibold">Email Address</label>
                        <input
                            type="email"
                            placeholder="hello@example.com"
                            className="input input-bordered w-full focus:outline-teal-600"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label className="label text-sm font-semibold">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="input input-bordered w-full focus:outline-teal-600"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn w-full mt-4 text-white border-none" style={{ background: '#1a6b5c' }}>
                        Register now!
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="font-bold hover:underline" style={{ color: '#1a6b5c' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;