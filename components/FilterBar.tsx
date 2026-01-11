import React from 'react';
import { FilterState } from '../types';

interface FilterBarProps {
    filters: FilterState;
    onChange: React.Dispatch<React.SetStateAction<FilterState>>;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
    
    const updateFilter = (key: keyof FilterState, value: string) => {
        onChange(prev => ({ ...prev, [key]: value }));
    };

    const handleReset = () => {
        onChange(prev => ({
            ...prev,
            college: '',
            course: '',
            semester: '',
            subject: '',
            sort: 'newest'
        }));
    };

    return (
        <div className="flex flex-wrap gap-3 items-center p-2 bg-transparent">
            {/* College Input */}
            <div className="flex-1 min-w-[140px]">
                <input
                    type="text"
                    placeholder="College"
                    value={filters.college}
                    onChange={(e) => updateFilter('college', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm transition-all"
                />
            </div>

            {/* Course Input */}
            <div className="flex-1 min-w-[120px]">
                <input
                    type="text"
                    placeholder="Course"
                    value={filters.course}
                    onChange={(e) => updateFilter('course', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm transition-all"
                />
            </div>

            {/* Semester Dropdown */}
            <div className="w-[90px] flex-shrink-0">
                <select
                    value={filters.semester}
                    onChange={(e) => updateFilter('semester', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm transition-all cursor-pointer appearance-none text-center"
                    style={{ backgroundImage: 'none' }} 
                    // Note: Removing arrow for cleaner pill look on some browsers, or keep default
                >
                    <option value="">Sem</option>
                    {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            {/* Subject Input */}
            <div className="flex-[2] min-w-[160px]">
                <input
                    type="text"
                    placeholder="Subject (e.g. DBMS)"
                    value={filters.subject}
                    onChange={(e) => updateFilter('subject', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm transition-all"
                />
            </div>
            
             {/* Sort Dropdown */}
             <div className="w-[130px] flex-shrink-0">
                <select
                    value={filters.sort || 'newest'}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm transition-all cursor-pointer"
                >
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low</option>
                    <option value="price_desc">Price: High</option>
                </select>
            </div>

            {/* Reset Button */}
            <button
                onClick={handleReset}
                className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 hover:text-gray-800 transition-colors shadow-sm font-medium text-sm"
                title="Reset Filters"
            >
                <i className="fas fa-undo"></i>
            </button>
        </div>
    );
};

export default FilterBar;