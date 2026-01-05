'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GripVertical, HelpCircle, Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import DeleteConfirmationModal from '@/src/components/DeleteConfirmationModal';
import AdminInput from '@/src/components/AdminInput';
import AdminButton from '@/src/components/AdminButton';
import AdminTextarea from '@/src/components/AdminTextarea';

interface PartnerQuestion {
  id: number;
  question: string;
  placeholder: string | null;
  required: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  enabled: boolean;
}

export default function PartnerQuestionsPage() {
  const [questions, setQuestions] = useState<PartnerQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<PartnerQuestion | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; question: PartnerQuestion | null; deleting: boolean }>({
    show: false,
    question: null,
    deleting: false,
  });
  const [formData, setFormData] = useState({
    question: '',
    placeholder: '',
    required: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/partner-questions');
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = '/api/v1/admin/partner-questions';
      const method = editingQuestion ? 'PATCH' : 'POST';
      const body = editingQuestion
        ? { id: editingQuestion.id, ...formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        fetchQuestions();
        setShowModal(false);
        resetForm();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save question');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ question: '', placeholder: '', required: true });
    setEditingQuestion(null);
  };

  const openEditModal = (question: PartnerQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      placeholder: question.placeholder || '',
      required: question.required,
    });
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.question) return;

    setDeleteModal(prev => ({ ...prev, deleting: true }));
    try {
      const res = await fetch(`/api/v1/admin/partner-questions?id=${deleteModal.question.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        fetchQuestions();
        setDeleteModal({ show: false, question: null, deleting: false });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete question');
    }
  };

  const moveQuestion = async (questionId: number, direction: 'up' | 'down') => {
    const currentIndex = questions.findIndex(q => q.id === questionId);
    if (currentIndex === -1) return;

    const newOrder = direction === 'up' 
      ? Math.max(0, questions[currentIndex].order - 1)
      : questions[currentIndex].order + 1;

    try {
      const res = await fetch('/api/v1/admin/partner-questions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: questionId, newOrder }),
      });

      const data = await res.json();
      if (data.success) {
        fetchQuestions();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to reorder question');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Application Questions</h1>
          <p className="text-gray-600">Manage questions for partner registration form</p>
        </div>
        <AdminButton
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          icon={Plus}
          variant="primary"
        >
          Add Question
        </AdminButton>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {questions.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              No questions yet. Create one to get started.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {questions.map((question, index) => (
                <div key={question.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col gap-1 pt-2">
                      <button
                        onClick={() => moveQuestion(question.id, 'up')}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <button
                        onClick={() => moveQuestion(question.id, 'down')}
                        disabled={index === questions.length - 1}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-500">#{question.order + 1}</span>
                            {question.required && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-base font-medium text-gray-900 mb-1">{question.question}</p>
                          {question.placeholder && (
                            <p className="text-sm text-gray-500 italic">Placeholder: "{question.placeholder}"</p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(question)}
                            className="text-blue-600 hover:text-blue-900 p-2"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ show: true, question, deleting: false })}
                            className="text-red-600 hover:text-red-900 p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingQuestion ? 'Edit Question' : 'Create Question'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AdminTextarea
                label="Question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                required
                placeholder="e.g., Why do you want to become a partner?"
                rows={3}
              />

              <AdminInput
                label="Placeholder Text"
                type="text"
                value={formData.placeholder}
                onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                placeholder="Optional placeholder text for the answer field"
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={formData.required}
                  onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="required" className="text-sm font-medium text-gray-700">
                  Required question
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <AdminButton
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  variant="secondary"
                  disabled={submitting}
                  className="flex-1"
                >
                  Cancel
                </AdminButton>
                <AdminButton
                  type="submit"
                  disabled={submitting}
                  variant="primary"
                  className="flex-1"
                  icon={submitting ? Loader2 : undefined}
                >
                  {editingQuestion ? 'Update' : 'Create'}
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, question: null, deleting: false })}
        onConfirm={handleDeleteConfirm}
        title="Delete Question"
        message="Are you sure you want to delete this question?"
        itemName={deleteModal.question?.question}
        isDeleting={deleteModal.deleting}
      />
    </div>
  );
}
