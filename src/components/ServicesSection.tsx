import React from 'react';
import { ServiceItem, ServiceCategory } from '../types';
import { ArrowRight, Check } from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectServiceForQuote: (category: ServiceCategory) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceForQuote,
}) => {
  return (
    <section id="services" className="py-14 sm:py-18 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Simple Section Title */}
        <div className="text-left mb-8 space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            บริการงานระบบหลัก 5 ด้าน
          </h2>
          <p className="text-sm text-slate-600">
            รับออกแบบ เขียนแบบ ติดตั้ง และบำรุงรักษาครบวงจร
          </p>
        </div>

        {/* 5 Simple Cards (No Images, Clean Text & Direct Action) */}
        <div className="space-y-4">
          {services.map((service, index) => {
            const featureList = service.features
              ? service.features.split(',').map((f) => f.trim())
              : [];

            return (
              <div
                key={service.id || service.title}
                className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 hover:border-sky-300 transition-colors shadow-2xs text-left"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Left: Content */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        0{index + 1}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {service.title}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {service.summary}
                    </p>

                    {featureList.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                        {featureList.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Request Button */}
                  <div className="sm:self-center shrink-0 pt-2 sm:pt-0">
                    <button
                      onClick={() => onSelectServiceForQuote(service.category)}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>ขอราคาบริการนี้</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
