import { jsPDF } from 'jspdf';
import type { Invoice, Receipt } from '../types';

export function downloadInvoicePDF(invoice: Invoice) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Background bar
  doc.setFillColor(18, 53, 120); // #123578 Navy
  doc.rect(0, 0, pageWidth, 90, 'F');

  // Title in header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('GOODFOLK SOLUTION', 40, 48);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(237, 101, 11); // #ED650B Orange
  doc.text('Creative Advertising, Branding & Digital Marketing', 40, 68);

  // Invoice label
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('INVOICE', pageWidth - 140, 52);

  // Invoice meta
  doc.setTextColor(36, 40, 50); // Charcoal
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Invoice No:`, pageWidth - 200, 120);
  doc.text(`Issue Date:`, pageWidth - 200, 138);
  doc.text(`Due Date:`, pageWidth - 200, 156);
  doc.text(`Status:`, pageWidth - 200, 174);

  doc.setFont('helvetica', 'normal');
  doc.text(invoice.id, pageWidth - 120, 120);
  doc.text(invoice.issueDate, pageWidth - 120, 138);
  doc.text(invoice.dueDate, pageWidth - 120, 156);
  doc.text(invoice.status, pageWidth - 120, 174);

  // Bill To
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(18, 53, 120);
  doc.text('BILLED TO:', 40, 120);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(36, 40, 50);
  doc.text(invoice.clientName, 40, 140);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 85, 95);
  if (invoice.contactEmail) doc.text(`Email: ${invoice.contactEmail}`, 40, 156);
  if (invoice.contactPhone) doc.text(`Phone: ${invoice.contactPhone}`, 40, 172);
  doc.text(`Project: ${invoice.projectName}`, 40, 188);

  // Divider line
  doc.setDrawColor(230, 232, 237);
  doc.setLineWidth(1);
  doc.line(40, 210, pageWidth - 40, 210);

  // Table header
  doc.setFillColor(247, 247, 245);
  doc.rect(40, 220, pageWidth - 80, 26, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(18, 53, 120);
  doc.text('DESCRIPTION / DELIVERABLES', 50, 237);
  doc.text('AMOUNT (INR)', pageWidth - 140, 237);

  // Line items
  let y = 265;
  invoice.lineItems.forEach((item, idx) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(36, 40, 50);
    doc.text(`${idx + 1}. ${item.description}`, 50, y);
    doc.text(`Rs. ${item.amount.toLocaleString('en-IN')}`, pageWidth - 140, y);
    y += 24;
  });

  // Divider
  doc.setDrawColor(230, 232, 237);
  doc.line(40, y + 10, pageWidth - 40, y + 10);

  // Total
  y += 35;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(18, 53, 120);
  doc.text('Total Agreed Amount:', pageWidth - 260, y);
  doc.setTextColor(237, 101, 11);
  doc.text(`Rs. ${invoice.amount.toLocaleString('en-IN')}`, pageWidth - 140, y);

  // Payment Instructions
  y += 50;
  doc.setFillColor(238, 242, 249);
  doc.roundedRect(40, y, pageWidth - 80, 110, 6, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(18, 53, 120);
  doc.text('UPI PAYMENT INSTRUCTIONS', 55, y + 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(36, 40, 50);
  doc.text('Goodfolk Solution accepts payments strictly via direct UPI transfer.', 55, y + 45);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(237, 101, 11);
  doc.text(`Official UPI ID: 9817961412@ibl`, 55, y + 65);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 85, 95);
  doc.text('After transferring via any UPI app (GPay, PhonePe, Paytm, BHIM), please submit', 55, y + 85);
  doc.text('the 12-digit UTR reference number on your project link to receive your verified receipt.', 55, y + 98);

  // Footer notes
  doc.setFontSize(9);
  doc.setTextColor(140, 145, 155);
  doc.text('akshay@goodfolksolution.in  |  +91 9817961412  |  goodfolksolution.in', pageWidth / 2, 800, { align: 'center' });

  doc.save(`${invoice.id}-${invoice.clientName.replace(/\s+/g, '_')}.pdf`);
}

export function downloadReceiptPDF(receipt: Receipt) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header bar
  doc.setFillColor(18, 53, 120); // Navy
  doc.rect(0, 0, pageWidth, 90, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('GOODFOLK SOLUTION', 40, 48);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(237, 101, 11);
  doc.text('Creative Advertising, Branding & Digital Marketing', 40, 68);

  // Receipt badge
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('PAYMENT RECEIPT', pageWidth - 200, 52);

  // Status banner
  doc.setFillColor(238, 242, 249);
  doc.rect(0, 90, pageWidth, 30, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(18, 53, 120);
  doc.text('STATUS: VERIFIED BY WEBSITE OWNER IN BANK ACCOUNT', 40, 108);

  // Meta
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(36, 40, 50);
  doc.text('Receipt No:', pageWidth - 210, 150);
  doc.text('Verified Date:', pageWidth - 210, 168);
  doc.text('Payment Method:', pageWidth - 210, 186);
  doc.text('Bank UPI UTR:', pageWidth - 210, 204);

  doc.setFont('helvetica', 'normal');
  doc.text(receipt.id, pageWidth - 110, 150);
  doc.text(new Date(receipt.verifiedDate).toLocaleDateString('en-IN'), pageWidth - 110, 168);
  doc.text('Direct UPI (9817961412@ibl)', pageWidth - 110, 186);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(237, 101, 11);
  doc.text(receipt.utr, pageWidth - 110, 204);

  // Received from
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(18, 53, 120);
  doc.text('RECEIVED FROM:', 40, 150);

  doc.setFontSize(14);
  doc.setTextColor(36, 40, 50);
  doc.text(receipt.clientName, 40, 172);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 85, 95);
  doc.text(`Project ID: ${receipt.projectId}`, 40, 190);
  if (receipt.invoiceId) doc.text(`Associated Invoice: ${receipt.invoiceId}`, 40, 206);

  // Amount box
  doc.setFillColor(247, 247, 245);
  doc.roundedRect(40, 240, pageWidth - 80, 75, 6, 6, 'F');
  doc.setDrawColor(230, 232, 237);
  doc.roundedRect(40, 240, pageWidth - 80, 75, 6, 6, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(18, 53, 120);
  doc.text('AMOUNT RECEIVED & VERIFIED', 60, 265);

  doc.setFontSize(22);
  doc.setTextColor(237, 101, 11);
  doc.text(`Rs. ${receipt.amountReceived.toLocaleString('en-IN')}`, 60, 295);

  // Financial Ledger breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(18, 53, 120);
  doc.text('PROJECT FINANCIAL LEDGER SUMMARY', 40, 350);

  doc.setDrawColor(230, 232, 237);
  doc.line(40, 360, pageWidth - 40, 360);

  doc.setFontSize(10);
  doc.setTextColor(80, 85, 95);
  doc.setFont('helvetica', 'normal');
  doc.text('Agreed Project Value:', 40, 385);
  doc.text('Total Verified Payments to Date:', 40, 405);
  doc.text('Remaining Balance Due:', 40, 425);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(36, 40, 50);
  doc.text(`Rs. ${receipt.agreedProjectAmount.toLocaleString('en-IN')}`, pageWidth - 140, 385);
  doc.text(`Rs. ${receipt.totalVerifiedPaid.toLocaleString('en-IN')}`, pageWidth - 140, 405);

  doc.setTextColor(receipt.remainingBalance === 0 ? 18 : 237, receipt.remainingBalance === 0 ? 53 : 101, receipt.remainingBalance === 0 ? 120 : 11);
  doc.text(`Rs. ${receipt.remainingBalance.toLocaleString('en-IN')}`, pageWidth - 140, 425);

  if (receipt.isFinalReceipt) {
    doc.setFillColor(238, 242, 249);
    doc.roundedRect(40, 460, pageWidth - 80, 50, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(18, 53, 120);
    doc.text('FINAL PAYMENT CONFIRMATION', 55, 485);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('This project has been fully paid in full as per agreed terms. Thank you for your partnership!', 55, 500);
  }

  // Footer notes
  doc.setFontSize(9);
  doc.setTextColor(140, 145, 155);
  doc.text('Goodfolk Solution  |  akshay@goodfolksolution.in  |  UPI: 9817961412@ibl', pageWidth / 2, 800, { align: 'center' });

  doc.save(`${receipt.id}-${receipt.clientName.replace(/\s+/g, '_')}.pdf`);
}
