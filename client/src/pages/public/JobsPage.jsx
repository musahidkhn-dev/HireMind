import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import JobCard from '../../components/jobs/JobCard';
import JobFilter from '../../components/jobs/JobFilter';
import { CardSkeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { usePublicJobs } from '../../hooks/useJobs';
import useDebounce from '../../hooks/useDebounce';

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initial filters from URL
  const initialFilters = useMemo(() => ({
    search: searchParams.get('q') || '',
    location: searchParams.get('l') || '',
    types: searchParams.get('t')?.split(',').filter(Boolean) || [],
    minSalary: searchParams.get('min') || '',
    maxSalary: searchParams.get('max') || '',
    page: parseInt(searchParams.get('p')) || 1,
    sortBy: searchParams.get('sort') || 'latest'
  }), [searchParams]);

  const [filters, setFilters] = useState(initialFilters);
  const debouncedSearch = useDebounce(filters.search, 500);
  const debouncedLocation = useDebounce(filters.location, 500);

  // Sync URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('q', filters.search);
    if (filters.location) params.set('l', filters.location);
    if (filters.types.length) params.set('t', filters.types.join(','));
    if (filters.minSalary) params.set('min', filters.minSalary);
    if (filters.maxSalary) params.set('max', filters.maxSalary);
    if (filters.page > 1) params.set('p', filters.page);
    if (filters.sortBy !== 'latest') params.set('sort', filters.sortBy);

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Query Data
  const { data, isLoading } = usePublicJobs({
    ...filters,
    search: debouncedSearch,
    location: debouncedLocation
  });

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 }); // Reset to page 1 on filter change
  };

  const removeType = (type) => {
    handleFilterChange({
      ...filters,
      types: filters.types.filter(t => t !== type)
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-slate-900 transition-colors duration-300">
      {/* Search Hero — REDESIGN: Editorial & Premium */}
      <div className="bg-white dark:bg-slate-900 border-b border-border dark:border-slate-800 pt-20 pb-20 lg:pt-28 lg:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4F46E5 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-7xl mx-auto px-5 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-10 lg:mb-16"
          >
            <h1 className="text-3xl lg:text-7xl font-serif text-slate-900 dark:text-white mb-4 lg:mb-6 leading-tight tracking-tight">
              Find your next <span className="text-primary italic">career</span> milestone
            </h1>
            <p className="text-slate-500 dark:text-gray-400 text-sm lg:text-xl max-w-2xl mx-auto font-medium">
              Explore curated opportunities from industry leaders and high-growth startups.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-5xl mx-auto"
          >
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 bg-white dark:bg-slate-800 p-2 lg:p-2.5 rounded-[1.2rem] lg:rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
              <div className="flex-1 flex items-center gap-3 px-4 lg:px-6 py-3 lg:py-4 group">
                <Search size={20} className="text-primary/70 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Job title or company"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="bg-transparent border-none outline-none text-slate-900 dark:text-white w-full font-bold text-sm lg:text-base placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
              <div className="hidden lg:block w-px h-8 bg-slate-100 dark:bg-slate-700 mx-1" />
              <div className="flex-1 flex items-center gap-3 px-4 lg:px-6 py-3 lg:py-4 group border-t lg:border-t-0 border-slate-50 dark:border-slate-700">
                <MapPin size={20} className="text-primary/70 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Location or remote"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="bg-transparent border-none outline-none text-slate-900 dark:text-white w-full font-bold text-sm lg:text-base placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
              <Button size="lg" className="rounded-xl lg:rounded-[1.5rem] w-full lg:w-auto px-8 lg:px-12 py-3 lg:py-5 shadow-lg shadow-primary/20 text-sm lg:text-base font-bold">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 -mt-10 lg:-mt-12 pb-24 relative z-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-32">
              <JobFilter filters={filters} onChange={handleFilterChange} />
            </div>
          </aside>

          {/* Results Area */}
          <main className="flex-1 min-w-0 overflow-hidden">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <h2 className="text-[10px] font-black text-text-primary dark:text-white uppercase tracking-[0.2em] whitespace-nowrap">
                  {data?.totalJobs || 0} Open Roles
                </h2>
                <div className="flex flex-wrap gap-2">
                  {filters.types.map(t => (
                    <div key={t} className="flex items-center gap-2 px-3 py-1 bg-primary/5 dark:bg-primary/10 text-primary rounded-full text-[10px] font-bold border border-primary/10">
                      {t.replace('-', ' ')}
                      <button onClick={() => removeType(t)} className="hover:text-primary-600"><X size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl border border-border dark:border-slate-700 shadow-sm">
                <ArrowUpDown size={16} className="text-text-secondary dark:text-gray-500" />
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-text-primary dark:text-white focus:ring-0 cursor-pointer outline-none"
                >
                  <option value="latest">Newest First</option>
                  <option value="salary_high">Highest Salary</option>
                  <option value="relevance">Relevance</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <div key="loading" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
                </div>
              ) : data?.jobs?.length > 0 ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {data.jobs.map((job, idx) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      index={idx}
                      onClick={() => navigate(`/jobs/${job._id}`)}
                    />
                  ))}
                </motion.div>
              ) : (
                <div key="empty" className="bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-dashed border-border dark:border-slate-700 py-24 text-center">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-text-secondary/30 dark:text-gray-600" />
                  </div>
                  <h3 className="text-2xl font-serif text-text-primary dark:text-white mb-2">No jobs found</h3>
                  <p className="text-text-secondary dark:text-gray-400 max-w-xs mx-auto font-medium">
                    Try adjusting your filters or search keywords to find what you're looking for.
                  </p>
                  <Button variant="outline" className="mt-8 rounded-xl px-8" onClick={() => setFilters(initialFilters)}>
                    Clear all filters
                  </Button>
                </div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {data?.totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <Pagination
                  currentPage={filters.page}
                  totalPages={data.totalPages}
                  onPageChange={(p) => setFilters({ ...filters, page: p })}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
