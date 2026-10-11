import React from 'react';
import { CompanyProfile } from '../types';
import { Phone, MessageCircle, Mail, MapPin, ArrowDown, User, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  companyInfo: CompanyProfile;
  onRequestQuote: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  companyInfo,
  onRequestQuote,
  onExploreServices,
}) => {
  return (
    <section className="bg-white border-b border-slate-200 py-12 sm:py-16 lg:py-20 text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Main Company Identity Box */}
        <div className="space-y-6">
          
          {/* Subtitle / Company EN */}
          <div className="text-xs sm:text-sm font-bold tracking-wider text-sky-700 uppercase">
            {companyInfo.companyNameEn}
          </div>

          {/* Main Thai Company Name */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {companyInfo.companyNameTh}
          </h1>

          {/* Core Slogan from Business Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-sky-50/70 border border-sky-100 text-sky-950">
            <div className="text-base sm:text-xl font-bold">
              รับออกแบบ - เขียนแบบ - ติดตั้ง - บำรุงรักษา
            </div>
            <div className="text-sm sm:text-base font-medium text-slate-700 mt-1">
              งานระบบปรับอากาศและระบายอากาศครบวงจร
            </div>
          </div>

          {/* 5 Core Scope Items from Business Card (Clean Checklist, No Images) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              'งานระบบ AIR CONDITIONING (เครื่องปรับอากาศ)',
              'งานระบบ COLD ROOM (ห้องเย็น)',
              'งานระบบ DUCT PIPE (ท่อลม)',
              'งานระบบ CHILLER (เครื่องทำความเย็น)',
              'งานระบบของตู้แช่ทุกประเภท',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* 2 Key Contacts from Business Cards */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              ทีมผู้บริหารและผู้จัดการติดต่อโดยตรง:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {/* Contact 1: Managing Director */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{companyInfo.managingDirectorTh}</div>
                    <div className="text-[11px] text-slate-500">{companyInfo.managingDirectorEn} · MANAGING DIRECTOR</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold">
                  <a
                    href={`tel:${companyInfo.phone.replace(/[^0-9]/g, '')}`}
                    className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>โทร {companyInfo.phone}</span>
                  </a>
                  <a
                    href={`https://line.me/ti/p/~${companyInfo.lineId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>LINE: {companyInfo.lineId}</span>
                  </a>
                </div>
              </div>

              {/* Contact 2: Manager (From New Business Card) */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{companyInfo.managerTh || 'นาย ศักดิ์ดา นามวิชัย'}</div>
                    <div className="text-[11px] text-slate-500">{companyInfo.managerEn || 'MR. SUKDA NAMWICHAI'} · MANAGER</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold">
                  <a
                    href={`tel:${(companyInfo.managerPhone || '0989128541').replace(/[^0-9]/g, '')}`}
                    className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>โทร {companyInfo.managerPhone || '098-9128541'}</span>
                  </a>
                  <a
                    href={`https://line.me/ti/p/~${companyInfo.managerLineId || '0989128541'}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>LINE: {companyInfo.managerLineId || '0989128541'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Request quote action button */}
          <div className="pt-2">
            <button
              onClick={onRequestQuote}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>ขอใบเสนอราคา / นัดประเมินงานออนไลน์</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          {/* Address snippet from business card */}
          <div className="flex items-start gap-2 text-xs text-slate-500 pt-1">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{companyInfo.address}</span>
          </div>

        </div>

      </div>
    </section>
  );
};
