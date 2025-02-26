import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Mail, Lock, Eye, EyeOff, User, ArrowRight, ArrowLeft } from 'react-feather';
import { Card, CardContent } from '../../components/ui/user/Card';
import { FormInput } from '../../components/ui/user/FormInput';
import { GRADIENT_TEXT, GRADIENT_BUTTON } from '../../constant/index';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { debounce } from 'lodash';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, user, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [registerStep, setRegisterStep] = useState(1);
  const [showPasswords, setShowPasswords] = useState({ password: false, confirm: false });
  const [error, setError] = useState('');
  const [validationState, setValidationState] = useState({});
  const [isValidating, setIsValidating] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    username: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (error) setError('');
  }, [formData]);

  const validate = useCallback(async (field, value, validationFn) => {
    if (!value?.trim()) {
      setValidationState(prev => ({ ...prev, [field]: { isValid: true, message: '' } }));
      return;
    }

    setIsValidating(prev => ({ ...prev, [field]: true }));
    try {
      const result = await validationFn(value);
      setValidationState(prev => ({
        ...prev,
        [field]: {
          isValid: result.available,
          message: result.available ? '' : `${field === 'email' ? 'Email' : 'Username'} sudah digunakan`
        }
      }));
    } catch (error) {
      setValidationState(prev => ({
        ...prev,
        [field]: {
          isValid: false,
          message: `Gagal memvalidasi ${field}`
        }
      }));
    } finally {
      setIsValidating(prev => ({ ...prev, [field]: false }));
    }
  }, []);

  const debouncedValidate = useMemo(() => ({
    email: debounce(value => validate('email', value, authService.checkEmailAvailability), 500),
    username: debounce(value => validate('username', value, authService.checkUsernameAvailability), 500)
  }), [validate]);

  const isFormValid = useMemo(() => {
    if (isLogin) {
      return formData.email && formData.password;
    }

    if (registerStep === 1) {
      return formData.email && formData.password && formData.confirmPassword &&
        formData.name && formData.password === formData.confirmPassword &&
        (!validationState.email || validationState.email.isValid);
    }

    return formData.username && formData.username.trim().length >= 3 &&
        (!validationState.username || validationState.username.isValid);
  }, [formData, validationState, registerStep, isLogin]);

  const handleInputChange = useCallback(({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'email' || name === 'username') {
      debouncedValidate[name](value);
    }
  }, [debouncedValidate]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      if (isLogin) {
        const credentials = {
          email: formData.email.trim(),
          password: formData.password
        };

        await login(credentials);
        onClose();
      } else {
        if (registerStep === 1) {
          if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            throw new Error("Semua field harus diisi");
          }
          if (formData.password !== formData.confirmPassword) {
            throw new Error("Password dan konfirmasi password tidak sesuai");
          }
          setRegisterStep(2);
        } else {
          const registerData = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            username: formData.username.trim(),
            password: formData.password,
            confPassword: formData.confirmPassword
          };

          await register(registerData);
          await login({
            email: formData.email.trim(),
            password: formData.password
          });
          onClose();
          resetForm();
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Terjadi kesalahan saat autentikasi');
    } finally {
      setIsSubmitting(false);
    }
  }, [isFormValid, isSubmitting, isLogin, formData, registerStep, login, register, onClose, resetForm]);

  const resetForm = useCallback(() => {
    setFormData({ email: '', password: '', name: '', username: '', confirmPassword: '' });
    setRegisterStep(1);
    setError('');
    setValidationState({});
    setIsSubmitting(false);
  }, []);

  const handleModeSwitch = useCallback(() => {
    setIsLogin(prev => !prev);
    resetForm();
  }, [resetForm]);

  const PasswordToggle = ({ field }) => (
    <button
      type="button"
      onClick={() => setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))}
      className="text-gray-500 hover:text-gray-400"
    >
      {showPasswords[field] ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  );

  if (!isOpen) return null;

  const buttonStyle = `px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 
  ${isFormValid && !isSubmitting ? GRADIENT_BUTTON : 'bg-gray-600 opacity-50 cursor-not-allowed'}`;

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="relative pt-2">
        <div className="w-full bg-gray-700 rounded h-2 flex relative">
          <div
            className="bg-purple-600 h-2 rounded transition-all duration-300 ease-in-out absolute"
            style={{ width: registerStep === 1 ? '0%' : '50%' }}
          />
          <div className="absolute left-1/2 w-0.5 h-2 bg-gray-500/80 -ml-0.5" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <Card className="w-full max-w-md mx-4 relative z-50 bg-[#1A1A2E]/90 border border-purple-500/10">
        <CardContent className="p-6">
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
                className={GRADIENT_BUTTON}
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
                      disabled={isSubmitting}
                    />
                    <FormInput
                      label="Password"
                      type={showPasswords.password ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Masukkan password kamu"
                      icon={Lock}
                      rightElement={<PasswordToggle field="password" />}
                      disabled={isSubmitting}
                    />
                  </>
                ) : registerStep === 1 ? (
                  <>
                    <FormInput
                      label="Nama"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama kamu"
                      disabled={isSubmitting}
                    />
                    <FormInput
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Masukkan email kamu"
                      icon={Mail}
                      error={formData.email && !validationState.email?.isValid}
                      helperText={formData.email && validationState.email?.message}
                      rightElement={isValidating.email && (
                        <span className="loading loading-spinner loading-sm" />
                      )}
                      disabled={isSubmitting}
                    />
                    <FormInput
                      label="Password"
                      type={showPasswords.password ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Masukkan password kamu"
                      icon={Lock}
                      rightElement={<PasswordToggle field="password" />}
                      disabled={isSubmitting}
                    />
                    <FormInput
                      label="Konfirmasi Password"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Konfirmasi password kamu"
                      icon={Lock}
                      rightElement={<PasswordToggle field="confirm" />}
                      disabled={isSubmitting}
                    />
                  </>
                ) : (
                  <FormInput
                    label="Username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Masukkan username kamu"
                    icon={User}
                    error={formData.username && !validationState.username?.isValid}
                    helperText={formData.username && validationState.username?.message}
                    rightElement={isValidating.username && (
                      <span className="loading loading-spinner loading-sm" />
                    )}
                    disabled={isSubmitting}
                  />
                )}

                <div className="flex gap-3">
                  {!isLogin && registerStep === 2 && (
                    <button
                      type="button"
                      onClick={() => setRegisterStep(1)}
                      className="flex-1 px-6 py-3 rounded-xl font-medium bg-gray-600 hover:bg-gray-500 transition-colors flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>
                  )}

                  <button
                    type="submit"
                    className={buttonStyle}
                    disabled={!isFormValid || isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : isLogin ? (
                      'Masuk'
                    ) : registerStep === 1 ? (
                      <>
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      'Create Account'
                    )}
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