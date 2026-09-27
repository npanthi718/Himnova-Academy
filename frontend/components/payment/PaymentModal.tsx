'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Tag,
  ShieldCheck,
  X,
  Sparkles,
  ArrowRight,
  RefreshCw,
  QrCode,
  Upload,
  Clock,
  Building,
  Phone,
  User,
  Hash,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface PaymentModalProps {
  course: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  course,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const router = useRouter();
  const [paymentMode, setPaymentMode] = useState<'QR' | 'GATEWAY'>('QR');
  const [gatewayProvider, setGatewayProvider] = useState<'ESEWA' | 'KHALTI'>('ESEWA');
  
  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<any | null>(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  
  // Manual QR Form State
  const [transactionCode, setTransactionCode] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [bankWalletName, setBankWalletName] = useState('eSewa / Fonepay');
  const [receiptScreenshotUrl, setReceiptScreenshotUrl] = useState('');
  const [formError, setFormError] = useState('');

  // Processing & Status
  const [isProcessing, setIsProcessing] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any | null>(null);
  const [instantSuccess, setInstantSuccess] = useState(false);

  if (!isOpen || !course) return null;

  const basePrice = course.discountPrice !== null && course.discountPrice !== undefined ? course.discountPrice : course.price;
  const discountAmount = couponApplied ? couponApplied.estimatedDiscount : 0;
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await api.validateCoupon(couponCode, course.id, basePrice);
      setCouponApplied(res);
    } catch (err: any) {
      setCouponApplied(null);
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleManualQrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionCode.trim() || !senderName.trim() || !bankWalletName.trim()) {
      setFormError('Please enter Transaction ID, Sender Name, and Bank/Wallet Name.');
      return;
    }

    setFormError('');
    setIsProcessing(true);
    try {
      const claim = await api.submitManualQrClaim({
        courseId: course.id,
        amount: finalPrice,
        transactionCode: transactionCode.trim(),
        senderName: senderName.trim(),
        senderPhone: senderPhone.trim() || undefined,
        bankWalletName: bankWalletName.trim(),
        receiptScreenshotUrl: receiptScreenshotUrl.trim() || undefined,
        couponCode: couponApplied ? couponApplied.coupon.code : undefined,
      });

      setSubmissionSuccess(claim);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit payment verification claim.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInstantCheckout = async () => {
    setIsProcessing(true);
    try {
      const res = await api.initiatePayment({
        courseId: course.id,
        provider: gatewayProvider,
        couponCode: couponApplied ? couponApplied.coupon.code : undefined,
      });

      await api.verifyPayment({
        orderId: res.orderId,
        provider: gatewayProvider,
        payload: {
          transaction_code: `${gatewayProvider}-REF-${Date.now()}`,
          status: 'COMPLETE',
        },
      });

      setInstantSuccess(true);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        router.push(`/learn/${course.slug}`);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || 'Payment initiation failed');
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl my-8 rounded-3xl border border-white/15 bg-alpine-900/95 p-6 sm:p-8 shadow-2xl shadow-brand-cyan/20 backdrop-blur-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Status: Manual Claim Submitted */}
        {submissionSuccess ? (
          <div className="text-center py-6 space-y-5">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 animate-pulse">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white">Payment Claim Submitted!</h3>
            
            <div className="p-4 rounded-2xl bg-alpine-950/80 border border-emerald-500/30 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Order Reference:</span>
                <span className="text-brand-cyan font-bold">{submissionSuccess.orderId}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Transaction ID:</span>
                <span className="text-white font-bold">{submissionSuccess.transactionCode}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Course:</span>
                <span className="text-white">{course.title}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Amount:</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(submissionSuccess.amount)}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left flex gap-3">
              <Clock className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Verification in Progress (30 mins – 1 hour):</p>
                <p className="text-slate-300 leading-relaxed">
                  Our admin finance team will review your transaction code and screenshot. You will receive a confirmation email and your dashboard course player will be activated immediately upon approval.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                router.push('/student/billing');
              }}
              className="w-full py-3.5 rounded-2xl bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan font-bold text-sm hover:bg-brand-cyan/30 transition-all"
            >
              View Billing & Status in Dashboard
            </button>
          </div>
        ) : instantSuccess ? (
          <div className="text-center py-8 space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white">Enrollment Confirmed!</h3>
            <p className="text-slate-300 text-sm">
              Your payment for <span className="text-brand-cyan font-semibold">{course.title}</span> has been verified. Redirecting to your Course Player...
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div>
              <span className="px-2.5 py-1 text-[10px] font-mono font-bold rounded-full bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 uppercase">
                Secure Admission Gateway
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-2">
                Enroll in {course.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Himnova Technologies Pvt. Ltd. Official Enrollment & Account Portal
              </p>
            </div>

            {/* Payment Mode Switcher */}
            <div className="flex rounded-2xl bg-alpine-950 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setPaymentMode('QR')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-2 transition-all ${
                  paymentMode === 'QR'
                    ? 'bg-brand-cyan text-alpine-950 shadow-md shadow-brand-cyan/20 font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="h-4 w-4" />
                <span>QR Scanner & Manual Claim</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('GATEWAY')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-2 transition-all ${
                  paymentMode === 'GATEWAY'
                    ? 'bg-brand-cyan text-alpine-950 shadow-md shadow-brand-cyan/20 font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Instant Wallet / Sandbox</span>
              </button>
            </div>

            {/* Coupon Code Section */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase font-bold text-slate-300">
                Apply Promo / Referral Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME10, AI2026"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 focus:border-brand-cyan focus:outline-none text-xs font-mono uppercase text-white placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={validatingCoupon || !couponCode.trim()}
                  className="px-4 py-2.5 rounded-xl bg-alpine-800 hover:bg-alpine-700 text-slate-200 border border-white/10 text-xs font-bold disabled:opacity-40"
                >
                  {validatingCoupon ? 'Checking...' : 'Apply'}
                </button>
              </div>
              {couponApplied && (
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Coupon &quot;{couponApplied.coupon.code}&quot; applied: -{formatCurrency(discountAmount)}
                </p>
              )}
              {couponError && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {couponError}
                </p>
              )}
            </div>

            {/* Price Summary Box */}
            <div className="p-4 rounded-2xl bg-alpine-950/90 border border-white/10 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Course Tuition</span>
                <span>{formatCurrency(basePrice)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                <span>Total Amount Due</span>
                <span className="text-brand-cyan font-extrabold">{formatCurrency(finalPrice)}</span>
              </div>
            </div>

            {/* TAB 1: QR SCANNER & MANUAL VERIFICATION CLAIM */}
            {paymentMode === 'QR' ? (
              <form onSubmit={handleManualQrSubmit} className="space-y-4">
                {/* Official QR Code Box */}
                <div className="p-4 rounded-2xl bg-alpine-950 border border-brand-cyan/30 text-center space-y-3">
                  <div className="text-xs font-bold text-brand-cyan uppercase tracking-wider flex items-center justify-center gap-1.5">
                    <QrCode className="h-4 w-4" />
                    <span>Official Himnova Payment QR</span>
                  </div>
                  
                  <div className="relative w-48 h-48 mx-auto rounded-xl overflow-hidden border-2 border-white/20 bg-white p-2 shadow-xl shadow-brand-cyan/10">
                    <img
                      src="/logos/qr-code.jpeg"
                      alt="Himnova Technologies Official Payment QR Scanner"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>

                  <div className="text-[11px] text-slate-300">
                    <p className="font-bold text-white">Himnova Technologies Pvt. Ltd.</p>
                    <p className="text-slate-400">Scan via Fonepay, eSewa, Khalti, IME Pay or any Mobile Banking App</p>
                    <p className="text-brand-cyan font-mono font-bold mt-1">Amount to transfer: {formatCurrency(finalPrice)}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase font-mono text-slate-300">
                    Step 2: Submit Verification Details
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">
                        Transaction ID / Ref Code *
                      </label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={transactionCode}
                          onChange={(e) => setTransactionCode(e.target.value)}
                          placeholder="e.g. TXN98765432"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-alpine-850 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">
                        Sender Account Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="e.g. Ramesh Sharma"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-alpine-850 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">
                        Bank or Wallet Name *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={bankWalletName}
                          onChange={(e) => setBankWalletName(e.target.value)}
                          placeholder="e.g. eSewa, Nabil, Global IME"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-alpine-850 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">
                        Sender Phone / Account No.
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          value={senderPhone}
                          onChange={(e) => setSenderPhone(e.target.value)}
                          placeholder="e.g. 9841XXXXXX"
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-alpine-850 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Payment Receipt / Screenshot Link
                    </label>
                    <div className="relative">
                      <Upload className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        value={receiptScreenshotUrl}
                        onChange={(e) => setReceiptScreenshotUrl(e.target.value)}
                        placeholder="Image URL or drive link (optional)"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-alpine-850 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {formError && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> {formError}
                  </p>
                )}

                {/* Important Notice */}
                <div className="p-3.5 rounded-xl bg-alpine-950/90 border border-brand-cyan/20 text-[11px] text-slate-300 flex items-start gap-2">
                  <Clock className="h-4 w-4 text-brand-cyan shrink-0 mt-0.5" />
                  <span>
                    <strong>Verification SLA:</strong> Admin will verify your payment in <strong>30 minutes to 1 hour</strong>. You will receive a confirmation email and your dashboard access will be unlocked.
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white text-sm font-bold shadow-xl shadow-brand-cyan/25 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
                >
                  <span className="pointer-events-none absolute inset-0 btn-shine" aria-hidden="true"></span>
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Submitting Claim to Admin...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Payment Claim for Verification</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* TAB 2: INSTANT WALLET CHECKOUT */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGatewayProvider('ESEWA')}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      gatewayProvider === 'ESEWA'
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                        : 'border-white/10 bg-alpine-850 hover:bg-alpine-800'
                    }`}
                  >
                    <div className="h-8 w-8 rounded-lg bg-[#60BB46] flex items-center justify-center font-extrabold text-white text-xs">
                      eS
                    </div>
                    <span className="text-xs font-bold text-white">eSewa ePay</span>
                    <span className="text-[10px] text-slate-400">Direct Sandbox Flow</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGatewayProvider('KHALTI')}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                      gatewayProvider === 'KHALTI'
                        ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                        : 'border-white/10 bg-alpine-850 hover:bg-alpine-800'
                    }`}
                  >
                    <div className="h-8 w-8 rounded-lg bg-[#5C2D91] flex items-center justify-center font-extrabold text-white text-xs">
                      Kh
                    </div>
                    <span className="text-xs font-bold text-white">Khalti Wallet</span>
                    <span className="text-[10px] text-slate-400">Direct Sandbox Flow</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Idempotent SSL 256-bit encrypted checkout with instant course activation.</span>
                </div>

                <button
                  onClick={handleInstantCheckout}
                  disabled={isProcessing}
                  className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white text-sm font-bold shadow-xl shadow-brand-cyan/25 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
                >
                  <span className="pointer-events-none absolute inset-0 btn-shine" aria-hidden="true"></span>
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Processing Payment Verification...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay {formatCurrency(finalPrice)} & Launch Now</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
