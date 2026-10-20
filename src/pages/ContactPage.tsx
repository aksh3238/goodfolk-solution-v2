import React, { useState } from 'react';
import { EnquiryForm } from '../components/EnquiryForm';
import { Mail, Phone, ChevronDown, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';
import { DynamicCustomSections } from '../components/DynamicCustomSections';

interface ContactPageProps {
  onNavigateToPrivacy: () => void;
  onOpenLetsTalk: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigateToPrivacy, onOpenLetsTalk }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { siteContent, customSections } = useSiteContent();

  const functionalWaUrl = `https://wa.me/${(siteContent.functionalPhoneDestination || siteContent.contactWhatsapp || '919817961412').replace(/[^0-9]/g, '')}`;

  const contactFaqs = [
    {
      q: 'What information should I include in my enquiry?',
      a: 'Helpful details include your current brand stage, core products or services, key deliverables required (such as packaging dielines, logo, or ad creatives), preferred timeline, and any existing brand assets or reference styles you admire.'
    },
    {
      q: 'How do you determine project pricing?',
      a: 'Pricing is customized based on project scope, number of SKUs or creative variations, complexity, and timeline. After reviewing your brief, we provide an itemized formal quotation with transparent milestone terms.'
    },
    {
      q: 'Do you require an advance payment?',
      a: 'Yes, standard industry practice for creative production is an initial milestone advance (typically 50% before work commences), with the balance due upon final review and approval before master print-ready assets are transferred. All payments are verified via direct UPI.'
    },
    {
      q: 'Can I discuss multiple services in one enquiry?',
      a: 'Absolutely. Many of our clients combine branding, packaging, Amazon A+ content, and paid advertising creatives into a unified project. Simply outline your multi-disciplinary needs in the project details field.'
    },
    {
      q: 'Do you work with international clients?',
      a: 'Yes! We collaborate with brands across the globe. We coordinate via video calls, email, and WhatsApp, and handle international timezones with structured project management.'
    }
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFF8] text-[#173B75] text-xs font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F07822]" />
          Project Inquiries
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#173B75] tracking-tight">
          Let's Start a Conversation.
        </h1>

        <p className="mt-4 text-base sm:text-lg text-[#252A34]/80 max-w-2xl mx-auto leading-relaxed">
          Tell us about your project, your goals and what you need help creating. We'll use the details to understand your requirements and plan the next step.
        </p>
      </section>

      {/* Main Grid: Form on left, Contact info & Process on right */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Form: 10 fields as required */}
          <div className="lg:col-span-7">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-[#173B75]">Project Brief Submission</h2>
              <p className="text-xs text-[#252A34]/70 mt-1">
                Fill in the details below. Both mobile number and email are verified to prepare your quotation.
              </p>
            </div>
            <EnquiryForm isFullContactPage={true} onNavigateToPrivacy={onNavigateToPrivacy} />
          </div>

          {/* Right Information Column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Direct Contact Cards */}
            <div className="bg-[#FFF9F1] rounded-3xl p-6 sm:p-8 border border-[#E4D8C8] space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#173B75]">
                Direct Contact Channels
              </h3>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#173B75] text-white flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#F07822]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#252A34]/60 font-medium">Business Inquiries</div>
                    <a
                      href={`mailto:${siteContent.contactEmail || 'akshay@goodfolksolution.in'}`}
                      className="text-sm font-semibold text-[#173B75] hover:text-[#F07822] transition-colors"
                    >
                      {siteContent.contactEmail || 'akshay@goodfolksolution.in'}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#252A34]/60 font-medium">WhatsApp Direct Line</div>
                    <a
                      href={functionalWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[#173B75] hover:text-[#F07822] transition-colors font-mono tracking-wide"
                    >
                      {siteContent.contactPhone || '0000000'}
                    </a>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#E1306C]/20 text-[#E1306C] flex items-center justify-center shrink-0">
                    {/* Instagram SVG */}
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-[#252A34]/60 font-medium">Instagram Studio Profile</div>
                    <a
                      href={siteContent.contactInstagram || 'https://www.instagram.com/goodfolksolution/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[#173B75] hover:text-[#F07822] transition-colors"
                    >
                      {siteContent.contactInstagram?.replace('https://www.instagram.com/', '@').replace(/\/$/, '') || '@goodfolksolution'}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E4D8C8]">
                <button
                  onClick={onOpenLetsTalk}
                  className="w-full bg-[#173B75] hover:bg-[#123163] text-white py-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open Quick Contact Modal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F07822]" />
                </button>
              </div>
            </div>

            {/* What Happens Next? */}
            <div className="bg-[#E8EFF8]/60 rounded-3xl p-6 sm:p-8 border border-[#173B75]/10 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#173B75]">
                What Happens Next?
              </h3>
              <ol className="space-y-3.5 text-xs text-[#252A34]/85">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#173B75] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span><strong>We review your enquiry</strong>: Our creative leads review your brand context, products, and objectives.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#173B75] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span><strong>We clarify project requirements</strong>: We reach out via email or phone to confirm deliverable quantities and specifics.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#173B75] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span><strong>We prepare a quotation and timeline</strong>: Itemized breakdown covering research, design, revisions, and final dielines.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#173B75] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    4
                  </span>
                  <span><strong>Work begins</strong>: After scope, deliverables and transparent UPI payment terms are agreed, work kicks off immediately.</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC CMS CUSTOM SECTIONS (Contact Page) */}
      {customSections && customSections.length > 0 && (
        <DynamicCustomSections
          sections={customSections.filter(s => s.page === 'contact' || s.page === 'global')}
          onOpenLetsTalk={onOpenLetsTalk}
        />
      )}

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F07822]">
            Inquiry Guide
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B75] mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3.5">
          {contactFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-[#E4D8C8] rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-[#173B75] hover:text-[#F07822] transition-colors focus-visible:outline-none cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#F07822] transition-transform duration-200 shrink-0 ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#252A34]/80 leading-relaxed border-t border-[#E4D8C8]/50 bg-[#FFF9F1]/50 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
