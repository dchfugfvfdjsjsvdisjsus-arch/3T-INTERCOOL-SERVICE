import React, { useState, useEffect } from 'react';
import { ServiceCategory } from '../types';
import { submitQuotationRequest } from '../firebase';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageCircle,
  Loader2,
} from 'lucide-react';

interface QuotationCalculatorProps {
  initialCategory?: ServiceCategory;
  phone: string;
  lineId: string;
}

export const QuotationCalculator: React.FC<QuotationCalculatorProps> = ({
  initialCategory = 'AIR_CONDITIONING',
  phone,
  lineId,
}) => {
  const [category, setCategory] = useState<ServiceCategory>(initialCategory);
  const [customerName, setCustomerName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactLineId, setContactLineId] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMsg('กรุณากรอกชื่อผู้ติดต่อ');
      return;
    }
    if (!contactPhone.trim() || contactPhone.trim().length < 8) {
      setErrorMsg('กรุณากรอกเบอร์โทรศัพท์สำหรับติดต่อกลับ');
      return;
    }

    setLoading(true);
    try {
      const id = await submitQuotationRequest({
        customerName: customerName.trim(),
        phone: contactPhone.trim(),
        lineId: contactLineId.trim() || undefined,
        serviceType: category,
        location: location.trim() || undefined,
        details: details.trim() || undefined,
        urgent: false,
      });

      if (id) {
        setSubmittedId(id);
        setCustomerName('');
        setContactPhone('');
        setContactLineId('');
        setLocation('');
        setDetails('');
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง หรือโทรติดต่อ 081-5163898 โดยตรง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="calculator" className="py-14 sm:py-18 bg-white border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-left">
        
        {/* Simple Section Title */}
        <div className="mb-6 space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            ขอใบเสนอราคา / นัดดูหน้างาน
          </h2>
          <p className="text-sm text-slate-600">
            กรอกข้อมูลสั้นๆ ด้านล่าง ข้อมูลจะบันทึกเข้าสู่ระบบ และทีมช่างจะติดต่อกลับโดยเร็วที่สุด
          </p>
        </div>

        {/* Clear Notice: Where does the quotation go? */}
        <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-slate-700 space-y-1.5">
          <div className="font-bold text-sky-900 flex items-center gap-1.5">
            <span>📍 ขั้นตอนและสถานที่จัดส่งใบเสนอราคา:</span>
          </div>
          <ul className="space-y-1 text-slate-600 pl-4 list-disc">
            <li>
              <span className="font-semibold text-slate-800">ส่งเข้าสู่ระบบบริษัท:</span> ข้อมูลคำขอจะถูกส่งตรงเข้าสู่ฐานข้อมูล Cloud Firebase ของ <strong>บจก. 3ต อินเตอร์คูล แอนด์ เซอร์วิส</strong> ทันที
            </li>
            <li>
              <span className="font-semibold text-slate-800">การติดต่อกลับ:</span> ทีมช่างจะโทรติดต่อกลับผ่านเบอร์โทรศัพท์ที่ท่านระบุ เพื่อยืนยันขนาดและสเปกงาน
            </li>
            <li>
              <span className="font-semibold text-slate-800">การส่งเอกสารใบเสนอราคา:</span> เจ้าหน้าที่จะจัดส่งไฟล์ใบเสนอราคาอย่างเป็นทางการให้ท่านทาง <strong>LINE ID</strong> หรือ <strong>อีเมล</strong> ที่ท่านระบุไว้
            </li>
          </ul>
        </div>

        {submittedId ? (
          <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900">
              ส่งคำขอเข้าสู่ระบบเรียบร้อยแล้ว!
            </h3>
            <p className="text-sm text-slate-700">
              รหัสคำขอในระบบ: <span className="font-mono font-bold text-sky-800 bg-white px-2 py-0.5 rounded border border-emerald-200">{submittedId}</span>
            </p>
            <div className="p-4 rounded-xl bg-white border border-emerald-200 text-xs text-slate-600 text-left space-y-1 max-w-lg mx-auto">
              <div className="font-bold text-emerald-800">📄 สถานะการจัดส่งใบเสนอราคา:</div>
              <div>1. ข้อมูลถูกส่งเข้าสู่ระบบจัดการข้อมูลของ บจก. 3ต อินเตอร์คูล เรียบร้อยแล้ว</div>
              <div>2. ทีมช่างกำลังตรวจสอบ และจะโทรติดต่อกลับหาท่านเพื่อยืนยันรายละเอียด</div>
              <div>3. เอกสารใบเสนอราคาฉบับจริงจะถูกส่งให้ท่านทาง <strong>LINE ID</strong> หรือ <strong>อีเมล</strong> ที่ระบุไว้</div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`tel:${phone.replace(/[^0-9]/g, '')}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>โทรด่วน {phone}</span>
              </a>

              <a
                href={`https://line.me/ti/p/~${lineId}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>ทัก LINE: {lineId}</span>
              </a>
            </div>

            <button
              onClick={() => setSubmittedId(null)}
              className="text-xs text-sky-700 hover:text-sky-900 font-semibold underline block mx-auto pt-2 cursor-pointer"
            >
              ส่งคำขอเพิ่มเติม
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Service Selection */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                เลือกงานระบบที่ต้องการ <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium"
              >
                <option value="AIR_CONDITIONING">1. งานระบบ AIR CONDITIONING (เครื่องปรับอากาศ)</option>
                <option value="COLD_ROOM">2. งานระบบ COLD ROOM (ห้องเย็น)</option>
                <option value="DUCT_PIPE">3. งานระบบ DUCT PIPE (ท่อลม)</option>
                <option value="CHILLER">4. งานระบบ CHILLER (เครื่องทำความเย็น)</option>
                <option value="FREEZER_SHOWCASE">5. งานระบบของตู้แช่ทุกประเภท</option>
                <option value="OTHER">อื่นๆ</option>
              </select>
            </div>

            {/* Name and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  ชื่อผู้ติดต่อ / บริษัท <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น คุณสมชาย หรือ บจก. ตัวอย่าง"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  เบอร์โทรศัพท์ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="เช่น 081-xxxxxxx"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-mono"
                />
              </div>
            </div>

            {/* LINE ID and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  LINE ID (ถ้ามี)
                </label>
                <input
                  type="text"
                  placeholder="เช่น chelsea898"
                  value={contactLineId}
                  onChange={(e) => setContactLineId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  สถานที่ติดตั้ง / ดูหน้างาน (ถ้ามี)
                </label>
                <input
                  type="text"
                  placeholder="เช่น ลาดกระบัง, บางนา, กรุงเทพฯ"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm"
                />
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                รายละเอียดเพิ่มเติม (ถ้ามี)
              </label>
              <textarea
                rows={3}
                placeholder="ระบุอาการชำรุด ขนาดห้องเย็น หรือสเปกงานที่ต้องการ..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-lg bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังส่งข้อมูลสู่ระบบ...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>ส่งข้อมูลขอใบเสนอราคา</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </section>
  );
};
