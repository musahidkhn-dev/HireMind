import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 
  'Design', 'Sales', 'Engineering', 'Human Resources', 'Legal',
  'Operations', 'Product', 'Data Science', 'Customer Service'
];

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    navigate(`/jobs?q=${cat}`);
  };

  return (
    <section className="py-8 lg:py-12 bg-white dark:bg-black overflow-hidden border-b border-gray-100 dark:border-gray-800">
      <div className="flex flex-col gap-3 lg:gap-4">
        {/* Row 1 */}
        <div className="flex animate-infinite-scroll whitespace-nowrap gap-3 lg:gap-4">
          {[...categories, ...categories].map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(cat)}
              className="px-4 lg:px-6 py-2 lg:py-3 rounded-full bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold border border-gray-100 dark:border-gray-800 hover:border-amber-500 hover:text-amber-600 transition-all shrink-0 text-[10px] lg:text-sm"
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* Row 2 (Reverse) */}
        <div className="flex animate-infinite-scroll-reverse whitespace-nowrap gap-3 lg:gap-4">
          {[...categories.reverse(), ...categories].map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(cat)}
              className="px-4 lg:px-6 py-2 lg:py-3 rounded-full bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold border border-gray-100 dark:border-gray-800 hover:border-amber-500 hover:text-amber-600 transition-all shrink-0 text-[10px] lg:text-sm"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Styles moved to tailwind.config.js */}
    </section>
  );
};

export default Categories;
