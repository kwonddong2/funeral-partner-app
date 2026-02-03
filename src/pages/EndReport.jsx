import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Top from '../components/tds/Top';
import Button from '../components/tds/Button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const EndReport = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Info
    const eventInfo = {
        name: "홍길동님 빈소",
        place: "서울대병원 장례식장 3호실",
        date: "2025.01.25 ~ 2025.01.27",
    };
    const savedProduct = localStorage.getItem(`event_${id}_product`) || "미정";

    // Load Cost
    const savedCosts = JSON.parse(localStorage.getItem(`event_${id}_costs`) || '{}');
    const totalCost = Object.values(savedCosts).reduce((a, b) => a + b, 0);

    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleFinish = () => {
        if (!isConfirmed) return;

        // Mark event as closed
        if (window.confirm("정말로 행사를 종료하고 대기열로 복귀하시겠습니까?")) {
            // 1. Update separate status (Legacy)
            localStorage.setItem(`event_${id}_status`, 'closed');

            // 2. Update Global Event List (partner_events) for Admin
            const savedEventsStr = localStorage.getItem('partner_events');
            if (savedEventsStr) {
                const savedEvents = JSON.parse(savedEventsStr);
                const updatedEvents = savedEvents.map(evt =>
                    // Comparision needs to handle string/number issues
                    String(evt.id) === String(id) ? { ...evt, status: 'completed' } : evt
                );
                localStorage.setItem('partner_events', JSON.stringify(updatedEvents));
            }

            alert("수고하셨습니다. 대기열로 복귀합니다.");
            navigate('/dashboard'); // Go back to Dashboard
        }
    };

    return (
        <div className="pb-24 bg-brand-bg min-h-screen relative">
            <Top title="장례 종료 보고" showBack={true} onBack={() => navigate(`/events/${id}`)} />

            <div className="px-[20px] pt-[24px] space-y-[24px]">

                {/* Greeting */}
                <div className="text-center py-4">
                    <h2 className="text-[22px] font-bold text-brand-black mb-2">3일간 고생 많으셨습니다!</h2>
                    <p className="text-[15px] text-[#6B7684]">
                        마지막으로 행사 내용을 정리하고<br />
                        다음 배정을 위해 복귀 신청을 해주세요.
                    </p>
                </div>

                {/* Event Summary Card */}
                <div className="bg-white rounded-[24px] p-[24px] border border-[#F2F4F6] shadow-sm">
                    <h3 className="text-[18px] font-bold text-brand-black mb-[16px]">행사 요약</h3>
                    <div className="space-y-[12px]">
                        <InfoRow label="고인/상주" value={`${eventInfo.name}`} />
                        <InfoRow label="장소" value={eventInfo.place} />
                        <InfoRow label="이용 상품" value={savedProduct} isHighlight />
                    </div>
                </div>

                {/* Settlement Card Link */}
                <div
                    onClick={() => navigate(`/events/${id}/settlement`)}
                    className="bg-[#FFF5F1] rounded-[24px] p-[24px] border border-orange-100 active:scale-[0.98] transition-transform cursor-pointer"
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[15px] font-bold text-brand-orange">최종 예상 정산금</span>
                        <span className="text-[13px] text-brand-orange underline">수정하기</span>
                    </div>
                    <span className="text-[28px] font-bold text-[#FF5F00]">{totalCost.toLocaleString()}원</span>
                    <div className="mt-3 flex items-start gap-2 bg-white/60 p-3 rounded-[12px]">
                        <AlertCircle size={16} className="text-brand-orange shrink-0 mt-[2px]" />
                        <p className="text-[13px] text-[#6B7684]">금액이 확정되지 않았어도, 현재까지 파악된 금액으로 보고됩니다.</p>
                    </div>
                </div>

                {/* Memo */}
                <div>
                    <h3 className="text-[16px] font-bold text-brand-black mb-[8px]">특이사항 메모</h3>
                    <textarea
                        className="w-full h-[120px] bg-white border border-[#E5E8EB] rounded-[16px] p-[16px] text-[15px] focus:outline-none focus:border-brand-orange resize-none"
                        placeholder="본사에 전달할 특이사항이나 이슈가 있다면 적어주세요."
                    />
                </div>

                {/* Return Checkbox */}
                <div
                    onClick={() => setIsConfirmed(!isConfirmed)}
                    className="flex items-center gap-3 p-4 bg-white rounded-[16px] border border-[#F2F4F6] cursor-pointer"
                >
                    <div className={`w-[24px] h-[24px] rounded-full border-2 flex items-center justify-center transition-colors
                        ${isConfirmed ? 'border-brand-orange bg-brand-orange' : 'border-[#D1D6DB] bg-white'}`}>
                        {isConfirmed && <CheckCircle2 size={16} className="text-white" />}
                    </div>
                    <span className={`text-[15px] font-medium ${isConfirmed ? 'text-brand-black' : 'text-[#8B95A1]'}`}>
                        모든 업무를 마쳤으며,<br />다음 배정을 받을 준비가 되었습니다.
                    </span>
                </div>

            </div>

            {/* Bottom Action */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#F2F4F6] p-[20px] pb-[32px] z-10 flex justify-center">
                <Button
                    variant="primary"
                    size="large"
                    className="w-full max-w-[440px]"
                    disabled={!isConfirmed}
                    onClick={handleFinish}
                >
                    행사 종료 및 복귀하기
                </Button>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value, isHighlight }) => (
    <div className="flex justify-between items-center">
        <span className="text-[15px] text-[#8B95A1]">{label}</span>
        <span className={`text-[15px] font-medium ${isHighlight ? 'text-brand-orange' : 'text-[#333D4B]'}`}>{value}</span>
    </div>
);

export default EndReport;
