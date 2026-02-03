import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Copy, Calendar, Clock, MapPin, User, FileText, Package } from 'lucide-react';
import Top from '../components/tds/Top';
import Button from '../components/tds/Button';
import Toast from '../components/tds/Toast';

const ConsultationReport = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    // Form State - Pre-filled with mock data for convenience
    const [formData, setFormData] = useState({
        place: '부평세림병원 장례식장',
        product: '2026 가족장289',
        deceasedName: 'JINXUEJUN',
        deceasedGender: '남',
        deceasedAge: '65세',
        memberName: '김계화',
        memberRelation: '조카',
        memberPhone: '010-4909-1093',
        receptionDate: '1월 28일',
        checkinTime: '1월 28일 18시',
        casketingTime: '1월 29일 15시',
        cortegeTime: '1월 30일 05시 30분',
        firstDest: '인천가족공원 (07:00)',
        secondDest: '산골',
        teamLeader: '김청용 010-8519-7981',
        notes: `● 2026 일반장 289 진행
● 회원님 지방에서 늦게 도착, 현장 조카분과 진행
● 늦은 시간 입실
● 상가 외국인 (거소사실 확인 중)
● 2차 장지는 추후 조율`
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCopy = () => {
        const text = `* 고이상조 상담 보고 *

장소 : ${formData.place}
상품 : ${formData.product}
고인 : ${formData.deceasedName}/${formData.deceasedGender}/${formData.deceasedAge}
회원 : ${formData.memberName}/${formData.memberRelation}/${formData.memberPhone}
접수 : ${formData.receptionDate}
입실 : ${formData.checkinTime}
입관 : ${formData.casketingTime}
발인 : ${formData.cortegeTime}
1차 장지 : ${formData.firstDest}
2차 장지 : ${formData.secondDest}
팀장 : ${formData.teamLeader}

□특이사항□ which
${formData.notes}`;

        navigator.clipboard.writeText(text).then(() => {
            setToastMsg("양식이 복사되었습니다");
            setShowToast(true);
        });
    };

    const handleSubmit = () => {
        // Simulate Server Save
        localStorage.setItem(`event_${id}_product`, formData.product);
        localStorage.setItem(`event_${id}_status`, 'consultation_done'); // Mark step as done
        localStorage.setItem(`event_${id}_consultation`, JSON.stringify(formData)); // Save full report data

        setToastMsg("초도상담 보고가 완료되었습니다");
        setShowToast(true);
        setTimeout(() => navigate('/events/' + id), 1500);
    };

    return (
        <div className="pb-24 bg-brand-bg min-h-screen relative">
            <Top
                title="초도상담 보고"
                showBack={true}
                onBack={() => navigate(-1)}
                rightAction={
                    <button onClick={handleCopy} className="text-[#3182F6] font-medium text-[15px] flex items-center gap-1">
                        <Copy size={16} /> 복사
                    </button>
                }
            />

            <div className="px-[20px] pt-[12px] space-y-6">

                {/* Section 1: Basic Info */}
                <Section title="기본 정보" icon={<User size={18} className="text-brand-orange" />}>
                    <Input label="장소" name="place" value={formData.place} onChange={handleChange} icon={<MapPin size={16} />} />
                    <div className="grid grid-cols-3 gap-2">
                        <Input label="고인명" name="deceasedName" value={formData.deceasedName} onChange={handleChange} />
                        <Input label="성별" name="deceasedGender" value={formData.deceasedGender} onChange={handleChange} />
                        <Input label="나이" name="deceasedAge" value={formData.deceasedAge} onChange={handleChange} />
                    </div>
                </Section>

                {/* Section 2: Contact */}
                <Section title="회원/상주 정보" icon={<User size={18} className="text-brand-orange" />}>
                    <div className="grid grid-cols-3 gap-2">
                        <Input label="이름" name="memberName" value={formData.memberName} onChange={handleChange} />
                        <Input label="관계" name="memberRelation" value={formData.memberRelation} onChange={handleChange} />
                        <Input label="연락처" name="memberPhone" value={formData.memberPhone} onChange={handleChange} />
                    </div>
                </Section>

                {/* Section 3: Product */}
                <Section title="상품 정보" icon={<Package size={18} className="text-brand-orange" />}>
                    <div className="flex-1">
                        <label className="block text-[13px] font-bold text-[#8B95A1] mb-1.5">이용 상품</label>
                        <div className="relative">
                            <select
                                name="product"
                                value={formData.product}
                                onChange={handleChange}
                                className="w-full h-[48px] rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] text-[#333D4B] font-medium text-[15px] focus:border-brand-orange focus:bg-white outline-none appearance-none pl-3 pr-10"
                            >
                                <option value="2026 무빈소장 159">2026 무빈소장 159</option>
                                <option value="2026 가족장 289">2026 가족장 289</option>
                                <option value="2026 일반장 289">2026 일반장 289</option>
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8B95A1] pointer-events-none">
                                <ChevronLeft size={16} className="-rotate-90" />
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Section 4: Schedule */}
                <Section title="장례 일정" icon={<Clock size={18} className="text-brand-orange" />}>
                    <Input label="접수 일자" name="receptionDate" value={formData.receptionDate} onChange={handleChange} icon={<Calendar size={16} />} />
                    <Input label="입실 시간" name="checkinTime" value={formData.checkinTime} onChange={handleChange} icon={<Clock size={16} />} />
                    <Input label="입관 시간" name="casketingTime" value={formData.casketingTime} onChange={handleChange} icon={<Clock size={16} />} />
                    <Input label="발인 시간" name="cortegeTime" value={formData.cortegeTime} onChange={handleChange} icon={<Clock size={16} />} />
                </Section>

                {/* Section 5: Destinations */}
                <Section title="장지 정보" icon={<MapPin size={18} className="text-brand-orange" />}>
                    <Input label="1차 장지 (화장장/매장)" name="firstDest" value={formData.firstDest} onChange={handleChange} />
                    <Input label="2차 장지" name="secondDest" value={formData.secondDest} onChange={handleChange} />
                </Section>

                {/* Section 6: Notes */}
                <Section title="특이사항" icon={<FileText size={18} className="text-brand-orange" />}>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full h-[150px] p-4 rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] text-[15px] focus:border-brand-orange focus:bg-white outline-none resize-none leading-relaxed"
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

// Reusable Components
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

const Input = ({ label, name, value, onChange, icon }) => (
    <div className="flex-1">
        <label className="block text-[13px] font-bold text-[#8B95A1] mb-1.5">{label}</label>
        <div className="relative">
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full h-[48px] rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] text-[#333D4B] font-medium text-[15px] focus:border-brand-orange focus:bg-white outline-none transition-colors ${icon ? 'pl-10' : 'pl-3'} pr-3`}
            />
            {icon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B95A1]">
                    {icon}
                </div>
            )}
        </div>
    </div>
);

export default ConsultationReport;
