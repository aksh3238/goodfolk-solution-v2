import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { ServiceCategory } from '../types';

interface EnquiryFormProps {
  isFullContactPage?: boolean;
  onNavigateToPrivacy?: () => void;
  defaultService?: string;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  isFullContactPage = false,
  onNavigateToPrivacy,
  defaultService
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '00000000',
    service: defaultService || 'Branding & Packaging',
    budget: '',
    deadline: '',
    details: '',
    consent: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const servicesList: ServiceCategory[] = [
    'Branding & Packaging',
    'Creative Design',
    'Performance Marketing Creatives',
    'Video Production & Editing',
    'Digital Marketing & Social Media Management'
  ];

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) {
      errs.name = 'Please provide your full name.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Business email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Mobile number is required for project communication.';
    } else {
      const cleanPhone = formData.phone.replace(/[^0-9+]/g, '');
      if (cleanPhone.length < 8) {
        errs.phone = 'Please provide a valid phone number with country code.';
      }
    }

    if (!formData.details.trim()) {
      errs.details = 'Please describe your project or requirements.';
    } else if (formData.details.trim().length < 15) {
      errs.details = 'Please provide at least 15 characters of project context.';
    }

    if (isFullContactPage && !formData.consent) {
      errs.consent = 'You must agree to our Privacy Policy to submit an enquiry.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      setSubmittedId(data.enquiryId);
    } catch (err: any) {
      setServerError(err.message || 'Network error occurred. Please try again or reach out directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E6E8ED] shadow-xl text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-[#EEF2F9] text-[#173B75] flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9 text-[#F07822]" />
        </div>
        <h3 className="text-2xl font-bold text-[#173B75]">Enquiry Received</h3>
        <p className="text-sm font-mono text-[#F07822] mt-1 font-semibold">
          Reference ID: {submittedId}
        </p>
        <p className="text-sm text-[#242832]/80 mt-3 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out to Goodfolk Solution. Our creative strategy team has recorded your brief and will review your project requirements. We typically respond within 24 business hours.
        </p>
        <div className="mt-6 pt-6 border-t border-[#E6E8ED] flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              setSubmittedId(null);
              setFormData({
                name: '',
                email: '',
                company: '',
                phone: '00000000',
                service: 'Branding & Packaging',
                budget: '',
                deadline: '',
                details: '',
                consent: true
              });
            }}
            className="text-xs font-semibold text-[#173B75] hover:text-[#F07822] transition-colors"
          >
            Submit Another Project Brief
          </button>
          <span className="text-slate-300">·</span>
          <a
            href={`https://wa.me/919817961412?text=Hi%20Goodfolk%20Solution%2C%20I%20just%20submitted%20enquiry%20${submittedId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#25D366] hover:underline"
          >
            Fast-Track on WhatsApp &rarr;
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#E6E8ED] shadow-xl space-y-5"
    >
      {serverError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label htmlFor="enquiry-name" className="block text-xs font-bold uppercase tracking-wider text-[#173B75] mb-1.5">
            Your Name <span className="text-[#F07822]">*</span>
          </label>
          <input
            id="enquiry-name"
            type="text"
            required
            placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-[#242832] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.name ? 'border-red-400 focus:ring-red-300' : 'border-[#E6E8ED] focus:ring-[#173B75]/20 focus:border-[#173B75]'
            }`}
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        {/* Business Email */}
        <div>
          <label htmlFor="enquiry-email" className="block text-xs font-bold uppercase tracking-wider text-[#173B75] mb-1.5">
            Business Email <span className="text-[#F07822]">*</span>
          </label>
          <input
            id="enquiry-email"
            type="email"
            required
            placeholder="e.g. rahul@brand.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-[#242832] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.email ? 'border-red-400 focus:ring-red-300' : 'border-[#E6E8ED] focus:ring-[#173B75]/20 focus:border-[#173B75]'
            }`}
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Company / Brand */}
        <div>
          <label htmlFor="enquiry-company" className="block text-xs font-bold uppercase tracking-wider text-[#173B75] mb-1.5">
            Company / Brand Name
          </label>
          <input
            id="enquiry-company"
            type="text"
            placeholder="e.g. Apex Consumer Labs"
            value={formData.company}
            onChange={e => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#E6E8ED] text-sm text-[#242832] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B75]/20 focus:border-[#173B75] transition-all"
          />
        </div>

        {/* Mobile Number (REQUIRED) */}
        <div>
          <label htmlFor="enquiry-phone" className="block text-xs font-bold uppercase tracking-wider text-[#173B75] mb-1.5">
            Mobile Number <span className="text-[#F07822]">*</span>
          </label>
          <input
            id="enquiry-phone"
            type="tel"
            required
            placeholder="+91 98123 45678"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-[#242832] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:ring-2 transition-all ${
              errors.phone ? 'border-red-400 focus:ring-red-300' : 'border-[#E6E8ED] focus:ring-[#173B75]/20 focus:border-[#173B75]'
            }`}
          />
          {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
        </div>
      </div>

      {/* Service Required Dropdown */}
      <div>
        <label htmlFor="enquiry-service" className="block text-xs font-bold uppercase tracking-wider text-[#173B75] mb-1.5">
          Service Required <span className="text-[#F07822]">*</span>
        </label>
        <select
          id="enquiry-service"
          value={formData.service}
          onChange={e => setFormData({ ...formData, service: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-[#E6E8ED] text-sm text-[#242832] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B75]/20 focus:border-[#173B75] transition-all"
        >
          {servicesList.map((svc, idx) => (
            <option key={idx} value={svc}>
              {svc}
            </option>
          ))}
        </select>
      </div>

      {/* Optional Contact Page Specific Fields */}
      {isFullContactPage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="enquiry-budget" className="block text-xs font-bold uppercase tracking-wider text-[#173B75] mb-1.5">
              Approximate Budget (Optional)
            </label>
            <input
              id="enquiry-budget"
              type="text"
              placeholder="e.g. ₹1,00,000 - ₹2,00,000"
              value={formData.budget}
              onChange={e => setFormData({ ...formData, budget: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#E6E8ED] text-sm text-[#242832] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B75]/20 focus:border-[#173B75] transition-all"
            />
          </div>

          <div>
            <label htmlFor="enquiry-deadline" className="block text-xs font-bold uppercase tracking-wider text-[#173B75] mb-1.5">
              Preferred Deadline (Optional)
            </label>
            <input
              id="enquiry-deadline"
              type="text"
              placeholder="e.g. Within 4 weeks"
              value={formData.deadline}
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#E6E8ED] text-sm text-[#242832] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#173B75]/20 focus:border-[#173B75] transition-all"
            />
          </div>
        </div>
      )}

      {/* Project Details */}
      <div>
        <label htmlFor="enquiry-details" className="block text-xs font-bold uppercase tracking-wider text-[#173B75] mb-1.5">
          Project Details & Goals <span className="text-[#F07822]">*</span>
        </label>
        <textarea
          id="enquiry-details"
          required
          rows={isFullContactPage ? 4 : 3}
          placeholder="Tell us about what you want to build, existing brand stage, key deliverables and target audience..."
          value={formData.details}
          onChange={e => setFormData({ ...formData, details: e.target.value })}
          className={`w-full px-4 py-3 rounded-xl border text-sm text-[#242832] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:ring-2 transition-all resize-y ${
            errors.details ? 'border-red-400 focus:ring-red-300' : 'border-[#E6E8ED] focus:ring-[#173B75]/20 focus:border-[#173B75]'
          }`}
        />
        {errors.details && <p className="text-xs text-red-600 mt-1">{errors.details}</p>}
      </div>

      {/* Privacy Consent (for Contact Page) */}
      {isFullContactPage && (
        <div>
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={e => setFormData({ ...formData, consent: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-[#F07822] focus:ring-[#F07822]"
            />
            <span className="text-xs text-[#242832]/75 leading-relaxed">
              I agree that Good Folk Solution may store and process my contact details according to their{' '}
              <button
                type="button"
                onClick={onNavigateToPrivacy}
                className="text-[#173B75] underline hover:text-[#F07822]"
              >
                Privacy Policy
              </button>{' '}
              to discuss this project.
            </span>
          </label>
          {errors.consent && <p className="text-xs text-red-600 mt-1">{errors.consent}</p>}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#F07822] hover:bg-[#d65805] text-white py-3.5 px-6 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Transmitting Enquiry to Goodfolk...</span>
          </>
        ) : (
          <>
            <span>Send Enquiry</span>
            <Send className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-[11px] text-center text-[#242832]/60 pt-1">
        We respect your privacy. No spam, ever. Direct communications with agency leadership.
      </p>
    </form>
  );
};
