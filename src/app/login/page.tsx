'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ArrowRight, Sparkles, Lock, CheckCircle2, Users } from 'lucide-react';
import { apiRequest } from '@/src/utils/apiRequest.util';
import AuthInput from '@/src/components/AuthInput';
import PrimaryButton from '@/src/components/PrimaryButton';
import TertiaryButton from '@/src/components/TertiaryButton';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPartnerRegistration = searchParams.get('partnerRegistration') === 'true';
  
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Handle OTP countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle resend countdown
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await apiRequest.post('/v1/authentication/send-otp', { email });

      if (data.success) {
        setSuccess('Check your email! Your code is on the way 📬');
        setStep('otp');
        setCountdown(600); // 10 minutes
        setResendCountdown(120); // 2 minutes
        setTimeout(() => {
          document.getElementById('otp-0')?.focus();
        }, 100);
      } else {
        setError(data.message || 'Something went wrong. Try again!');
      }
    } catch (err) {
      setError('Network error. Check your connection!');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCountdown > 0) {
      setError(`Please wait ${resendCountdown} seconds before requesting a new code`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await apiRequest.post('/v1/authentication/send-otp', { email });

      if (data.success) {
        setSuccess('New code sent! Check your inbox 📬');
        setCountdown(600);
        setResendCountdown(120); // 2 minutes
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      } else {
        setError(data.message || 'Failed to resend code');
      }
    } catch (err) {
      setError('Network error. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    // Auto-submit when all filled
    if (index === 5 && value && newOtp.every(digit => digit)) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleOTPPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted data is exactly 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      // Focus last input
      document.getElementById('otp-5')?.focus();
      // Auto-submit
      handleVerifyOTP(pastedData);
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async (otpValue?: string) => {
    const otpCode = otpValue || otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await apiRequest.post<{ user: any; redirectUrl: string; token: string }>('/v1/authentication/verify-otp', { email, otp: otpCode });

      if (data.success) {
        setSuccess('Welcome to Mumbies! 🎉');
        
        // Store token in memory for API requests
        if (data.data?.token) {
          apiRequest.setToken(data.data.token);
        }
        
        // Add slight delay before redirect
        setTimeout(() => {
          if (isPartnerRegistration) {
            router.push('/partner-application');
          } else {
            router.push(data.data?.redirectUrl || '/dashboard/account');
          }
        }, 500);
      } else {
        setError(data.message || 'Invalid code. Try again!');
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
        setLoading(false);
      }
    } catch (err) {
      setError('Network error. Try again!');
      setOtp(['', '', '', '', '', '']);
      setLoading(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg ${
            isPartnerRegistration 
              ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-purple-500/30'
              : 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30'
          }`}>
            {isPartnerRegistration ? (
              <Users className="w-8 h-8 text-white" />
            ) : (
              <Sparkles className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className={`text-4xl font-bold bg-clip-text text-transparent mb-2 ${
            isPartnerRegistration
              ? 'bg-gradient-to-r from-purple-600 to-pink-600'
              : 'bg-gradient-to-r from-green-600 to-emerald-600'
          }`}>
            {isPartnerRegistration ? 'Become a Partner' : 'Welcome to Mumbies'}
          </h1>
          <p className="text-gray-600 text-lg">
            {step === 'email' 
              ? (isPartnerRegistration ? 'Sign in to apply for partnership' : 'Natural dog chews that make tails wag 🐾')
              : 'Enter the code we just sent you'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
          {step === 'email' ? (
            // Email Step
            <form onSubmit={handleSendOTP} className="space-y-6">
              <AuthInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email Address"
                placeholder="hey@example.com"
                icon={Mail}
                required
              />

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <PrimaryButton
                type="submit"
                disabled={!email}
                loading={loading}
                loadingText="Sending code..."
                icon={ArrowRight}
              >
                Continue
              </PrimaryButton>
            </form>
          ) : (
            // OTP Step
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <p className="text-sm text-gray-600 text-center">
                  Code sent to <span className="font-semibold text-green-700">{email}</span>
                </p>
                {countdown > 0 && (
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Expires in {formatCountdown(countdown)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                  Enter 6-digit code
                </label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      onPaste={handleOTPPaste}
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 text-gray-900 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none caret-gray-700"
                    />
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <PrimaryButton
                onClick={() => handleVerifyOTP()}
                disabled={otp.some(d => !d)}
                loading={loading}
                loadingText="Verifying..."
                icon={Lock}
              >
                Verify & Login
              </PrimaryButton>

              <div className="text-center space-y-2">
                <button
                  onClick={() => {
                    setStep('email');
                    setOtp(['', '', '', '', '', '']);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Change email
                </button>
                <div>
                  <TertiaryButton
                    onClick={handleResendOTP}
                    disabled={loading || resendCountdown > 0}
                  >
                    {resendCountdown > 0 
                      ? `Resend in ${resendCountdown}s`
                      : "Didn't get it? Resend code"
                    }
                  </TertiaryButton>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Secure, passwordless authentication</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>By continuing, you agree to our Terms & Privacy Policy</p>
          <p className="mt-2">© 2025 Mumbies • Premium natural dog chews from Milwaukee, WI</p>
        </div>
      </div>
    </div>
  );
}
