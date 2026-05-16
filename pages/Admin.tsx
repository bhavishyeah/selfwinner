import React, { useEffect, useMemo, useState } from 'react';
import authService from '../services/authService';
import { uploadNote } from '../services/notesService';
import {
  getAdminStats,
  getAdminUsers,
  getAdminNotes,
  updateAdminNote,
  getAdminTransactions,
  getAdminSettings,
  updateAdminSettings,
  refundAdminTransaction,
  createAdminNotification,
  getAdminNotifications,
  getAdminAuditLogs,
  getAdminAuditLogsExportUrl,
  updateAdminNotification
} from '../services/adminService';

type SectionKey = 'upload' | 'dashboard' | 'users' | 'notes' | 'payments' | 'settings' | 'moderation' | 'gamification' | 'notifications' | 'admins' | 'audit';

const sections: { key: SectionKey; label: string; icon: string }[] = [
  { key: 'upload', label: 'Upload Note', icon: 'fa-upload' },
  { key: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
  { key: 'users', label: 'Users', icon: 'fa-users' },
  { key: 'notes', label: 'Notes', icon: 'fa-file-alt' },
  { key: 'payments', label: 'Payments', icon: 'fa-credit-card' },
  { key: 'settings', label: 'Settings', icon: 'fa-cog' },
  { key: 'moderation', label: 'Moderation', icon: 'fa-shield-alt' },
  { key: 'gamification', label: 'Gamification', icon: 'fa-trophy' },
  { key: 'notifications', label: 'Notifications', icon: 'fa-bell' },
  { key: 'admins', label: 'Admin Access', icon: 'fa-user-lock' },
  { key: 'audit', label: 'Audit Log', icon: 'fa-history' }
];

const Admin: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionKey>('upload');
    const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [notes, setNotes] = useState<any[]>([]);
  const [noteStatus, setNoteStatus] = useState('');
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [editingNote, setEditingNote] = useState<any>(null);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationForm, setNotificationForm] = useState({ subject: '', message: '', audience: 'all', channel: 'in_app', scheduleAt: '' });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditFilter, setAuditFilter] = useState({ actionType: '', adminEmail: '', dateFrom: '', dateTo: '' });
  const [refundForm, setRefundForm] = useState({ reason: '', refundType: 'full', refundAmount: '' });
  const [bulkRejectReason, setBulkRejectReason] = useState('');
  const [notesPage, setNotesPage] = useState(1);
  const [txPage, setTxPage] = useState(1);
  const [auditPage, setAuditPage] = useState(1);
  const [rejectingNote, setRejectingNote] = useState<any>(null);
  const [singleRejectReason, setSingleRejectReason] = useState('');
  const [uploadForm, setUploadForm] = useState({ title: '', description: '', college: '', course: '', semester: '', subject: '', price: '', file: null as File | null });
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  const isAdmin = authService.isAdmin();

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, usersData, notesData, txData, settingsData, notificationData, logsData] = await Promise.all([
          getAdminStats(),
          getAdminUsers(),
          getAdminNotes(),
          getAdminTransactions(),
          getAdminSettings(),
          getAdminNotifications(),
          getAdminAuditLogs({})
        ]);
        setStats(statsData);
        setUsers(usersData);
        setNotes(notesData?.notes || []);
        setTransactions(txData);
        setSettings(settingsData);
        setNotifications(notificationData);
        setAuditLogs(logsData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = !search || u.email?.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !roleFilter || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">Access denied.</div>;
  }

  return (
    <div className="h-screen bg-slate-100">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:flex flex-col border-r border-slate-200 bg-white p-4">
          <h1 className="text-xl font-bold text-slate-900 mb-4"><i className="fas fa-crown text-purple-600 mr-2" />SelfWinner Admin</h1>
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${activeSection === section.key ? 'bg-purple-100 text-purple-700' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <i className={`fas ${section.icon} mr-2`} />{section.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="h-full overflow-y-auto">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Admin Panel</p>
                <h2 className="text-lg font-bold text-slate-900">{sections.find((s) => s.key === activeSection)?.label}</h2>
              </div>
              <button onClick={() => authService.logout()} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Logout</button>
            </div>
          </header>

          <section className="p-4 sm:p-6">
            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">Loading admin data...</div>
            ) : (
              <>
                {activeSection === 'upload' && (
                  <div className="rounded-xl border border-slate-200 bg-white p-5 max-w-3xl">
                    <h3 className="text-lg font-semibold mb-4">Upload New Note</h3>
                    {uploadMessage && <div className={`mb-3 rounded-lg px-3 py-2 text-sm ${uploadMessage.includes('✅') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{uploadMessage}</div>}
                    <form className="space-y-3" onSubmit={async (e) => {
                      e.preventDefault();
                      setUploadLoading(true);
                      setUploadMessage('');
                      try {
                        const fd = new FormData();
                        fd.append('title', uploadForm.title);
                        fd.append('description', uploadForm.description);
                        fd.append('college', uploadForm.college);
                        fd.append('course', uploadForm.course);
                        fd.append('semester', uploadForm.semester);
                        fd.append('subject', uploadForm.subject);
                        fd.append('price', uploadForm.price);
                        if (uploadForm.file) fd.append('pdf', uploadForm.file);
                        await uploadNote(fd);
                        setUploadMessage('✅ Note uploaded successfully');
                        setUploadForm({ title: '', description: '', college: '', course: '', semester: '', subject: '', price: '', file: null });
                      } catch (err: any) {
                        setUploadMessage('❌ ' + (err?.response?.data?.message || 'Upload failed'));
                      } finally {
                        setUploadLoading(false);
                      }
                    }}>
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Title" value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} required />
                      <textarea className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Description" value={uploadForm.description} onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} required />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="College" value={uploadForm.college} onChange={(e) => setUploadForm({ ...uploadForm, college: e.target.value })} required />
                        <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Course" value={uploadForm.course} onChange={(e) => setUploadForm({ ...uploadForm, course: e.target.value })} required />
                        <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Semester" value={uploadForm.semester} onChange={(e) => setUploadForm({ ...uploadForm, semester: e.target.value })} required />
                        <input className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Subject" value={uploadForm.subject} onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })} required />
                        <input type="number" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Price" value={uploadForm.price} onChange={(e) => setUploadForm({ ...uploadForm, price: e.target.value })} required />
                        <input type="file" accept="application/pdf" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })} required />
                      </div>
                      <button disabled={uploadLoading} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{uploadLoading ? 'Uploading...' : 'Upload Note'}</button>
                    </form>
                  </div>
                )}

                {/* ── DASHBOARD ── */}
                {activeSection === 'dashboard' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                      {[
                        { label: 'Total Users', value: stats?.users?.total || 0, icon: 'fa-users' },
                        { label: 'Total Notes', value: stats?.notes?.total || 0, icon: 'fa-file-alt' },
                        { label: 'Revenue', value: `₹${stats?.purchases?.revenue || 0}`, icon: 'fa-rupee-sign' },
                        { label: 'Active Listings', value: (stats?.notes?.active || 0) + (stats?.bundles?.active || 0), icon: 'fa-check-circle' },
                        { label: 'Purchases', value: stats?.purchases?.total || 0, icon: 'fa-shopping-cart' }
                      ].map((card) => (
                        <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="text-slate-400 text-sm"><i className={`fas ${card.icon} mr-2`} />{card.label}</div>
                          <div className="mt-2 text-2xl font-bold text-slate-900">{card.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <h3 className="font-semibold text-slate-900 mb-3">Recent Activity</h3>
                      <div className="space-y-2 text-sm text-slate-600">
                        {(stats?.recent?.users || []).slice(0, 5).map((u: any) => (
                          <div key={u._id} className="rounded-lg bg-slate-50 px-3 py-2">New signup: {u.email}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── USERS ── */}
                {activeSection === 'users' && (
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by email" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                      <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                        <option value="">All roles</option>
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="overflow-auto">
                      <table className="w-full min-w-[760px] text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-left text-slate-500">
                            <th className="py-2">Email</th><th className="py-2">Role</th><th className="py-2">Status</th><th className="py-2">Joined</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u) => (
                            <tr key={u._id} className="border-b border-slate-100">
                              <td className="py-2">{u.email}</td>
                              <td className="py-2 capitalize">{u.role}</td>
                              <td className="py-2">{u.isActive ? 'Active' : 'Inactive'}</td>
                              <td className="py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── NOTES ── */}
                {activeSection === 'notes' && (
                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="mb-4 flex gap-3 flex-wrap">
                      <select value={noteStatus} onChange={(e) => setNoteStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white" onClick={async () => { const r = await getAdminNotes({ status: showPendingOnly ? 'pending' : noteStatus }); setNotes(r.notes || []); }}>Filter</button>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showPendingOnly} onChange={(e) => setShowPendingOnly(e.target.checked)} />Pending queue</label>
                      <button className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white" onClick={async () => { await Promise.all(selectedNoteIds.map((id) => updateAdminNote(id, { status: 'approved' }))); setNotes((prev) => prev.map((n) => selectedNoteIds.includes(n._id) ? { ...n, status: 'approved' } : n)); setSelectedNoteIds([]); }}>Bulk Approve</button>
                      <button className="rounded-lg bg-rose-600 px-3 py-2 text-sm text-white" onClick={async () => { if (!bulkRejectReason) return alert('Enter reject reason'); await Promise.all(selectedNoteIds.map((id) => updateAdminNote(id, { status: 'rejected', rejectedReason: bulkRejectReason }))); setNotes((prev) => prev.map((n) => selectedNoteIds.includes(n._id) ? { ...n, status: 'rejected', rejectedReason: bulkRejectReason } : n)); setSelectedNoteIds([]); setBulkRejectReason(''); }}>Bulk Reject</button>
                      <input value={bulkRejectReason} onChange={(e) => setBulkRejectReason(e.target.value)} placeholder="Reject reason" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    <div className="overflow-auto">
                      <table className="w-full min-w-[860px] text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-left text-slate-500">
                            <th className="py-2">
                              <input type="checkbox" checked={notes.length > 0 && selectedNoteIds.length === notes.length} onChange={(e) => setSelectedNoteIds(e.target.checked ? notes.map((n) => n._id) : [])} />
                            </th>
                            <th className="py-2">Title</th>
                            <th>Status</th>
                            <th>Price</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {notes.slice((notesPage - 1) * 10, notesPage * 10).map((n) => (
                            <tr key={n._id} className="border-b border-slate-100">
                              <td><input type="checkbox" checked={selectedNoteIds.includes(n._id)} onChange={(e) => setSelectedNoteIds((prev) => e.target.checked ? [...prev, n._id] : prev.filter((id) => id !== n._id))} /></td>
                              <td className="py-2">{n.title}</td>
                              <td>{n.status || 'pending'}</td>
                              <td>₹{n.price}</td>
                              <td>
                                <div className="flex gap-2">
                                  <button onClick={async () => { await updateAdminNote(n._id, { status: 'approved' }); setNotes((prev) => prev.map((x) => x._id === n._id ? { ...x, status: 'approved' } : x)); }} className="rounded bg-emerald-100 px-2 py-1 text-emerald-700">Approve</button>
                                  <button onClick={() => setRejectingNote(n)} className="rounded bg-rose-100 px-2 py-1 text-rose-700">Reject</button>
                                  <button onClick={async () => { await updateAdminNote(n._id, { featured: !n.featured }); setNotes((prev) => prev.map((x) => x._id === n._id ? { ...x, featured: !x.featured } : x)); }} className="rounded bg-amber-100 px-2 py-1 text-amber-700">{n.featured ? 'Unfeature' : 'Feature'}</button>
                                  <button onClick={() => setEditingNote(n)} className="rounded bg-blue-100 px-2 py-1 text-blue-700">Edit</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* ✅ Pagination now INSIDE the notes section div */}
                    <div className="mt-3 flex justify-end gap-2">
                      <button className="rounded border px-2 py-1 text-sm" disabled={notesPage === 1} onClick={() => setNotesPage((p) => Math.max(1, p - 1))}>Prev</button>
                      <span className="text-sm">Page {notesPage}</span>
                      <button className="rounded border px-2 py-1 text-sm" disabled={notesPage * 10 >= notes.length} onClick={() => setNotesPage((p) => p + 1)}>Next</button>
                    </div>
                  </div>
                )}

                {/* ── PAYMENTS ── */}
                {activeSection === 'payments' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm"><span className="text-slate-500">Total Campaigns</span><div className="text-xl font-bold">{notifications.length}</div></div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm"><span className="text-slate-500">Scheduled</span><div className="text-xl font-bold">{notifications.filter((n) => n.status === 'scheduled').length}</div></div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm"><span className="text-slate-500">Sent</span><div className="text-xl font-bold">{notifications.filter((n) => n.status === 'sent').length}</div></div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Transactions</p><p className="text-xl font-bold">{transactions.length}</p></div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Revenue</p><p className="text-xl font-bold">₹{transactions.filter((t) => t.status === 'completed').reduce((a, b) => a + Number(b.amount || 0), 0)}</p></div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Refunded</p><p className="text-xl font-bold">{transactions.filter((t) => t.status === 'refunded').length}</p></div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5 overflow-auto">
                      <table className="w-full min-w-[900px] text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-left text-slate-500">
                            <th className="py-2">Order</th><th>Buyer</th><th>Item</th><th>Amount</th><th>Status</th><th>Date</th><th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.slice((txPage - 1) * 10, txPage * 10).map((t) => (
                            <tr key={t._id} className="border-b border-slate-100">
                              <td className="py-2">{t._id.slice(-8)}</td>
                              <td>{t.userId?.email || '-'}</td>
                              <td>{t.itemId?.title || '-'}</td>
                              <td>₹{t.amount}</td>
                              <td>{t.status}</td>
                              <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                              <td><button className="rounded bg-slate-100 px-2 py-1" onClick={() => setSelectedTx(t)}>View</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button className="rounded border px-2 py-1 text-sm" disabled={txPage === 1} onClick={() => setTxPage((p) => Math.max(1, p - 1))}>Prev</button>
                      <span className="text-sm">Page {txPage}</span>
                      <button className="rounded border px-2 py-1 text-sm" disabled={txPage * 10 >= transactions.length} onClick={() => setTxPage((p) => p + 1)}>Next</button>
                    </div>
                  </div>
                )}

                {/* ── SETTINGS ── */}
                {activeSection === 'settings' && (
                  <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 max-w-3xl">
                    <div>
                      <label className="text-sm text-slate-600">Platform Name</label>
                      <input value={settings.platformName || ''} onChange={(e) => setSettings({ ...settings, platformName: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!settings.allowRegistrations} onChange={(e) => setSettings({ ...settings, allowRegistrations: e.target.checked })} />Allow Registrations</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!settings.allowUploads} onChange={(e) => setSettings({ ...settings, allowUploads: e.target.checked })} />Allow Uploads</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!settings.allowPurchases} onChange={(e) => setSettings({ ...settings, allowPurchases: e.target.checked })} />Allow Purchases</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} />Maintenance Mode</label>
                    </div>
                    <div>
                      <label className="text-sm text-slate-600">Announcement Banner</label>
                      <input value={settings.announcementText || ''} onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <select value={settings.announcementType || 'info'} onChange={(e) => setSettings({ ...settings, announcementType: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="success">Success</option>
                        <option value="error">Error</option>
                      </select>
                      <input type="datetime-local" value={settings.announcementExpiry || ''} onChange={(e) => setSettings({ ...settings, announcementExpiry: e.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                    <button onClick={async () => { const updated = await updateAdminSettings(settings); setSettings(updated); }} className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white">Save Settings</button>
                  </div>
                )}

                {/* ── NOTIFICATIONS ── */}
                {activeSection === 'notifications' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm"><span className="text-slate-500">Total Campaigns</span><div className="text-xl font-bold">{notifications.length}</div></div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm"><span className="text-slate-500">Scheduled</span><div className="text-xl font-bold">{notifications.filter((n) => n.status === 'scheduled').length}</div></div>
                      <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm"><span className="text-slate-500">Sent</span><div className="text-xl font-bold">{notifications.filter((n) => n.status === 'sent').length}</div></div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5 max-w-3xl space-y-3">
                      <h3 className="text-lg font-semibold">Broadcast Notification</h3>
                      <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Subject" value={notificationForm.subject} onChange={(e) => setNotificationForm({ ...notificationForm, subject: e.target.value })} />
                      <textarea className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Message" value={notificationForm.message} onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })} />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={notificationForm.audience} onChange={(e) => setNotificationForm({ ...notificationForm, audience: e.target.value })}>
                          <option value="all">All Users</option>
                          <option value="sellers">Only Sellers</option>
                          <option value="buyers">Only Buyers</option>
                        </select>
                        <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={notificationForm.channel} onChange={(e) => setNotificationForm({ ...notificationForm, channel: e.target.value })}>
                          <option value="in_app">In-App</option>
                          <option value="email">Email</option>
                          <option value="both">Both</option>
                        </select>
                        <input type="datetime-local" className="rounded-lg border border-slate-200 px-3 py-2 text-sm" value={notificationForm.scheduleAt} onChange={(e) => setNotificationForm({ ...notificationForm, scheduleAt: e.target.value })} />
                      </div>
                      <button
                        className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white"
                        onClick={async () => {
                          const created = await createAdminNotification(notificationForm);
                          setNotifications((prev) => [created, ...prev]);
                          setNotificationForm({ subject: '', message: '', audience: 'all', channel: 'in_app', scheduleAt: '' });
                        }}
                      >
                        Send / Schedule
                      </button>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5 overflow-auto">
                      <table className="w-full min-w-[860px] text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-left text-slate-500">
                            <th className="py-2">Subject</th><th>Audience</th><th>Channel</th><th>Status</th><th>Created</th><th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {notifications.map((n) => (
                            <tr key={n._id} className="border-b border-slate-100">
                              <td className="py-2">{n.subject}</td>
                              <td>{n.audience}</td>
                              <td>{n.channel}</td>
                              <td>{n.status}</td>
                              <td>{new Date(n.createdAt).toLocaleString()}</td>
                              <td>
                                <div className="flex gap-2">
                                  {n.status === 'scheduled' && (
                                    <button className="rounded bg-amber-100 px-2 py-1 text-xs" onClick={async () => { const updated = await updateAdminNotification(n._id, { status: 'sent' }); setNotifications((prev) => prev.map((x) => x._id === updated._id ? updated : x)); }}>Mark Sent</button>
                                  )}
                                  <button className="rounded bg-slate-100 px-2 py-1 text-xs" onClick={async () => { const date = window.prompt('New schedule datetime (YYYY-MM-DDTHH:mm)') || ''; const updated = await updateAdminNotification(n._id, { scheduleAt: date, status: date ? 'scheduled' : n.status }); setNotifications((prev) => prev.map((x) => x._id === updated._id ? updated : x)); }}>Reschedule</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── AUDIT ── */}
                {activeSection === 'audit' && (
                  <div className="rounded-xl border border-slate-200 bg-white p-5 overflow-auto">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end">
                      <div><h3 className="text-lg font-semibold">Audit Log</h3></div>
                      <input className="rounded border border-slate-200 px-2 py-1 text-sm" placeholder="Action" value={auditFilter.actionType} onChange={(e) => setAuditFilter({ ...auditFilter, actionType: e.target.value })} />
                      <input className="rounded border border-slate-200 px-2 py-1 text-sm" placeholder="Admin email" value={auditFilter.adminEmail} onChange={(e) => setAuditFilter({ ...auditFilter, adminEmail: e.target.value })} />
                      <input type="date" className="rounded border border-slate-200 px-2 py-1 text-sm" value={auditFilter.dateFrom} onChange={(e) => setAuditFilter({ ...auditFilter, dateFrom: e.target.value })} />
                      <input type="date" className="rounded border border-slate-200 px-2 py-1 text-sm" value={auditFilter.dateTo} onChange={(e) => setAuditFilter({ ...auditFilter, dateTo: e.target.value })} />
                      <button className="rounded bg-slate-900 px-3 py-1 text-sm text-white" onClick={async () => setAuditLogs(await getAdminAuditLogs(auditFilter))}>Filter</button>
                      <a href={getAdminAuditLogsExportUrl()} target="_blank" rel="noreferrer" className="rounded bg-emerald-600 px-3 py-1 text-sm text-white">Export CSV</a>
                    </div>
                    <table className="w-full min-w-[900px] text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-left text-slate-500">
                          <th className="py-2">Timestamp</th><th>Admin</th><th>Action</th><th>Target</th><th>IP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLogs.slice((auditPage - 1) * 10, auditPage * 10).map((log) => (
                          <tr key={log._id} className="border-b border-slate-100">
                            <td className="py-2">{new Date(log.createdAt).toLocaleString()}</td>
                            <td>{log.adminEmail || '-'}</td>
                            <td>{log.actionType}</td>
                            <td>{log.targetType}:{log.targetId}</td>
                            <td>{log.ipAddress || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-3 flex justify-end gap-2">
                      <button className="rounded border px-2 py-1 text-sm" disabled={auditPage === 1} onClick={() => setAuditPage((p) => Math.max(1, p - 1))}>Prev</button>
                      <span className="text-sm">Page {auditPage}</span>
                      <button className="rounded border px-2 py-1 text-sm" disabled={auditPage * 10 >= auditLogs.length} onClick={() => setAuditPage((p) => p + 1)}>Next</button>
                    </div>
                  </div>
                )}

                {/* ── OTHER SECTIONS (scaffold) ── */}
                {!['upload', 'dashboard', 'users', 'notes', 'payments', 'settings', 'notifications', 'audit'].includes(activeSection) && (
                  <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-600">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{sections.find((s) => s.key === activeSection)?.label}</h3>
                    <p>This section is scaffolded and ready for endpoint wiring as per your full specification.</p>
                  </div>
                )}

                {/* ── REJECT MODAL ── */}
                {rejectingNote && (
                  <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-5">
                      <h3 className="text-lg font-bold mb-3">Reject Note</h3>
                      <textarea className="w-full rounded border border-slate-200 px-3 py-2 text-sm" placeholder="Reason is required" value={singleRejectReason} onChange={(e) => setSingleRejectReason(e.target.value)} />
                      <div className="mt-4 flex justify-end gap-2">
                        <button className="rounded border px-3 py-2 text-sm" onClick={() => { setRejectingNote(null); setSingleRejectReason(''); }}>Cancel</button>
                        <button className="rounded bg-rose-600 px-3 py-2 text-sm text-white" onClick={async () => { if (!singleRejectReason) return; await updateAdminNote(rejectingNote._id, { status: 'rejected', rejectedReason: singleRejectReason }); setNotes((prev) => prev.map((x) => x._id === rejectingNote._id ? { ...x, status: 'rejected', rejectedReason: singleRejectReason } : x)); setRejectingNote(null); setSingleRejectReason(''); }}>Reject</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── EDIT NOTE MODAL ── */}
                {editingNote && (
                  <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-5">
                      <h3 className="mb-3 text-lg font-bold">Edit Note</h3>
                      <div className="space-y-3">
                        <input className="w-full rounded border border-slate-200 px-3 py-2 text-sm" value={editingNote.title || ''} onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })} placeholder="Title" />
                        <input className="w-full rounded border border-slate-200 px-3 py-2 text-sm" value={editingNote.subject || ''} onChange={(e) => setEditingNote({ ...editingNote, subject: e.target.value })} placeholder="Subject" />
                        <input className="w-full rounded border border-slate-200 px-3 py-2 text-sm" type="number" value={editingNote.price || 0} onChange={(e) => setEditingNote({ ...editingNote, price: Number(e.target.value) })} placeholder="Price" />
                        <select className="w-full rounded border border-slate-200 px-3 py-2 text-sm" value={editingNote.status || 'pending'} onChange={(e) => setEditingNote({ ...editingNote, status: e.target.value })}>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <button className="rounded border px-3 py-2 text-sm" onClick={() => setEditingNote(null)}>Cancel</button>
                        <button className="rounded bg-purple-600 px-3 py-2 text-sm text-white" onClick={async () => { const updated = await updateAdminNote(editingNote._id, editingNote); setNotes((prev) => prev.map((n) => n._id === updated._id ? updated : n)); setEditingNote(null); }}>Save</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TRANSACTION MODAL ── */}
                {selectedTx && (
                  <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-xl rounded-xl bg-white p-5">
                      <h3 className="text-lg font-bold mb-3">Transaction Details</h3>
                      <div className="space-y-2 text-sm text-slate-700">
                        <p><b>Order:</b> {selectedTx._id}</p>
                        <p><b>Buyer:</b> {selectedTx.userId?.email || '-'}</p>
                        <p><b>Item:</b> {selectedTx.itemId?.title || '-'}</p>
                        <p><b>Amount:</b> ₹{selectedTx.amount}</p>
                        <p><b>Status:</b> {selectedTx.status}</p>
                      </div>
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input className="rounded border border-slate-200 px-2 py-2 text-sm" placeholder="Refund reason" value={refundForm.reason} onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })} />
                        <select className="rounded border border-slate-200 px-2 py-2 text-sm" value={refundForm.refundType} onChange={(e) => setRefundForm({ ...refundForm, refundType: e.target.value })}>
                          <option value="full">Full</option>
                          <option value="partial">Partial</option>
                        </select>
                        <input className="rounded border border-slate-200 px-2 py-2 text-sm" type="number" placeholder="Amount" disabled={refundForm.refundType !== 'partial'} value={refundForm.refundAmount} onChange={(e) => setRefundForm({ ...refundForm, refundAmount: e.target.value })} />
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <button className="rounded border px-3 py-2 text-sm" onClick={() => setSelectedTx(null)}>Close</button>
                        {selectedTx.status !== 'refunded' && (
                          <button className="rounded bg-rose-600 px-3 py-2 text-sm text-white" onClick={async () => { const updated = await refundAdminTransaction(selectedTx._id, { reason: refundForm.reason || 'Admin refund', refundType: refundForm.refundType as any, refundAmount: refundForm.refundType === 'partial' ? Number(refundForm.refundAmount || 0) : undefined }); setTransactions((prev) => prev.map((t) => t._id === updated._id ? updated : t)); setSelectedTx(updated); }}>Refund</button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Admin;