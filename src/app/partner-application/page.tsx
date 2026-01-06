'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Loader2, CheckCircle, Instagram, Youtube, Facebook } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';
import AdminInput from '@/src/components/AdminInput';
import AdminTextarea from '@/src/components/AdminTextarea';
import PrimaryButton from '@/src/components/PrimaryButton';

interface Question {
  id: number;
  question: string;
  placeholder: string | null;
  required: boolean;
  order: number;
}

export default function PartnerApplicationPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    instagramUrl: '',
    tiktokUrl: '',
    facebookUrl: '',
    youtubeUrl: '',
  });
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchQuestions();
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch('/api/v1/authentication/me');
      const data = await res.json();
      if (data.success && data.data) {
        setUserEmail(data.data.email);
        if (data.data.name) {
          setFormData(prev => ({ ...prev, name: data.data.name }));
        }
      } else {
        // User not authenticated, redirect to login with partnerRegistration flag
        router.push('/login?partnerRegistration=true');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      // On error, also redirect to login
      router.push('/login?partnerRegistration=true');
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/partner-questions');
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data);
        // Initialize answers object
        const initialAnswers: { [key: number]: string } = {};
        data.data.forEach((q: Question) => {
          initialAnswers[q.id] = '';
        });
        setAnswers(initialAnswers);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate name
    if (!formData.name.trim()) {
      alert('Please enter your name');
      return;
    }

    // Validate at least one social media URL
    const hasSocialMedia = formData.instagramUrl || formData.tiktokUrl || formData.facebookUrl || formData.youtubeUrl;
    if (!hasSocialMedia) {
      alert('Please provide at least one social media profile');
      return;
    }

    // Validate required questions
    const missingAnswers = questions.filter(q => q.required && !answers[q.id]?.trim());
    if (missingAnswers.length > 0) {
      alert('Please answer all required questions');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/partner/application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          answers: questions.map(q => ({
            question: q.question,
            answer: answers[q.id] || '',
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard/account');
        }, 2000);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-2">
            Thank you for your interest in becoming a partner.
          </p>
          <p className="text-gray-600">
            We'll review your application and get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-600 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">Partner Application</h1>
            <p className="text-red-50">Join our partner program and start earning commissions</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* User Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Information</h2>
              
              <AdminInput
                type="email"
                label="Email"
                value={userEmail}
                disabled
                placeholder="Loading..."
                onChange={(_) => {}}
              />

              <AdminInput
                type="text"
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter your full name"
              />
            </div>

            {/* Social Media Links */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Social Media Profiles</h2>
              <p className="text-sm text-gray-600 mb-4">Share your social media profiles (at least one is required)</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminInput
                  type="url"
                  label={
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </div>
                  }
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/username"
                />

                <AdminInput
                  type="url"
                  label={
                    <div className="flex items-center gap-2">
                      <FaTiktok className="w-4 h-4" />
                      TikTok
                    </div>
                  }
                  value={formData.tiktokUrl}
                  onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                  placeholder="https://tiktok.com/@username"
                />

                <AdminInput
                  type="url"
                  label={
                    <div className="flex items-center gap-2">
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </div>
                  }
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/username"
                />

                <AdminInput
                  type="url"
                  label={
                    <div className="flex items-center gap-2">
                      <Youtube className="w-4 h-4" />
                      YouTube
                    </div>
                  }
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/@username"
                />
              </div>
            </div>

            {/* Dynamic Questions */}
            {questions.length > 0 && (
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Application Questions</h2>
                {questions.map((question) => (
                  <AdminTextarea
                    key={question.id}
                    label={question.question}
                    value={answers[question.id] || ''}
                    onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                    required={question.required}
                    placeholder={question.placeholder || ''}
                    rows={4}
                  />
                ))}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <PrimaryButton
                type="submit"
                disabled={submitting}
                loading={submitting}
                loadingText="Submitting..."
                icon={Send}
              >
                Submit Application
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
