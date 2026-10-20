import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, ShieldCheck, ArrowRight, Download, Clock, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { downloadInvoicePDF, downloadReceiptPDF } from '../utils/pdfGenerator';
import type { Invoice, Receipt } from '../types';

interface ClientPaymentData {
  project: {
    id: string;
    clientName: string;
    projectName: string;
    services: string[];
    agreedAmount: number;
    startDate: string;
    deadline: string;
    status: string;
  };
  upiId: string;
  totalVerifiedReceived: number;
  remainingBalance: number;
  hasPendingVerification: boolean;
  payments: Array<{
    id: string;
    amount: number;
    utr: string;
    status: 'Pending Verification' | 'Verified' | 'Rejected';
    paymentDate: string;
    receiptId?: string;
  }>;
  invoices: Invoice[];
  receipts: Receipt[];
}

interface ClientPaymentPageProps {
  token: string;
  onNavigateHome: () => void;
}

export const ClientPaymentPage: React.FC<ClientPaymentPageProps> = ({ token, onNavigateHome }) => {
  const [data, setData] = useState<ClientPaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Submission Form State
  const [amount, setAmount] = useState<string>('');
  const [utr, setUtr] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/pay/${token}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Payment request not found.');
      }

      setData(json);
      // Pre-fill amount with remaining balance if > 0
      if (json.remainingBalance > 0) {
        setAmount(String(json.remainingBalance));
      }

      // Generate UPI QR Code URL
      // UPI Deep Link standard format
      const upiUrl = `upi://pay?pa=9817961412@ibl&pn=Goodfolk%20Solution&am=${json.remainingBalance || json.project.agreedAmount}&cu=INR&tn=${encodeURIComponent(json.project.projectName)}`;
      const qr = await QRCode.toDataURL(upiUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: '#123578',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qr);
    } catch (err: any) {
      setError(err.message || 'Failed to load payment information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, [token]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('9817961412@ibl');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!amount || Number(amount) <= 0) {
      setSubmitError('Please enter a valid payment amount.');
      return;
    }

    if (!utr || utr.trim().length < 6) {
      setSubmitError('Please provide a valid UTR (12-digit UPI Transaction Reference Number).');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/pay/${token}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          utr: utr.trim(),
          notes: notes.trim()
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to record transaction reference.');
      }

      setSubmitSuccess(json.message);
      setUtr('');
      setNotes('');
      // Refresh project ledger data
      fetchPaymentDetails();
    } catch (err: any) {
      setSubmitError(err.message || 'Error submitting UTR reference.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto px-4 text-center">
        <div className="w-12 h-12 border-4 border-[#123578]/20 border-t-[#ED650B] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-[#123578]">Loading Project Payment Gateway...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="pt-32 pb-20 max-w-xl mx-auto px-4 text-center">
        <div className="bg-white rounded-3xl p-8 border border-red-200 shadow-xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-[#123578]">Payment Request Expired or Not Found</h2>
          <p className="text-sm text-[#242832]/75">
            {error || 'This payment link is invalid or may have been archived.'}
          </p>
          <div className="pt-4">
            <button
              onClick={onNavigateHome}
              className="bg-[#123578] hover:bg-[#0d285b] text-white px-6 py-2.5 rounded-full text-xs font-semibold"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { project, upiId, totalVerifiedReceived, remainingBalance, payments, invoices, receipts } = data;

  return (
    <div className="pt-28 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6E8ED] shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2F9] text-[#123578] text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ED650B]" />
            Official Goodfolk Solution Direct UPI Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123578]">
            {project.projectName}
          </h1>
          <p className="text-xs sm:text-sm text-[#242832]/70 mt-1">
            Billed to: <span className="font-semibold text-[#123578]">{project.clientName}</span> · Project Ref: <span className="font-mono text-xs">{project.id}</span>
          </p>
        </div>

        {/* Invoice Download Button if available */}
        {invoices.length > 0 && (
          <button
            onClick={() => downloadInvoicePDF(invoices[0])}
            className="self-start md:self-auto bg-[#EEF2F9] hover:bg-[#123578] hover:text-white text-[#123578] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-[#123578]/20 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#ED650B]" />
            <span>Download Invoice PDF</span>
          </button>
        )}
      </div>

      {/* Ledger Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-[#F7F7F5] rounded-2xl p-5 border border-[#E6E8ED]">
          <span className="text-[11px] font-bold text-[#242832]/60 uppercase tracking-wider">
            Agreed Project Value
          </span>
          <div className="text-2xl font-black text-[#123578] mt-1">
            ₹{project.agreedAmount.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#242832]/60 mt-1 block">
            Scope milestones & dielines
          </span>
        </div>

        <div className="bg-[#F7F7F5] rounded-2xl p-5 border border-[#E6E8ED]">
          <span className="text-[11px] font-bold text-[#242832]/60 uppercase tracking-wider">
            Verified Payments Received
          </span>
          <div className="text-2xl font-black text-[#25D366] mt-1">
            ₹{totalVerifiedReceived.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#242832]/60 mt-1 block">
            Confirmed in agency bank
          </span>
        </div>

        <div className={`rounded-2xl p-5 border ${
          remainingBalance === 0
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-[#EEF2F9] border-[#123578]/20'
        }`}>
          <span className="text-[11px] font-bold text-[#123578] uppercase tracking-wider">
            Remaining Outstanding Balance
          </span>
          <div className={`text-2xl font-black mt-1 ${
            remainingBalance === 0 ? 'text-emerald-700' : 'text-[#ED650B]'
          }`}>
            ₹{remainingBalance.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#242832]/60 mt-1 block">
            {remainingBalance === 0 ? '✓ Project fully paid' : 'Due as per agreed milestones'}
          </span>
        </div>
      </div>

      {/* Main Payment Section: UPI & QR on Left, UTR Submission on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: UPI Pay & QR */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6E8ED] shadow-xl text-center space-y-5">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ED650B]">
              Step 1: Direct Transfer
            </span>
            <h3 className="text-xl font-extrabold text-[#123578]">
              Scan to Pay via Any UPI App
            </h3>
            <p className="text-xs text-[#242832]/70">
              Compatible with Google Pay, PhonePe, Paytm, BHIM, and all banking apps.
            </p>
          </div>

          {/* QR Code Container */}
          <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-[#123578]/20 inline-block shadow-inner">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="UPI Payment QR Code"
                className="w-56 h-56 mx-auto rounded-lg"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center bg-slate-50 text-xs">
                Generating QR...
              </div>
            )}
          </div>

          {/* UPI ID Box */}
          <div className="bg-[#F7F7F5] rounded-2xl p-4 border border-[#E6E8ED] text-left">
            <span className="text-[10px] uppercase font-bold text-[#242832]/60 tracking-wider block">
              Official Agency UPI ID
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-base font-bold text-[#123578]">
                {upiId}
              </span>
              <button
                onClick={handleCopyUpi}
                className="bg-white hover:bg-[#EEF2F9] text-[#123578] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-[#E6E8ED] transition-colors cursor-pointer"
              >
                {copiedUpi ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#ED650B]" />
                    <span>Copy UPI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="pt-2 text-xs text-[#242832]/60">
            Account Holder: <strong>Goodfolk Solution (Akshay)</strong>
          </div>
        </div>

        {/* Right: Submit UTR for Verification */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6E8ED] shadow-xl">
            <div className="space-y-1 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ED650B]">
                Step 2: Verification
              </span>
              <h3 className="text-xl font-extrabold text-[#123578]">
                Submit Payment UTR Reference
              </h3>
              <p className="text-xs text-[#242832]/75 leading-relaxed">
                After completing your payment in your UPI app, enter your 12-digit UTR reference number below. The agency owner will verify this in our bank account and issue your verified payment receipt.
              </p>
            </div>

            {submitSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm mb-5 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Transaction Reference Submitted</div>
                  <div className="mt-0.5 text-xs text-emerald-700">{submitSuccess}</div>
                </div>
              </div>
            )}

            {submitError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm mb-5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitUtr} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#123578] mb-1.5">
                  Amount Transferred (INR) <span className="text-[#ED650B]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-sm font-semibold text-[#123578]">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="Enter transferred amount"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-[#E6E8ED] text-sm text-[#242832] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123578]/20 focus:border-[#123578]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#123578] mb-1.5">
                  UPI UTR / Bank Reference Number <span className="text-[#ED650B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 428819034112 (12-digit reference from UPI app)"
                  value={utr}
                  onChange={e => setUtr(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E6E8ED] text-sm font-mono text-[#242832] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123578]/20 focus:border-[#123578]"
                />
                <p className="text-[11px] text-[#242832]/60 mt-1">
                  Located in your UPI app receipt under 'UPI Transaction ID' or 'UTR'.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#123578] mb-1.5">
                  Notes / Milestone Context (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 50% Advance milestone / Final label approval"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E6E8ED] text-sm text-[#242832] bg-[#F7F7F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#123578]/20 focus:border-[#123578]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#123578] hover:bg-[#0d285b] text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? 'Transmitting UTR...' : 'Submit Transaction for Verification'}
                <ArrowRight className="w-4 h-4 text-[#ED650B]" />
              </button>
            </form>
          </div>

          {/* Payment History & Verified Receipts for This Project */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6E8ED] shadow-sm space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#123578]">
              Transaction History for this Project
            </h4>

            {payments.length === 0 ? (
              <p className="text-xs text-[#242832]/60 italic py-2">
                No payment transactions recorded yet.
              </p>
            ) : (
              <div className="divide-y divide-[#E6E8ED] text-xs">
                {payments.map(p => {
                  const receipt = receipts.find(r => r.paymentId === p.id);

                  return (
                    <div key={p.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-[#123578]">
                          ₹{p.amount.toLocaleString('en-IN')}
                        </div>
                        <div className="font-mono text-[11px] text-[#242832]/70">
                          UTR: {p.utr} · {new Date(p.paymentDate).toLocaleDateString('en-IN')}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            p.status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700'
                              : p.status === 'Rejected'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {p.status}
                        </span>

                        {p.status === 'Verified' && receipt && (
                          <button
                            onClick={() => downloadReceiptPDF(receipt)}
                            className="text-[#123578] hover:text-[#ED650B] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Receipt PDF</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
