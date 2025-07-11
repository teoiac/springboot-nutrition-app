import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bckimage from '../../public/login-back.jpeg'

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Password validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Password strength validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters long and contain letters, numbers, and special characters');
            return;
        }

        setIsLoading(true);

        try {
            navigate('/login', { state: { registrationSuccess: true } });
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to register. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* Background with overlay */}
            <div className="fixed inset-0 -z-10">
                <img
                    src={bckimage}
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            </div>

            {/* Centered registration form */}
            <div className="py-5 flex items-center justify-center p-3">
                <div className="w-full max-w-md">
                    <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Bine ați venit!</h2>
                            <p className="mt-2 text-gray-600">Vă rugăm să vă înregistrați mai jos!</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-4 bg-red-50 rounded-lg">
                                    <p className="text-red-600 text-sm font-medium">{error}</p>
                                </div>
                            )}

                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nume complet
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                                    placeholder="Nume și Prenume"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Adresă de email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                                    placeholder="nume@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Parolă
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />

                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmați parola
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-[#78a461] to-[#74a05d] hover:from-[#5d814b] hover:to-[#5d814b] text-white font-medium rounded-lg shadow-md transition duration-200 flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Vă rugăm așteptați!
                                        </>
                                    ) : 'Înregistrează-te'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Aveți deja cont?{' '}
                                <a href="/login" className="text-[#384e2d] hover:text-[#384e2d] font-medium">
                                    Autentificați-vă
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;