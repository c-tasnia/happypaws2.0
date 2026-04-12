import { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const context = useOutletContext();
  const showToast = context?.showToast;
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      if (showToast) showToast('Welcome back! 🐾');
      navigate('/');
    } catch (err) {
      if (showToast) showToast('Invalid email or password.', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10 font-serif">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-lg p-8">

       
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center text-2xl mb-3">
            🐾
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-400 mt-1">Sign in to your Happy Paws account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-white text-sm font-semibold tracking-wide transition"
            style={{ background: loading ? '#a0c4bb' : '#1a6b5c', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">New to Happy Paws?</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Register */}
        <Link
          to="/register"
          className="block text-center py-2.5 rounded-lg border text-sm font-semibold hover:bg-teal-50 transition"
          style={{ borderColor: '#1a6b5c', color: '#1a6b5c' }}
        >
          Create an Account
        </Link>

        {/* Back home */}
        <p className="text-center mt-4 text-xs text-gray-400">
          <Link to="/" className="hover:underline">← Back to Home</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;