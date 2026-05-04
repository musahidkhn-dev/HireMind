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

      <div className={`${isOpen ? 'block' : 'hidden'} lg:block card p-8 bg-white dark:bg-[#1A1A1A] border border-border dark:border-white/5 rounded-[2rem] shadow-sm sticky top-24`}>
        <div className="flex items-center justify-between mb-8 px-1">
          <h3 className="text-sm font-black text-text-primary dark:text-white uppercase tracking-widest">Filters</h3>
          <button 
            onClick={clearAll}
            className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
          >
            Clear All
          </button>
        </div>

        {/* Location */}
        <div className="mb-8">
          <p className="text-[10px] font-black text-text-secondary dark:text-gray-500 uppercase tracking-widest mb-4 px-1">Location</p>
          <div className="relative group">
            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary dark:text-gray-600 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="City or Remote"
              value={filters.location}
              onChange={(e) => onChange({ ...filters, location: e.target.value })}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl text-sm font-bold outline-none focus:bg-white dark:focus:bg-white/10 focus:border-primary/20 dark:text-white transition-all"
            />
          </div>
        </div>

        {/* Job Type */}
        <div className="mb-10">
          <p className="text-[10px] font-black text-text-secondary dark:text-gray-500 uppercase tracking-widest mb-6 px-1">Job Type</p>
          <div className="space-y-4">
            {JOB_TYPES.map((type) => (
              <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                   <input
                     type="checkbox"
                     checked={filters.types?.includes(type.value)}
                     onChange={() => handleTypeChange(type.value)}
                     className="peer w-5 h-5 rounded-lg border-2 border-border dark:border-white/10 bg-transparent text-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer appearance-none checked:bg-primary checked:border-primary"
                   />
                   <X size={12} className="absolute left-1 top-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className="text-sm font-bold text-text-secondary dark:text-gray-400 group-hover:text-text-primary dark:group-hover:text-white transition-colors">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary Range */}
        <div className="mb-10">
          <p className="text-[10px] font-black text-text-secondary dark:text-gray-500 uppercase tracking-widest mb-6 px-1">Salary Range</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="Min"
              value={filters.minSalary}
              onChange={(e) => onChange({ ...filters, minSalary: e.target.value })}
              className="w-full bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl p-4 text-xs font-bold outline-none focus:bg-white dark:focus:bg-white/10 focus:border-primary/20 dark:text-white transition-all"
            />
            <span className="text-text-secondary dark:text-gray-600 font-bold">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxSalary}
              onChange={(e) => onChange({ ...filters, maxSalary: e.target.value })}
              className="w-full bg-gray-50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-2xl p-4 text-xs font-bold outline-none focus:bg-white dark:focus:bg-white/10 focus:border-primary/20 dark:text-white transition-all"
            />
          </div>
        </div>

        <Button 
          className="w-full lg:hidden rounded-2xl py-4 shadow-xl shadow-primary/20" 
          onClick={() => setIsOpen(false)}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default JobFilter;
