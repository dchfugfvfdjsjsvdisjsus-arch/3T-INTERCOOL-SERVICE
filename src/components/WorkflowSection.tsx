import React from 'react';
import { Compass, PenTool, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';

interface WorkflowSectionProps {
  onScheduleSurvey: () => void;
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ onScheduleSurvey }) => {
  const steps = [
    {
      num: '01',
      title: 'สำรวจหน้างาน & คำนวณภาระความเย็น',
      subtitle: 'Site Survey & Thermal Load Sizing',
      desc: 'วิศวกรเข้าสำรวจสภาพแวดล้อมจริง คำนวณค่า BTU และ CFM ตามปริมาตรอาคารและประเภทการใช้งาน เพื่อเลือกขนาดอุปกรณ์ที่ประหยัดพลังงานที่สุด',
      icon: <Compass className="w-5 h-5 text-sky-700" />,
    },
    {
      num: '02',
      title: 'เขียนแบบวิศวกรรม & Shop Drawing',
      subtitle: 'Engineering Drafting & Specifications',
      desc: 'จัดทำแบบแปลน As-Built, Isometric ท่อลม ท่อน้ำเย็น และตารางคุณลักษณะอุปกรณ์ (Equipment Schedule) พร้อมข้อเสนอราคาที่ชัดเจน',
      icon: <PenTool className="w-5 h-5 text-sky-700" />,
    },
    {
      num: '03',
      title: 'ติดตั้งตามมาตรฐานวิศวกรรม',
      subtitle: 'Turnkey Installation & Safety Code',
      desc: 'ดำเนินการติดตั้งโดยทีมช่างวิชาชีพที่มีประสบการณ์ ควบคุมมาตรฐานการเชื่อมท่อ การหุ้มฉนวน และระบบจ่ายไฟตามมาตรฐานความปลอดภัย',
      icon: <Wrench className="w-5 h-5 text-sky-700" />,
    },
    {
      num: '04',
      title: 'ทดสอบเดินระบบ & บำรุงรักษาเชิงป้องกัน',
      subtitle: 'Commissioning & Preventive Maintenance',
      desc: 'วัดค่าอุณหภูมิ แรงดันน้ำยา และกระแสไฟฟ้า ส่งมอบใบรับประกันผลงาน พร้อมจัดทำแผนบำรุงรักษา (PM) เพื่อยืดอายุการใช้งานเครื่องจักร',
      icon: <ShieldCheck className="w-5 h-5 text-sky-700" />,
    },
  ];

  return (
    <section id="workflow" className="py-20 lg:py-28 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-16">
          <div className="text-xs font-bold text-sky-800 tracking-wider uppercase">
            03. มาตรฐานการดำเนินโครงการ (Quality Assurance & Execution)
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            4 ขั้นตอนส่งมอบงานมาตรฐานองค์กรวิศวกรรม
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            ระบบงานทุกโครงการของ 3T Intercool ดำเนินการตามระเบียบปฏิบัติวิศวกรรม เพื่อความคุ้มค่า ความปลอดภัย และความต่อเนื่องของการใช้งาน
          </p>
        </div>

        {/* 4 Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="p-7 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-sky-300 transition-colors flex flex-col justify-between text-left group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-black text-slate-300 group-hover:text-sky-600 transition-colors font-mono">
                    {step.num}
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {step.title}
                </h3>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {step.subtitle}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>Phase {step.num}</span>
                <span className="text-slate-900 font-bold">มาตรฐาน 3T</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-white">
              ต้องการนัดหมายวิศวกรเข้าสำรวจหน้างานจริง?
            </h4>
            <p className="text-xs text-slate-400">
              ครอบคลุมพื้นที่กรุงเทพฯ ปริมณฑล นิคมอุตสาหกรรมลาดกระบัง บางพลี บางปู และโซน EEC
            </p>
          </div>

          <button
            onClick={onScheduleSurvey}
            className="px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 transition-colors"
          >
            <span>นัดสำรวจหน้างาน / ปรึกษาวิศวกร</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
