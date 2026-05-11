import React, { useState } from 'react';
import { Search, MapPin, X, Filter } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { JOB_TYPES } from '../../utils/constants';

const JobFilter = ({ filters, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTypeChange = (type) => {
    const currentTypes = filters.types || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    onChange({ ...filters, types: newTypes });
  };

  const clearAll = () => {
    onChange({
      types: [],
      location: '',
      minSalary: '',
      maxSalary: '',
      skills: []
    });
  };

  return (
    <div className="w-full">
      {/* Mobile Toggle */}
      <Button
        variant="outline"
        className="w-full lg:hidden mb-4 flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
        icon={Filter}
      >
        Filters {filters.types.length > 0 && `(${filters.types.length})`}
      </Button>

      <div className={`${isOpen ? 'block' : 'hidden'} lg:block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] p-6 lg:p-8 shadow-sm lg:sticky lg:top-24`}>
        <div className="flex items-center justify-between mb-6 px-1">
          <h3 className="text-[11px] lg:text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Filters</h3>
          <button 
            onClick={clearAll}
            className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider"
          >
            Clear All
          </button>
        </div>

        {/* Location */}
        <div className="mb-6">
          <p className="text-[9px] lg:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-1">Location</p>
          <div className="relative group">
            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="City or Remote"
              value={filters.location}
              onChange={(e) => onChange({ ...filters, location: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-700 rounded-xl text-xs lg:text-sm font-bold outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-primary/20 dark:text-white transition-all"
            />
          </div>
        </div>

        {/* Job Type */}
        <div className="mb-8">
          <p className="text-[9px] lg:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-1">Job Type</p>
          <div className="space-y-3">
            {JOB_TYPES.map((type) => (
              <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                   <input
                     type="checkbox"
                     checked={filters.types?.includes(type.value)}
                     onChange={() => handleTypeChange(type.value)}
                     className="peer w-4 h-4 rounded border-2 border-slate-200 dark:border-slate-700 bg-transparent text-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer appearance-none checked:bg-primary checked:border-primary"
                   />
                   <X size={10} className="absolute left-0.5 top-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className="text-[11px] lg:text-[13px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary Range */}
        <div className="mb-8">
          <p className="text-[9px] lg:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-1">Salary Range</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minSalary}
              onChange={(e) => onChange({ ...filters, minSalary: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-700 rounded-xl p-3 text-[10px] lg:text-xs font-bold outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-primary/20 dark:text-white transition-all"
            />
            <span className="text-slate-300 dark:text-slate-700 font-bold">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxSalary}
              onChange={(e) => onChange({ ...filters, maxSalary: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-700 rounded-xl p-3 text-[10px] lg:text-xs font-bold outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-primary/20 dark:text-white transition-all"
            />
          </div>
        </div>

        <Button 
          className="w-full lg:hidden rounded-xl py-3 shadow-lg shadow-primary/20 text-sm font-bold" 
          onClick={() => setIsOpen(false)}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default JobFilter;
