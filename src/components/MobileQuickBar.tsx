import React from 'react';
import { Phone, MessageCircle, Calculator, ShieldCheck } from 'lucide-react';

interface MobileQuickBarProps {
  phone: string;
  lineId: string;
  onRequestQuote: () => void;
  onOpenAdmin: () => void;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  phone,
  lineId,
  onRequestQuote,
  onOpenAdmin,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-2xl sm:hidden">
      <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
        {/* Call Now */}
        <a
          href={`tel:${phone.replace(/[^0-9]/g, '')}`}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 transition-colors"
        >
          <Phone className="w-5 h-5 text-orange-600 mb-0.5" />
          <span className="text-[10px] font-bold">โทรด่วน</span>
        </a>

        {/* LINE Chat */}
        <a
          href={`https://line.me/ti/p/~${lineId}`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
        >
          <MessageCircle className="w-5 h-5 text-emerald-600 mb-0.5" />
          <span className="text-[10px] font-bold">แชท LINE</span>
        </a>

        {/* Request Quote */}
        <button
          onClick={onRequestQuote}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition-colors cursor-pointer"
        >
          <Calculator className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold">ขอราคา</span>
        </button>

        {/* Admin Portal */}
        <button
          onClick={onOpenAdmin}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-5 h-5 text-sky-700 mb-0.5" />
          <span className="text-[10px] font-bold">ระบบจัดการ</span>
        </button>
      </div>
    </div>
  );
};
