import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, X, Brain, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { JOB_TYPES } from '../../utils/constants';
import { useGenerateJD } from '../../hooks/useJobs';

const jobSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  jobType: z.string().min(1, 'Please select a job type'),
  location: z.string().min(1, 'Location is required'),
  salaryRange: z.object({
    min: z.coerce.number().min(0),
    max: z.coerce.number().min(0),
    currency: z.string().default('USD')
  }),
  status: z.string().default('active'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.array(z.string()).min(1, 'Add at least one requirement'),
  skills: z.array(z.string()).min(1, 'Add at least one skill')
});

const JobForm = ({ initialData, onSubmit, isLoading }) => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reqInput, setReqInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: initialData || {
      requirements: [],
      skills: [],
      salaryRange: { currency: 'USD' },
      status: 'active'
    }
  });

  // Jump to step with error
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const step1Fields = ['title', 'jobType', 'location', 'salaryRange'];
      const hasStep1Error = step1Fields.some(field => {
        if (field === 'salaryRange') return errors.salaryRange?.min || errors.salaryRange?.max;
        return errors[field];
      });

      if (hasStep1Error) {
        setStep(1);
      } else {
        const step2Fields = ['description', 'requirements', 'skills'];
        const hasStep2Error = step2Fields.some(field => errors[field]);
        if (hasStep2Error) setStep(2);
      }
    }
  }, [errors]);

  const generateJD = useGenerateJD();
  const formData = watch();

  const handleAddRequirement = () => {
    if (reqInput.trim()) {
      setValue('requirements', [...formData.requirements, reqInput.trim()]);
      setReqInput('');
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setValue('skills', [...formData.skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const nextStep = async () => {
    let fields = [];
    if (step === 1) fields = ['title', 'jobType', 'location', 'salaryRange.min', 'salaryRange.max'];
    if (step === 2) fields = ['description', 'requirements', 'skills']; // Only require skills to proceed to AI assistant
    if (step === 3) fields = []; // Final review step, no specific fields to trigger before submit

    const isValid = await trigger(fields);
    if (isValid) setStep(step + 1);
  };

  const onAIGenerate = async () => {
    try {
      const response = await generateJD.mutateAsync({
        title: formData.title,
        skills: formData.skills
      });

      if (response && response.generated) {
        setValue('description', response.generated.description);
        setValue('requirements', response.generated.requirements);
        setValue('skills', response.generated.skills || formData.skills);
        toast.success('AI description applied!');
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      const result = await onSubmit(data);

      setStep(3);
      setIsSubmitted(true);
    } catch (error) {
      console.error(' Submission Error:', error);
    }
  };

  // Log validation errors if they exist
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log(" Validation Errors:", errors);
    }
  }, [errors]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-amber-600 text-white shadow-lg shadow-amber-100' : 'bg-gray-100 text-gray-400'
              }`}>
              {step > s ? <Check size={20} /> : s}
            </div>
            {s < 3 && (
              <div className={`h-1 flex-1 mx-4 rounded-full ${step > s ? 'bg-amber-600' : 'bg-gray-100'
                }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Basic Information</h3>
            <Input label="Job Title" {...register('title')} error={errors.title?.message} placeholder="e.g. Senior Frontend Developer" />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Job Type" {...register('jobType')} options={JOB_TYPES} error={errors.jobType?.message} />
              <Input label="Location" {...register('location')} error={errors.location?.message} placeholder="e.g. Remote or San Francisco, CA" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input label="Min Salary" type="number" {...register('salaryRange.min')} error={errors.salaryRange?.min?.message} />
              <Input label="Max Salary" type="number" {...register('salaryRange.max')} error={errors.salaryRange?.max?.message} />
              <Select label="Currency" {...register('salaryRange.currency')} options={[{ label: 'USD', value: 'USD' }, { label: 'EUR', value: 'EUR' }, { label: 'PKR', value: 'PKR' }, { label: 'INR', value: 'INR' }]} />
            </div>
            <Select label="Status" {...register('status')} options={[{ label: 'Active', value: 'active' }, { label: 'Draft', value: 'draft' }]} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Role Details</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onAIGenerate}
                loading={generateJD.isPending}
                icon={Brain}
                className="text-amber-600 border-amber-100 bg-amber-50 hover:bg-amber-100"
              >
                AI Assistant
              </Button>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Job Description</label>
              <textarea
                {...register('description')}
                rows={8}
                className="w-full rounded-xl border border-gray-200 bg-white p-4 text-gray-900 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Describe the role and responsibilities..."
              />
              {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
            </div>

            {/* Requirements */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Requirements</label>
              <div className="flex gap-2">
                <Input value={reqInput} onChange={(e) => setReqInput(e.target.value)} placeholder="Add a requirement..." onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())} />
                <Button type="button" variant="secondary" onClick={handleAddRequirement} icon={Plus} />
              </div>
              <div className="flex flex-col gap-2">
                {formData.requirements.map((req, i) => (
                  <div key={`req-${i}-${req.substring(0, 10)}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl group">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{req}</span>
                    <button type="button" onClick={() => setValue('requirements', formData.requirements.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500 transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Skills</label>
              <div className="flex gap-2">
                <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill..." onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} />
                <Button type="button" variant="secondary" onClick={handleAddSkill} icon={Plus} />
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, i) => (
                  <div key={`skill-${i}-${skill}`} className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-bold border border-amber-100 dark:border-amber-800">
                    {skill}
                    <button type="button" onClick={() => setValue('skills', formData.skills.filter((_, idx) => idx !== i))} className="hover:text-amber-900 dark:hover:text-white">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && !isSubmitted && (
          <div className="space-y-6 animate-fadeIn text-center">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-3xl flex items-center justify-center text-amber-600 mx-auto mb-6">
              <Check size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Ready to Publish?</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Review your details and click below to publish your job post to the platform.
            </p>
            <div className="card p-6 text-left">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{formData.title || 'No Title'}</h4>
              <p className="text-sm text-gray-500 line-clamp-3">"{formData.description || 'No description added yet...'}"</p>
            </div>
            <button
              type="submit"
              id="test-submit-btn"
              className="w-full h-14 bg-amber-600 text-white rounded-xl font-bold shadow-lg hover:bg-amber-700 transition-all flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Job Post'}
              {!isLoading && <Check size={20} />}
            </button>
          </div>
        )}

        {isSubmitted && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-12 text-center"
          >
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
              <Check size={48} strokeWidth={3} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Job Post Published!</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-10">
              Your job post has been successfully created and is now live for candidates to apply.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => window.location.href = '/dashboard/company'}>Go to Dashboard</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>Post Another Job</Button>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        {!isSubmitted && (
          <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-gray-800">
            {step > 1 ? (
              <Button type="button" variant="ghost" onClick={() => setStep(step - 1)} icon={ChevronLeft}>Previous</Button>
            ) : <div />}

            {step < 3 && (
              <Button type="button" onClick={nextStep} icon={ChevronRight}>Next Step</Button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default JobForm;
