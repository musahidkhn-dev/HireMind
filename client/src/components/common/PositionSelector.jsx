import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown, Briefcase } from 'lucide-react';

const PositionSelector = ({ jobs = [], selectedId, onChange, placeholder = "Select a position..." }) => {
  const selectedJob = jobs.find(job => job._id === selectedId);

  const handleChange = (id) => {
    if (id && onChange) {
      onChange(id);
    }
  };

  return (
    <Listbox value={selectedId || ""} onChange={handleChange}>
      {({ open }) => (
        <div className="relative z-[9999] w-full min-w-[240px]">
          <Listbox.Button className="relative w-full cursor-pointer rounded-2xl bg-white dark:bg-slate-800 py-3 pl-4 pr-10 text-left border border-border dark:border-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all sm:text-sm">
            <span className="flex items-center gap-3 truncate">
              <Briefcase size={18} className="text-primary shrink-0" />
              <span className={`block truncate font-bold ${!selectedJob ? 'text-text-secondary dark:text-gray-500' : 'text-text-primary dark:text-white'}`}>
                {selectedJob ? selectedJob.title : placeholder}
              </span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <ChevronDown className={`h-4 w-4 text-text-secondary dark:text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Listbox.Options className="absolute mt-2 max-h-72 w-full overflow-auto rounded-2xl bg-white dark:bg-slate-800 py-2 text-base shadow-xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none sm:text-sm border border-border dark:border-slate-700">
              {jobs.length === 0 ? (
                <div className="py-4 px-4 text-center text-sm font-medium text-text-secondary">
                  No positions available
                </div>
              ) : (
                jobs.map((job) => (
                  <Listbox.Option
                    key={job._id}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${
                        active ? 'bg-primary/5 text-primary dark:bg-primary/10' : 'text-text-primary dark:text-white'
                      }`
                    }
                    value={job._id}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-black' : 'font-semibold'}`}>
                          {job.title}
                        </span>
                        <span className="block text-[10px] uppercase tracking-wider font-bold text-text-secondary dark:text-gray-500 mt-0.5">
                          {job.applicationCount || 0} applicants
                        </span>
                        {selected ? (
                          <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-primary' : 'text-primary'}`}>
                            <Check className="h-4 w-4" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))
              )}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};

export default PositionSelector;
