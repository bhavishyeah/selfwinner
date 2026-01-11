import React from 'react';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onView: (note: Note) => void;
  onBuy: (note: Note) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onView, onBuy }) => {
  return (
    <div 
        className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full group relative"
    >
      {/* Badges - Top Right */}
      <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1">
          {note.tags?.includes('Popular') && (
              <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-orange-200 flex items-center">
                  <i className="fas fa-fire mr-1"></i> Popular
              </span>
          )}
          {note.tags?.includes('New') && (
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-green-200 flex items-center">
                  <i className="fas fa-certificate mr-1"></i> New
              </span>
          )}
          {note.tags?.includes('Verified') && (
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-blue-200 flex items-center">
                  <i className="fas fa-check-circle mr-1"></i> Verified
              </span>
          )}
      </div>

      <div className="p-0 flex flex-col flex-grow cursor-pointer" onClick={() => onView(note)}>
        {/* Preview Area */}
        <div className="w-full h-40 bg-gray-100 relative overflow-hidden group-hover:opacity-95 transition-opacity">
             {note.previewUrl ? (
                 <img src={note.previewUrl} alt="Preview" className="w-full h-full object-cover" />
             ) : (
                 <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center">
                     <i className="fas fa-file-pdf text-4xl text-gray-300"></i>
                 </div>
             )}
             <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-3 pt-8">
                 <span className="text-white text-xs font-bold uppercase tracking-wider shadow-black drop-shadow-md">
                     {note.subject?.slice(0, 15)}...
                 </span>
             </div>
        </div>
        
        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
             <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2" title={note.title}>
                {note.title}
             </h3>
          </div>
          
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10 leading-relaxed">
            {note.description}
          </p>
          
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider mt-auto">
            <span className="bg-blue-50 text-primary px-2 py-1 rounded border border-blue-100 truncate max-w-[100px]">
                {note.college}
            </span>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                Sem {note.semester}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex gap-3 items-center mt-auto">
        {note.isFree ? (
          <button 
            onClick={() => onView(note)} 
            className="w-full py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm shadow-blue-500/20 flex items-center justify-center group-hover:scale-[1.02]"
          >
            <i className="fas fa-unlock mr-2"></i> Access Now
          </button>
        ) : (
          <>
            <button 
                onClick={(e) => { e.stopPropagation(); onBuy(note); }} 
                className="flex-1 py-2.5 bg-accent text-white rounded-lg font-bold text-sm hover:brightness-105 transition-all shadow-sm flex items-center justify-center group-hover:scale-[1.02]"
            >
                Buy ₹{note.price}
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); onView(note); }} 
                className="px-4 py-2.5 border border-gray-200 bg-white text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50 hover:text-primary hover:border-primary/30 transition-all"
            >
                Preview
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NoteCard;
