import React, { useEffect, useState } from 'react';
import { User, Purchase, Note } from '../types';
import { getPurchases } from '../services/paymentService';
import { getNotes } from '../services/notesService';
import { updateUserProfile } from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
    user: User;
    setUser: (u: User) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setUser }) => {
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [allNotes, setAllNotes] = useState<Note[]>([]);
    const [editMode, setEditMode] = useState(false);
    
    // Form state
    const [profile, setProfile] = useState({
        college: user.profile?.college || '',
        course: user.profile?.course || '',
        semester: user.profile?.semester || '',
        hobbies: user.profile?.hobbies || '',
        language: user.profile?.language || '',
        gender: user.profile?.gender || 'Male',
        personality: user.profile?.personality || ''
    });

    useEffect(() => {
        const load = async () => {
            const p = await getPurchases(user.id);
            setPurchases(p);
            const n = await getNotes();
            setAllNotes(n);
        };
        load();
    }, [user.id]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateUserProfile(user.id, profile);
        setUser({ ...user, profile });
        setEditMode(false);
    };

    const purchasedNotes = purchases
        .filter(p => p.itemType === 'NOTE')
        .map(p => allNotes.find(n => n.id === p.itemId))
        .filter(Boolean) as Note[];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">My Profile</h2>
                            <button 
                                onClick={() => setEditMode(!editMode)}
                                className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                            >
                                {editMode ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        {editMode ? (
                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">College</label>
                                    <input type="text" className="w-full border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none" value={profile.college} onChange={e => setProfile({...profile, college: e.target.value})} required />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course</label>
                                        <input type="text" className="w-full border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none" value={profile.course} onChange={e => setProfile({...profile, course: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Semester</label>
                                        <select className="w-full border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none" value={profile.semester} onChange={e => setProfile({...profile, semester: e.target.value})}>
                                            <option value="">Select</option>
                                            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hobbies</label>
                                    <input type="text" className="w-full border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none" value={profile.hobbies} onChange={e => setProfile({...profile, hobbies: e.target.value})} />
                                </div>
                                <button type="submit" className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors mt-2">Save Profile</button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/30">
                                        <i className="fas fa-user-graduate"></i>
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="font-bold text-gray-900 truncate" title={user.email}>{user.email}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Student Account</div>
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 pt-6 space-y-4 text-sm">
                                    <div className="flex justify-between items-center"><span className="text-gray-500">College</span> <span className="font-semibold text-gray-900">{user.profile?.college || 'Not set'}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-gray-500">Course</span> <span className="font-semibold text-gray-900">{user.profile?.course || 'Not set'}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-gray-500">Semester</span> <span className="font-semibold text-gray-900">{user.profile?.semester || '-'}</span></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Purchases Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <i className="fas fa-book text-primary mr-3"></i> My Library
                        </h2>
                        
                        {purchasedNotes.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <div className="text-gray-300 text-4xl mb-3"><i className="fas fa-folder-open"></i></div>
                                <p className="text-gray-500 mb-4 font-medium">Your library is empty.</p>
                                <button onClick={() => navigate('/')} className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-bold hover:border-primary hover:text-primary transition-colors">
                                    Browse Marketplace
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {purchasedNotes.map(note => (
                                    <div key={note.id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-100 transition-all duration-300 group">
                                        <div className="flex items-center space-x-5">
                                            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center text-lg group-hover:bg-red-100 transition-colors">
                                                <i className="fas fa-file-pdf"></i>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{note.title}</h4>
                                                <p className="text-xs text-gray-500 font-medium">{note.subject}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/note/${note.id}`)}
                                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark shadow-sm shadow-blue-500/20"
                                        >
                                            Read
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;