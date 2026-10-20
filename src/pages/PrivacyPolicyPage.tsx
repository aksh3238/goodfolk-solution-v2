import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E6E8ED] shadow-sm space-y-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-[#ED650B]">
            Legal Information
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123578] mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#242832]/60 mt-2 font-mono">
            Last Updated: October 2026 · Goodfolk Solution (goodfolksolution.in)
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-[#242832]/85 space-y-4 text-sm leading-relaxed">
          <p>
            At <strong>Goodfolk Solution</strong> ("we", "our", or "us"), accessible from goodfolksolution.in, one of our main priorities is the privacy of our website visitors and clients. This Privacy Policy outlines the types of information we collect and how we utilize it.
          </p>

          <h2 className="text-lg font-bold text-[#123578] pt-3">1. Information We Collect</h2>
          <p>
            When you submit an enquiry through our website forms or engage with our team, we collect personal and business information that you voluntarily provide, including:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your full name and company/brand name</li>
            <li>Business email address</li>
            <li>Mobile phone number (for WhatsApp and telephonic project correspondence)</li>
            <li>Project requirements, scope preferences, and estimated budgets</li>
          </ul>

          <h2 className="text-lg font-bold text-[#123578] pt-3">2. How We Use Your Information</h2>
          <p>We use the collected information strictly for legitimate commercial purposes:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>To review, assess, and formulate tailored proposals and quotations for creative work</li>
            <li>To communicate project milestones, revisions, and deliverable reviews</li>
            <li>To generate and issue project invoices and verified payment receipts</li>
            <li>To comply with regulatory accounting and taxation requirements</li>
          </ul>

          <h2 className="text-lg font-bold text-[#123578] pt-3">3. Client Financial Privacy & UPI Protection</h2>
          <p>
            We enforce strict client privacy boundaries. We do not store credit card credentials, bank net-banking passwords, or third-party wallet access. All client payments are conducted exclusively through direct user-to-merchant UPI (Unified Payments Interface) transfers to our official ID <strong>9817961412@ibl</strong>. Financial transaction reference numbers (UTRs) are used solely for bank verification and generating verified receipts. Individual client project balances and invoices are never accessible to public users or third parties.
          </p>

          <h2 className="text-lg font-bold text-[#123578] pt-3">4. Information Sharing & Third Parties</h2>
          <p>
            We do not sell, trade, rent, or lease your personal identification information to any third parties or marketing brokers. Information is shared only with direct personnel required to execute your creative deliverables.
          </p>

          <h2 className="text-lg font-bold text-[#123578] pt-3">5. Data Retention & Security</h2>
          <p>
            We implement industry-standard physical, electronic, and administrative procedures to safeguard and secure the information we collect online.
          </p>

          <h2 className="text-lg font-bold text-[#123578] pt-3">6. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to request data updates, please contact our data controller directly at{' '}
            <a href="mailto:akshay@goodfolksolution.in" className="text-[#123578] font-semibold underline">
              akshay@goodfolksolution.in
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};
