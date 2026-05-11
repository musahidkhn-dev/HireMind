import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Facebook, Instagram } from 'lucide-react';
import { useSelector } from 'react-redux';

const Footer = () => {
  // console.log("Footer rendered");
  const currentYear = new Date().getFullYear();
  const { user } = useSelector((state) => state.auth);
  const brandName = user?.companyName || "HireMind";

  // REDESIGN: Updated footer link structure to match reference design
  const footerLinks = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Customers', path: '/customers' },
        { label: 'Press', path: '/press' },
        { label: 'Partnership', path: '/partnership' },
      ],
    },
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', path: '/' },
        { label: 'Explore', path: '/jobs' },
        { label: 'Category', path: '/jobs' },
        { label: 'About Us', path: '/about' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'FAQs', path: '/faq' },
        { label: 'Blog', path: '/blog' },
      ],
    },
  ];

  return (
    // REDESIGN: Light gray bg #F5F5F5 instead of dark
    <footer className="bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-400 py-10 lg:py-16 overflow-hidden break-words relative">

      {/* REDESIGN: Golden diagonal stripe decoration top-right */}
      <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 stripe-pattern opacity-20 rounded-bl-3xl" />

      {/* REDESIGN: Dot grid pattern bottom-left */}
      <div className="absolute bottom-0 left-0 w-32 h-32 lg:w-40 lg:h-40 dot-pattern opacity-15" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-10 lg:mb-16">
          {/* Brand Col — REDESIGN: Logo, Desc, Socials */}
          <div className="lg:max-w-sm">
            <Link to="/" className="flex items-center gap-2 mb-4 lg:mb-6">
              <div className="p-1.5 lg:p-2 bg-primary-500 rounded-lg">
                <Brain className="text-white" size={18} className="lg:hidden" />
                <Brain className="text-white hidden lg:block" size={24} />
              </div>
              <span className="text-lg lg:text-xl font-black tracking-tight text-gray-900 dark:text-white">
                {brandName === 'HireMind' ? (
                  <>Hire<span className="text-primary-500">Mind</span></>
                ) : (
                  brandName
                )}
              </span>
            </Link>
            <p className="mb-6 lg:mb-8 text-gray-500 dark:text-gray-400 text-[11px] lg:text-sm leading-relaxed">
              The next generation AI-powered hiring platform designed to help companies find top talent with data-driven precision.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-all duration-300"
                >
                  <Icon size={14} className="lg:hidden" />
                  <Icon size={18} className="hidden lg:block" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Section — Responsive Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-8 lg:gap-12">
            {footerLinks.map((col) => (
              <div key={col.title}>
                <h4 className="text-gray-900 dark:text-white font-bold mb-4 lg:mb-6 text-[10px] lg:text-sm uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-2 lg:space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-xs lg:text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* REDESIGN: Contact + Legal row — 2 cols on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8 mb-8 lg:mb-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-3 lg:mb-4 text-[10px] lg:text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-1">
              <p className="text-[11px] lg:text-sm text-gray-500 dark:text-gray-400">hello@hiremind.com</p>
              <p className="text-[11px] lg:text-sm text-gray-500 dark:text-gray-400">+1 (555) 123-4567</p>
            </div>
          </div>
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-3 lg:mb-4 text-[10px] lg:text-sm uppercase tracking-wider">Legal</h4>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
              <Link to="/terms" className="text-[11px] lg:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link>
              <Link to="/privacy" className="text-[11px] lg:text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
        </div>

        {/* REDESIGN: Minimal copyright */}
        <div className="text-center text-[10px] lg:text-xs text-gray-400 dark:text-gray-500">
          <p>© {currentYear} {brandName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
