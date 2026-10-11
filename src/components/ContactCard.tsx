import React, { useState } from 'react';
import { CompanyProfile } from '../types';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Copy,
  Check,
  Navigation,
  User,
} from 'lucide-react';

interface ContactCardProps {
  companyInfo: CompanyProfile;
}

export const ContactCard: React.FC<ContactCardProps> = ({ companyInfo }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'หมู่บ้านพฤกษา51 ซอยฉลองกรุง53 ลำปลาทิว ลาดกระบัง กรุงเทพมหานคร'
  )}`;

  const managerNameTh = companyInfo.managerTh || 'นาย ศักดิ์ดา นามวิชัย';
  const managerNameEn = companyInfo.managerEn || 'MR. SUKDA NAMWICHAI';
  const managerPhone = companyInfo.managerPhone || '098-9128541';
  const managerLineId = companyInfo.managerLineId || '0989128541';

  return (
    <section id="contact" className="py-14 sm:py-18 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-left">
        
        {/* Simple Title */}
        <div className="mb-8 space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            ช่องทางการติดต่อ
          </h2>
          <p className="text-sm text-slate-600">
            {companyInfo.companyNameTh} ({companyInfo.companyNameEn})
          </p>
        </div>

        {/* 2 Personnel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          
          {/* Person 1: Managing Director (Tawatchai Baraphom) */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-sky-700 font-bold uppercase tracking-wider">MANAGING DIRECTOR</div>
                <div className="text-base font-bold text-slate-900">{companyInfo.managingDirectorTh}</div>
                <div className="text-xs text-slate-500">{companyInfo.managingDirectorEn}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${companyInfo.phone.replace(/[^0-9]/g, '')}`}
                className="p-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>โทร {companyInfo.phone}</span>
              </a>

              <a
                href={`https://line.me/ti/p/~${companyInfo.lineId}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>LINE: {companyInfo.lineId}</span>
              </a>
            </div>
          </div>

          {/* Person 2: Manager (Sukda Namwichai from new card) */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-orange-700 font-bold uppercase tracking-wider">MANAGER</div>
                <div className="text-base font-bold text-slate-900">{managerNameTh}</div>
                <div className="text-xs text-slate-500">{managerNameEn}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${managerPhone.replace(/[^0-9]/g, '')}`}
                className="p-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>โทร {managerPhone}</span>
              </a>

              <a
                href={`https://line.me/ti/p/~${managerLineId}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>LINE: {managerLineId}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Company Official Email & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold">อีเมลบริษัท</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">{companyInfo.email}</div>
              </div>
            </div>

            <a
              href={`mailto:${companyInfo.email}`}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
            >
              ส่งอีเมล
            </a>
          </div>

          {/* Area */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold">ศูนย์บริการ</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">เขตลาดกระบัง กรุงเทพฯ</div>
              </div>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>แผนที่</span>
            </a>
          </div>
        </div>

        {/* Full Address */}
        <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed flex items-start justify-between gap-3 shadow-2xs">
          <div>
            <span className="font-bold text-slate-900 block mb-0.5">ที่อยู่สำนักงานตามจดทะเบียน:</span>
            <span>{companyInfo.address}</span>
          </div>
          <button
            onClick={() => copyToClipboard(companyInfo.address, 'address')}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 shrink-0 cursor-pointer"
            title="คัดลอกที่อยู่"
          >
            {copiedField === 'address' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>
    </section>
  );
};
