import React, { useState, useMemo } from 'react';
import { Note } from '../types';

interface NotesTableProps {
    notes: Note[];
    onEdit: (note: Note) => void;
    onDelete: (note: Note) => void;
    onPreview: (note: Note) => void;
}

const NotesTable: React.FC<NotesTableProps> = ({ notes = [], onEdit, onDelete, onPreview }) => {
  const [q, setQ] = useState('');
  
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return notes;
    return notes.filter(n =>
      (n.title || '').toLowerCase().includes(term) ||
      (n.subject || '').toLowerCase().includes(term) ||
      (n.college || '').toLowerCase().includes(term)
    );
  }, [notes, q]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-primary/10 text-primary p-1.5 rounded-lg">
                <i className="fas fa-table" aria-hidden="true"></i>
            </span>
            Note Library
        </h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
             <div className="relative flex-1 sm:flex-none">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" aria-hidden="true"></i>
                <input 
                    value={q} 
                    onChange={(e)=>setQ(e.target.value)} 
                    placeholder="Search notes..." 
                    aria-label="Search notes in table"
                    className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64 transition-shadow" 
                />
             </div>
             <button 
                className="px-3 py-2 border border-gray-200 bg-white text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors whitespace-nowrap focus:ring-2 focus:ring-offset-1 focus:ring-gray-200"
                aria-label="Export to CSV"
            >
                <i className="fas fa-file-export mr-2" aria-hidden="true"></i> Export
             </button>
        </div>
      </div>

      <div className="overflow-x-auto flex-grow">
        <table className="min-w-full divide-y divide-gray-50">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Title / Info</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm bg-white">
            {filtered.map(note => (
              <tr 
                key={note.id} 
                className="hover:bg-blue-50/30 transition-colors group cursor-default"
                tabIndex={0}
              >
                <td className="px-6 py-3">
                    <div className="font-bold text-gray-900 line-clamp-1">{note.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5 flex gap-2">
                        <span className="bg-gray-100 px-1.5 rounded">{note.college}</span>
                        <span className="text-gray-300">•</span>
                        <span>Sem {note.semester}</span>
                    </div>
                </td>
                <td className="px-6 py-3 text-gray-600">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium border border-gray-200 whitespace-nowrap">
                        {note.subject}
                    </span>
                </td>
                <td className="px-6 py-3 font-medium">
                     {note.isFree ? (
                        <span className="text-green-700 font-bold text-xs uppercase bg-green-50 px-2 py-0.5 rounded border border-green-100">Free</span>
                     ) : (
                        <span className="text-gray-900">₹{note.price}</span>
                     )}
                </td>
                <td className="px-6 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${
                      note.status === 'approved' 
                      ? 'bg-green-50 text-green-700 border-green-100' 
                      : note.status === 'rejected'
                      ? 'bg-red-50 text-red-700 border-red-100'
                      : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                  }`}>
                    {note.status === 'approved' && <i className="fas fa-check-circle mr-1.5 text-[10px]" aria-hidden="true"></i>}
                    {note.status === 'rejected' && <i className="fas fa-times-circle mr-1.5 text-[10px]" aria-hidden="true"></i>}
                    {(!note.status || note.status === 'pending') && <i className="fas fa-clock mr-1.5 text-[10px]" aria-hidden="true"></i>}
                    {note.status || 'pending'}
                  </span>
                </td>
                <td className="px-6 py-3 text-right whitespace-nowrap">
                  <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                    <button 
                        onClick={()=>onPreview(note)} 
                        className="p-1.5 text-gray-400 hover:text-primary transition-colors focus:text-primary focus:outline-none focus:bg-gray-100 rounded" 
                        title="Preview"
                        aria-label={`Preview ${note.title}`}
                    >
                        <i className="fas fa-eye" aria-hidden="true"></i>
                    </button>
                    <button 
                        onClick={()=>onEdit(note)} 
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors focus:text-blue-600 focus:outline-none focus:bg-gray-100 rounded" 
                        title="Edit"
                        aria-label={`Edit ${note.title}`}
                    >
                        <i className="fas fa-pen" aria-hidden="true"></i>
                    </button>
                    <button 
                        onClick={()=>onDelete(note)} 
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors focus:text-red-600 focus:outline-none focus:bg-gray-100 rounded" 
                        title="Delete"
                        aria-label={`Delete ${note.title}`}
                    >
                        <i className="fas fa-trash" aria-hidden="true"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 border-dashed border-gray-200 bg-gray-50/30">
                    <i className="fas fa-search text-gray-300 text-3xl mb-3 block" aria-hidden="true"></i>
                    No notes found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NotesTable;