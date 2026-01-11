import React, { useState } from 'react';
import { User } from '../types';
import { updateUserProfile } from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface ProfileSetupProps {
    user: User;
    setUser: (u: User) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        college: '',
        course: '',
        semester: '',
        hobbies: '',
        language: 'English',
        gender: '',
        personality: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUserProfile(user.id, formData);
            const updatedUser = { ...user, profile: formData };
            setUser(updatedUser);
            navigate('/dashboard');
        } catch (error) {
            alert('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const update = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl w-full animate-slide-up">
                
                {/* Glass Card */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-blue-900/5 relative overflow-hidden">
                    
                    {/* Decorative Blob */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

                    <header className="text-center mb-10 relative z-10">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-6 transform -rotate-6">
                            <i className="fas fa-user-astronaut text-3xl"></i>
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Complete your Profile</h1>
                        <p className="text-slate-500 text-sm max-w-md mx-auto">
                            Help us tailor the library to your needs. We'll show you notes specifically for your course and semester.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        
                        {/* College - Full Width */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">College / University</label>
                            <div className="relative group">
                                <i className="fas fa-university absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"></i>
                                <input 
                                    required 
                                    type="text" 
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/80 border border-white/50 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all shadow-sm" 
                                    placeholder="e.g. IIT Bombay" 
                                    value={formData.college} 
                                    onChange={e => update('college', e.target.value)} 
                                />
                            </div>
                        </div>

                        {/* Course */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Course</label>
                            <input 
                                required 
                                type="text" 
                                className="w-full px-4 py-3.5 bg-white/80 border border-white/50 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all shadow-sm" 
                                placeholder="e.g. B.Tech" 
                                value={formData.course} 
                                onChange={e => update('course', e.target.value)} 
                            />
                        </div>

                        {/* Semester */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Semester</label>
                            <div className="relative">
                                <select 
                                    required 
                                    className="w-full px-4 py-3.5 bg-white/80 border border-white/50 rounded-xl text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all shadow-sm cursor-pointer" 
                                    value={formData.semester} 
                                    onChange={e => update('semester', e.target.value)}
                                >
                                    <option value="">Select Semester</option>
                                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                                </select>
                                <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                            </div>
                        </div>

                        {/* Gender - Buttons */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Gender</label>
                            <div className="flex gap-3">
                                {['Male', 'Female', 'Other'].map(g => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => update('gender', g)}
                                        className={`flex-1 py-3 rounded-xl border font-medium transition-all duration-200 transform active:scale-95 ${
                                            formData.gender === g 
                                            ? 'bg-primary text-white border-primary shadow-lg shadow-blue-500/25' 
                                            : 'bg-white/60 text-slate-600 border-white/40 hover:bg-white hover:border-white'
                                        }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hobbies - Full Width */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Hobbies</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3.5 bg-white/80 border border-white/50 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all shadow-sm" 
                                placeholder="Coding, Cricket, Reading..." 
                                value={formData.hobbies} 
                                onChange={e => update('hobbies', e.target.value)} 
                            />
                        </div>

                        {/* Language */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Language</label>
                            <div className="relative">
                                <select 
                                    className="w-full px-4 py-3.5 bg-white/80 border border-white/50 rounded-xl text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all shadow-sm cursor-pointer"
                                    value={formData.language} 
                                    onChange={e => update('language', e.target.value)}
                                >
                                    <option>English</option>
                                    <option>Hindi</option>
                                    <option>Hinglish</option>
                                </select>
                                <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                            </div>
                        </div>

                        {/* Personality */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">Personality</label>
                            <div className="relative">
                                <select 
                                    className="w-full px-4 py-3.5 bg-white/80 border border-white/50 rounded-xl text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all shadow-sm cursor-pointer"
                                    value={formData.personality} 
                                    onChange={e => update('personality', e.target.value)}
                                >
                                    <option value="">Select Type</option>
                                    <option value="Introvert">Introvert</option>
                                    <option value="Extrovert">Extrovert</option>
                                    <option value="Ambivert">Ambivert</option>
                                </select>
                                <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"></i>
                            </div>
                        </div>

                        {/* Submit CTA */}
                        <div className="md:col-span-2 pt-6">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full flex justify-center items-center py-4 px-6 rounded-2xl shadow-xl shadow-blue-500/20 text-white font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <><i className="fas fa-circle-notch fa-spin mr-2"></i> Saving...</>
                                ) : (
                                    <>Save & Continue <i className="fas fa-arrow-right ml-2.5"></i></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;