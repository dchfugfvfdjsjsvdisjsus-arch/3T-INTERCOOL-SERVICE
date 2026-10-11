import React from 'react';
import { Logo } from './Logo';
import { CompanyProfile } from '../types';
import { Phone, MessageCircle, Mail, MapPin, ShieldCheck } from 'lucide-react';

interface FooterProps {
  companyInfo: CompanyProfile;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ companyInfo, onOpenAdmin }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <div>
            <div className="text-base sm:text-lg font-bold text-white">
              {companyInfo.companyNameTh}
            </div>
            <div className="text-xs text-slate-400">
              {companyInfo.companyNameEn}
            </div>
            <div className="text-xs text-slate-400 mt-2 space-y-0.5">
              <div>กรรมการผู้จัดการ: <span className="text-white font-medium">{companyInfo.managingDirectorTh}</span> (Managing Director)</div>
              <div>ผู้จัดการ: <span className="text-white font-medium">{companyInfo.managerTh || 'นาย ศักดิ์ดา นามวิชัย'}</span> (Manager)</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2">
              <a
                href={`tel:${companyInfo.phone.replace(/[^0-9]/g, '')}`}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                title="โทรหาคุณธวัชชัย (MD)"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>{companyInfo.phone}</span>
              </a>
              <a
                href={`tel:${(companyInfo.managerPhone || '0989128541').replace(/[^0-9]/g, '')}`}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                title="โทรหาคุณศักดิ์ดา (Manager)"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>{companyInfo.managerPhone || '098-9128541'}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {companyInfo.companyNameEn}. สงวนลิขสิทธิ์.
          </div>

          <button
            onClick={onOpenAdmin}
            className="hover:text-slate-300 flex items-center gap-1.5 cursor-pointer text-left"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>ระบบจัดการข้อมูล (Admin)</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
