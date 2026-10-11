import React, { useState } from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onNavigateToQuote: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  onNavigateToQuote,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Logo size={42} showText={false} />
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-tight">
                3T INTERCOOL & SERVICE
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                บจก. 3ต อินเตอร์คูล แอนด์ เซอร์วิส
              </span>
            </div>
          </div>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <button
              onClick={() => scrollTo('services')}
              className="hover:text-sky-700 transition-colors cursor-pointer"
            >
              บริการงานระบบ
            </button>
            <button
              onClick={() => scrollTo('calculator')}
              className="hover:text-sky-700 transition-colors cursor-pointer"
            >
              ขอใบเสนอราคา
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="hover:text-sky-700 transition-colors cursor-pointer"
            >
              ติดต่อเรา
            </button>
          </nav>

          {/* Admin Action */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="เข้าสู่ระบบจัดการข้อมูล"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>ระบบจัดการ</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenAdmin}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 font-semibold"
            >
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>จัดการ</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top">
          <button
            onClick={() => scrollTo('services')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            บริการงานระบบ (5 ระบบหลัก)
          </button>
          <button
            onClick={() => scrollTo('calculator')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            ขอใบเสนอราคา / นัดดูหน้างาน
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            ข้อมูลติดต่อและที่อยู่
          </button>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>เข้าสู่ระบบจัดการข้อมูล</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
