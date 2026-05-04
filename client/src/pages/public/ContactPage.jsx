import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Phone, Send } from 'lucide-react';
import Button from '../../components/common/Button';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'support@hiremind.ai', color: 'text-blue-500' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 000-0000', color: 'text-green-500' },
    { icon: MapPin, label: 'Office', value: 'San Francisco, CA', color: 'text-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4"
          >
            Get in <span className="gradient-text">Touch</span>
          </motion.h1>
          <p className="text-gray-500 font-medium">Have questions? We're here to help you grow.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, i) => (
              <div key={i} className="card p-6 bg-white dark:bg-gray-900 border-none shadow-sm flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 ${info.color}`}>
                  <info.icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{info.label}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card p-8 md:p-10 bg-white dark:bg-gray-900 border-none shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20"
                    placeholder="How can we help?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Message</label>
                  <textarea 
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 resize-none"
                    placeholder="Your message here..."
                  />
                </div>
                <Button type="submit" className="w-full py-4 rounded-xl" icon={Send}>Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
