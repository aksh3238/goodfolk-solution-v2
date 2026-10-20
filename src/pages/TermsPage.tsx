import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E6E8ED] shadow-sm space-y-6">
        <div>
          <span className="text-xs font-mono font-bold uppercase text-[#ED650B]">
            Legal Information
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123578] mt-1">
            Terms & Conditions
          </h1>
          <p className="text-xs text-[#242832]/60 mt-2 font-mono">
            Effective Date: October 2026 · Goodfolk Solution (goodfolksolution.in)
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-[#242832]/85 space-y-4 text-sm leading-relaxed">
          <p>
            Welcome to <strong>Goodfolk Solution</strong>. By accessing this website or commissioning our creative services, you agree to be bound by the following Terms and Conditions.
          </p>

          <h2 className="text-lg font-bold text-[#123578] pt-3">1. Scope of Creative Engagements</h2>
          <p>
            Goodfolk Solution delivers creative advertising, branding, packaging design, performance marketing assets, video editing, and digital marketing services. Specific project deliverables, revisions, timelines, and milestones are outlined in individual project proposals and invoices.
          </p>

          <h2 className="text-lg font-bold text-[#123578] pt-3">2. Payment Terms & UPI Processing</h2>
          <p>
            Unless explicitly modified in writing, all services require an agreed advance payment (typically 50%) prior to project initiation, with the remaining balance due upon final artwork approval and prior to release of production-ready source files and dielines.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Payments are accepted exclusively via direct UPI to <strong>9817961412@ibl</strong>.</li>
            <li>Clients must submit the authentic 12-digit UPI transaction reference (UTR) on their private project payment link for owner verification.</li>
            <li>Payments are only marked confirmed and credited toward the project balance after verification in our commercial bank account.</li>
          </ul>

          <h2 className="text-lg font-bold text-[#123578] pt-3">3. Intellectual Property & Ownership</h2>
          <p>
            Upon receipt of 100% verified payment in full, all agreed final creative deliverables, vector dielines, and approved assets become the exclusive property of the client. Preliminary sketches, discarded concept directions, and proprietary agency toolkits remain the intellectual property of Goodfolk Solution.
          </p>

          <h2 className="text-lg font-bold text-[#123578] pt-3">4. Revisions & Approvals</h2>
          <p>
            Each creative phase incorporates specified revision rounds agreed upon in the project scope. Substantial deviations or changes in fundamental project direction requested after sign-off will be quoted as additional scope.
          </p>

          <h2 className="text-lg font-bold text-[#123578] pt-3">5. Contact & Inquiries</h2>
          <p>
            For questions regarding these terms, reach our business operations at{' '}
            <a href="mailto:akshay@goodfolksolution.in" className="text-[#123578] font-semibold underline">
              akshay@goodfolksolution.in
            </a>{' '}
            or WhatsApp +91 9817961412.
          </p>
        </div>
      </div>
    </div>
  );
};
