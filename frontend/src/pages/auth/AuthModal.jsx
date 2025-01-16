import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, User, ArrowRight, ArrowLeft } from 'react-feather';
import { Card, CardContent } from '../../components/ui/Card';
import { FormInput } from '../../components/ui/FormInput';
import { GRADIENT_TEXT, GRADIENT_BUTTON } from '../../constant/index';
import { useAuth } from '../../contexts/AuthContext';
import "../../App.css"


const AuthModal = ({ isOpen, onClose }) => {
    const { login, register, user, logout } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [registerStep, setRegisterStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        username: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isLogin && registerStep === 1) {

            // Validaasi kecocokan pw
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords tidak sesuai dengan konfirm password');
                return;
            }
            setRegisterStep(2);
            return;
        }
        try {
            if (isLogin) {
                await login({
                    email: formData.email,
                    password: formData.password
                });
                onClose();
            } else {
                await register({
                    name: formData.name,
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                    confPassword: formData.confirmPassword
                });
                setIsLogin(true);
                resetForm();
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred');
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleBack = () => {
        setRegisterStep(1);
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            name: '',
            username: '',
            confirmPassword: ''
        });
        setRegisterStep(1);
    };

    const handleModeSwitch = () => {
        setIsLogin(prev => !prev);
        resetForm();
    };

    if (!isOpen) return null;

    const PasswordToggle = ({ isConf = false }) => (
        <button
            type="button"
            onClick={() => isConf ? setShowConfPassword(prev => !prev) : setShowPassword(prev => !prev)}
            className="text-gray-500"
        >
            {(isConf ? showConfPassword : showPassword) ?
                <EyeOff className="h-5 w-5" /> :
                <Eye className="h-5 w-5" />
            }
        </button>
    );

    const renderProgressBar = () => (
        <div className="mb-8">
            <div className="relative pt-2">
                <div className="w-full bg-gray-700 rounded h-2 flex relative">
                    {/* Progress indicator */}
                    <div
                        className="bg-purple-600 h-2 rounded transition-all duration-300 ease-in-out absolute"
                        style={{ width: registerStep === 1 ? '0%' : '50%' }}
                    />
                    {/* Garis pemisah */}
                    <div className="absolute left-1/2 w-0.5 h-2 bg-gray-500/80 -ml-0.5" />
                </div>
            </div>
        </div>
    );

    const renderRegisterStep1 = () => (
        <>
            <FormInput
                label="Nama"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama kamu"
            />

            <FormInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Masukkan email kamu"
                icon={Mail}
            />

            <FormInput
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password kamu"
                icon={Lock}
                rightElement={<PasswordToggle />}
            />

            <FormInput
                label="Konfirmasi Password"
                type={showConfPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Konfirmasi password kamu"
                icon={Lock}
                rightElement={<PasswordToggle isConf={true} />}
            />
        </>
    );

    const renderRegisterStep2 = () => (
        <FormInput
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Masukkan username kamu"
            icon={User}
        />
    );
    
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <Card className="w-full max-w-md mx-4 relative z-50 bg-[#1A1A2E]/90 border border-purple-500/10 max-h-[90vh] overflow-y-auto">
                <CardContent className="p-6" style={{
                    maskImage: 'linear-gradient(to bottom, transparent, black 10px, black 90%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10px, black 90%, transparent)'
                }}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`text-2xl font-bold ${GRADIENT_TEXT}`}>
                            {user ? 'Account' : (isLogin ? 'Selamat Datang' : 'Buat Akun')}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                            {error}
                        </div>
                    )}

                    {user ? (
                        <div className="text-center">
                            <p className="text-gray-300 mb-4">Logged in as {user.email}</p>
                            <button
                                onClick={async () => {
                                    await logout();
                                    onClose();
                                }}
                                className={`px-6 py-3 rounded-xl font-medium ${GRADIENT_BUTTON}`}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            {!isLogin && renderProgressBar()}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {isLogin ? (
                                    <>
                                        <FormInput
                                            label="Email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan email kamu"
                                            icon={Mail}
                                        />

                                        <FormInput
                                            label="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan password kamu"
                                            icon={Lock}
                                            rightElement={<PasswordToggle />}
                                        />
                                    </>
                                ) : (
                                    registerStep === 1 ? renderRegisterStep1() : renderRegisterStep2()
                                )}

                                <div className="flex gap-3">
                                    {!isLogin && registerStep === 2 && (
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="flex-1 px-6 py-3 rounded-xl font-medium bg-gray-600 hover:bg-gray-500 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeft className="h-4 w-4" />
                                            Back
                                        </button>
                                    )}

                                    <button
                                        type="submit"
                                        className={`flex-1 px-6 py-3 rounded-xl font-medium ${GRADIENT_BUTTON} flex items-center justify-center gap-2`}
                                    >
                                        {isLogin ? 'Masuk' : registerStep === 1 ? (
                                            <>
                                                Next
                                                <ArrowRight className="h-4 w-4" />
                                            </>
                                        ) : 'Create Account'}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-gray-400">
                                    {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
                                    <button
                                        onClick={handleModeSwitch}
                                        className="ml-2 text-purple-400 hover:text-purple-300"
                                    >
                                        {isLogin ? 'Daftar' : 'Masuk'}
                                    </button>
                                </p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthModal;