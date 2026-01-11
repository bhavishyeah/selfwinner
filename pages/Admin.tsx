import React, { useState, useEffect } from 'react';
import { uploadNote, getNotes, deleteNote, createBundle, getBundles, deleteBundle } from '../services/notesService';
import authService from '../services/authService';

interface AdminProps {
  user?: any;
}

const Admin: React.FC<AdminProps> = ({ user: propUser }) => {
  const [user, setUser] = useState(propUser);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'manage' | 'bundles'>('upload');
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    college: '',
    course: '',
    semester: '',
    subject: '',
    price: '',
    file: null as File | null
  });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // Bundle form state
  const [bundleForm, setBundleForm] = useState({
    title: '',
    description: '',
    price: '',
    college: '',
    course: '',
    semester: '',
    selectedNotes: [] as string[]
  });
  const [bundleLoading, setBundleLoading] = useState(false);
  const [bundleMessage, setBundleMessage] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      if (!user) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
      setLoading(false);
    };
    loadUser();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'manage') {
      loadNotes();
    } else if (activeTab === 'bundles') {
      loadNotes();
      loadBundles();
    }
  }, [activeTab]);

  const loadNotes = async () => {
    const data = await getNotes();
    setNotes(data);
  };

  const loadBundles = async () => {
    const data = await getBundles();
    setBundles(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({ ...uploadForm, file: e.target.files[0] });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadLoading(true);
    setUploadMessage('');

    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('college', uploadForm.college);
      formData.append('course', uploadForm.course);
      formData.append('semester', uploadForm.semester);
      formData.append('subject', uploadForm.subject);
      formData.append('price', uploadForm.price);
      if (uploadForm.file) {
        formData.append('pdf', uploadForm.file);
      }

      await uploadNote(formData);
      setUploadMessage('✅ Note uploaded successfully!');
      setUploadForm({
        title: '',
        description: '',
        college: '',
        course: '',
        semester: '',
        subject: '',
        price: '',
        file: null
      });
      const fileInput = document.getElementById('pdf-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      setUploadMessage('❌ ' + (error.response?.data?.message || 'Upload failed'));
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
      loadNotes();
    }
  };

  const handleToggleNote = (noteId: string) => {
    setBundleForm(prev => ({
      ...prev,
      selectedNotes: prev.selectedNotes.includes(noteId)
        ? prev.selectedNotes.filter(id => id !== noteId)
        : [...prev.selectedNotes, noteId]
    }));
  };

  const handleCreateBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    setBundleLoading(true);
    setBundleMessage('');

    try {
      await createBundle({
        title: bundleForm.title,
        description: bundleForm.description,
        price: Number(bundleForm.price),
        college: bundleForm.college,
        course: bundleForm.course,
        semester: bundleForm.semester,
        noteIds: bundleForm.selectedNotes
      });
      
      setBundleMessage('✅ Bundle created successfully!');
      setBundleForm({
        title: '',
        description: '',
        price: '',
        college: '',
        course: '',
        semester: '',
        selectedNotes: []
      });
      loadBundles();
    } catch (error: any) {
      setBundleMessage('❌ ' + (error.response?.data?.message || 'Bundle creation failed'));
    } finally {
      setBundleLoading(false);
    }
  };

  const handleDeleteBundle = async (bundleId: string) => {
    if (window.confirm('Are you sure you want to delete this bundle?')) {
      await deleteBundle(bundleId);
      loadBundles();
    }
  };

  const isAdmin = user?.role === 'admin' || authService.isAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <i className="fas fa-crown text-purple-600 mr-3"></i>
            Admin Panel
          </h1>
          <p className="text-gray-600">Manage notes, bundles, and platform content</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'upload'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fas fa-upload mr-2"></i>
              Upload Note
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'manage'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fas fa-tasks mr-2"></i>
              Manage Notes
            </button>
            <button
              onClick={() => setActiveTab('bundles')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'bundles'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fas fa-box mr-2"></i>
              Create Bundles
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload New Note</h2>
              
              {uploadMessage && (
                <div className={`mb-6 p-4 rounded-lg ${
                  uploadMessage.includes('✅') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {uploadMessage}
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      required
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Data Structures Notes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                    <input
                      type="text"
                      required
                      value={uploadForm.subject}
                      onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Detailed description..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">College *</label>
                    <input
                      type="text"
                      required
                      value={uploadForm.college}
                      onChange={(e) => setUploadForm({ ...uploadForm, college: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Course *</label>
                    <input
                      type="text"
                      required
                      value={uploadForm.course}
                      onChange={(e) => setUploadForm({ ...uploadForm, course: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Semester *</label>
                    <select
                      required
                      value={uploadForm.semester}
                      onChange={(e) => setUploadForm({ ...uploadForm, semester: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={uploadForm.price}
                    onChange={(e) => setUploadForm({ ...uploadForm, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter 0 for free"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">PDF File *</label>
                  <input
                    type="file"
                    id="pdf-file"
                    required
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {uploadLoading ? 'Uploading...' : 'Upload Note'}
                </button>
              </form>
            </div>
          )}

          {/* Manage Tab */}
          {activeTab === 'manage' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Notes ({notes.length})</h2>
              
              {notes.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No notes uploaded yet.</p>
              ) : (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div
                      key={note._id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">{note.title}</h3>
                        <p className="text-sm text-gray-600">
                          {note.subject} • {note.college} • Sem {note.semester}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          👁️ {note.views} views • 🛒 {note.purchases} purchases
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          note.price === 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {note.price === 0 ? 'FREE' : `₹${note.price}`}
                        </span>
                        <button
                          onClick={() => handleDeleteNote(note._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bundles Tab */}
          {activeTab === 'bundles' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Bundle from Existing Notes</h2>

              {bundleMessage && (
                <div className={`mb-6 p-4 rounded-lg ${
                  bundleMessage.includes('✅')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {bundleMessage}
                </div>
              )}

              <form onSubmit={handleCreateBundle} className="space-y-6 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bundle Title *</label>
                    <input
                      type="text"
                      required
                      value={bundleForm.title}
                      onChange={(e) => setBundleForm({ ...bundleForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., Complete BCA Semester 3 Pack"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bundle Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={bundleForm.price}
                      onChange={(e) => setBundleForm({ ...bundleForm, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={bundleForm.description}
                    onChange={(e) => setBundleForm({ ...bundleForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">College *</label>
                    <input
                      type="text"
                      required
                      value={bundleForm.college}
                      onChange={(e) => setBundleForm({ ...bundleForm, college: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Course *</label>
                    <input
                      type="text"
                      required
                      value={bundleForm.course}
                      onChange={(e) => setBundleForm({ ...bundleForm, course: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Semester *</label>
                    <input
                      type="text"
                      required
                      value={bundleForm.semester}
                      onChange={(e) => setBundleForm({ ...bundleForm, semester: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Notes for Bundle * ({bundleForm.selectedNotes.length} selected)
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {notes.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No notes available. Upload some notes first.</p>
                    ) : (
                      <div className="space-y-2">
                        {notes.map((note) => (
                          <label
                            key={note._id}
                            className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={bundleForm.selectedNotes.includes(note._id)}
                              onChange={() => handleToggleNote(note._id)}
                              className="w-5 h-5 text-primary"
                            />
                            <div className="ml-3 flex-1">
                              <div className="font-semibold text-gray-900">{note.title}</div>
                              <div className="text-sm text-gray-600">{note.subject} • ₹{note.price}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bundleLoading || bundleForm.selectedNotes.length === 0}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {bundleLoading ? 'Creating...' : 'Create Bundle'}
                </button>
              </form>

              {/* Existing Bundles */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Existing Bundles ({bundles.length})</h3>
                {bundles.length === 0 ? (
                  <p className="text-gray-600 text-center py-4">No bundles created yet.</p>
                ) : (
                  <div className="space-y-4">
                    {bundles.map((bundle) => (
                      <div
                        key={bundle._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <h4 className="font-semibold text-gray-900">{bundle.title}</h4>
                          <p className="text-sm text-gray-600">
                            {Array.isArray(bundle.noteIds) ? bundle.noteIds.length : 0} notes • ₹{bundle.price}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteBundle(bundle._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;