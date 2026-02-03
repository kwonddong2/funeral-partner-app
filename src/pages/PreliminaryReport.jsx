import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, MapPin, Clock, Check, ChevronLeft } from 'lucide-react';
import Top from '../components/tds/Top';
import Button from '../components/tds/Button';
import Toast from '../components/tds/Toast';

const PreliminaryReport = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        dispatchTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        place: '',
        deceasedName: '',
        customerName: '',
        customerPhone: '',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        // Validation (Optional but good for UX)
        if (!formData.place || !formData.customerName) {
            setToastMsg("장소와 의뢰인 성함은 필수입니다.");
            setShowToast(true);
            return;
        }

        // Save to localStorage
        localStorage.setItem(`event_${id}_preliminary`, JSON.stringify(formData));
        localStorage.setItem(`event_${id}_preliminary_done`, 'true');

        // Also update event status if not already set (starts the event flow)
        if (!localStorage.getItem(`event_${id}_status`)) {
            localStorage.setItem(`event_${id}_status`, 'ongoing');
        }

        setToastMsg("선행보고가 완료되었습니다");
        setShowToast(true);
        setTimeout(() => navigate('/events/' + id), 1000);
    };

    return (
        <div className="pb-24 bg-brand-bg min-h-screen relative">
            <Top
                title="출동 및 선행보고"
                showBack={true}
                onBack={() => navigate(-1)}
            />

            <div className="px-[20px] pt-[12px] space-y-6">

                {/* Section 1: Dispatch Info */}
                <Section title="출동 정보" icon={<Clock size={18} className="text-brand-orange" />}>
                    <Input
                        label="출동 시간"
                        name="dispatchTime"
                        value={formData.dispatchTime}
                        onChange={handleChange}
                        icon={<Clock size={16} />}
                        placeholder="예: 14:30"
                    />
                    <Input
                        label="장소 (장례식장/자택)"
                        name="place"
                        value={formData.place}
                        onChange={handleChange}
                        icon={<MapPin size={16} />}
                        placeholder="예: 서울대병원 장례식장"
                    />
                </Section>

                {/* Section 2: Key People */}
                <Section title="고인 및 의뢰인" icon={<User size={18} className="text-brand-orange" />}>
                    <Input
                        label="고인명 (미정 시 공란)"
                        name="deceasedName"
                        value={formData.deceasedName}
                        onChange={handleChange}
                        placeholder="홍길동"
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            label="의뢰인(상주)"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            placeholder="홍상주"
                        />
                        <Input
                            label="연락처"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            placeholder="010-0000-0000"
                        />
                    </div>
                </Section>

                {/* Section 3: Notes */}
                <Section title="특이사항" icon={<Check size={18} className="text-brand-orange" />}>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full h-[100px] p-4 rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] text-[15px] focus:border-brand-orange focus:bg-white outline-none resize-none leading-relaxed"
                        placeholder="특이사항을 입력해주세요."
                    />
                </Section>

            </div>

            {/* Bottom Action */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#F2F4F6] p-[20px] pb-[32px] z-10 flex justify-center">
                <Button
                    variant="primary"
                    size="large"
                    className="w-full max-w-[440px]"
                    onClick={handleSubmit}
                >
                    보고 완료
                </Button>
            </div>

            <Toast message={toastMsg} isVisible={showToast} onClose={() => setShowToast(false)} />
        </div>
    );
};

// Reusable Components (Same as ConsultationReport for consistency)
const Section = ({ title, icon, children }) => (
    <div className="bg-white rounded-[24px] p-[24px] shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b border-[#F2F4F6] pb-3">
            {icon}
            <h3 className="text-[17px] font-bold text-brand-black">{title}</h3>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const Input = ({ label, name, value, onChange, icon, placeholder }) => (
    <div className="flex-1">
        <label className="block text-[13px] font-bold text-[#8B95A1] mb-1.5">{label}</label>
        <div className="relative">
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full h-[48px] rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] text-[#333D4B] font-medium text-[15px] focus:border-brand-orange focus:bg-white outline-none transition-colors ${icon ? 'pl-10' : 'pl-3'} pr-3 placeholder-[#D1D6DB]`}
            />
            {icon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B95A1]">
                    {icon}
                </div>
            )}
        </div>
    </div>
);

export default PreliminaryReport;
