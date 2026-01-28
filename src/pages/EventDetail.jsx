import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Calendar, Camera, CheckSquare, FileText, ChevronRight, Phone, CheckCircle2, Lock, ArrowRight, Edit2 } from 'lucide-react';
import Top from '../components/tds/Top';
import ListHeader from '../components/tds/ListHeader';

const EventDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation(); // Hook to trigger re-render on navigation return

    // Mock Info
    const eventInfo = {
        name: "홍길동님 빈소",
        place: "서울대병원 장례식장 3호실",
        date: "2025.01.25 ~ 2025.01.27",
        sangju: "홍상주"
    };

    // 1. Get Saved State (Simulation)
    const savedProduct = localStorage.getItem(`event_${id}_product`) || "미정";
    const reportStatus = localStorage.getItem(`event_${id}_status`);
    const isNoMortuary = savedProduct.includes("무빈소");

    // Read Day Completion Status
    const isDay1Done = localStorage.getItem(`event_${id}_day_1_done`) === 'true';
    const isDay2Done = localStorage.getItem(`event_${id}_day_2_done`) === 'true';
    const isDay3Done = localStorage.getItem(`event_${id}_day_3_done`) === 'true';

    // 2. Define All Steps
    const allSteps = [
        {
            id: 1,
            label: "출동 및 선행보고",
            status: "done",
            date: "01.25 14:30"
        },
        {
            id: 2,
            label: "초도상담 보고",
            // If report is done, mark as done. Else active.
            status: reportStatus === 'consultation_done' ? "done" : "active",
            date: reportStatus === 'consultation_done' ? "01.25 15:00" : null,
            action: () => navigate(`/events/${id}/report/consultation`),
            btnText: "보고서 작성"
        },
        {
            id: 3,
            label: "1일차 보고",
            // Active if consultation done & Day 1 not done. Done if Day 1 done.
            status: isDay1Done ? "done" : (reportStatus === 'consultation_done' ? "active" : "locked"),
            desc: "초도상담 완료 후 진행",
            action: () => navigate(`/events/${id}/report/daily/1`),
            btnText: "체크리스트 & 사진"
        },
        {
            id: 4,
            label: "2일차 보고",
            // Active if Day 1 done & Day 2 not done. Done if Day 2 done.
            status: isDay2Done ? "done" : (isDay1Done ? "active" : "locked"),
            desc: "2일차 오전 09:00 오픈",
            action: () => navigate(`/events/${id}/report/daily/2`),
            btnText: "체크리스트 & 사진"
        },
        {
            id: 5,
            label: "3일차 보고",
            // Active if Day 2 done (and not No-Mortuary) & Day 3 not done.
            // For No-Mortuary, this step should technically be skipped or handled differently, but keeping generic flow for now.
            status: isDay3Done ? "done" : (isDay2Done ? "active" : "locked"),
            desc: "발인일 오전 05:00 오픈",
            action: () => navigate(`/events/${id}/report/daily/3`),
            btnText: "체크리스트 & 사진"
        },
        {
            id: 6,
            label: "장례 종료 보고",
            // Standard Flow: Unlock after Day 3
            status: isDay3Done ? "active" : "locked",
            action: () => navigate(`/events/${id}/report/end`),
            btnText: "장례 종료 보고"
        }
    ];

    // 3. Filter Steps based on Product
    let timelineSteps = allSteps;
    if (isNoMortuary) {
        // Remove Day 3 Report (id: 5)
        timelineSteps = allSteps.filter(step => step.id !== 5);

        // Find "End Report" (id: 6) and make it active if Day 2 is done
        const endStepIndex = timelineSteps.findIndex(s => s.id === 6);
        if (endStepIndex !== -1) {
            timelineSteps[endStepIndex] = {
                ...timelineSteps[endStepIndex],
                status: isDay2Done ? "active" : "locked",
                action: () => navigate(`/events/${id}/report/end`),
                btnText: "장례 종료 보고"
            };
        }
    }

    const handleReset = () => {
        if (window.confirm("진행 내용을 초기화 하시겠습니까?")) {
            localStorage.removeItem(`event_${id}_product`);
            localStorage.removeItem(`event_${id}_status`);
            localStorage.removeItem(`event_${id}_day_1_done`);
            localStorage.removeItem(`event_${id}_day_2_done`);
            localStorage.removeItem(`event_${id}_day_3_done`);
            localStorage.removeItem(`event_${id}_day_1_date`);
            localStorage.removeItem(`event_${id}_day_2_date`);
            localStorage.removeItem(`event_${id}_day_3_date`);
            window.location.reload();
        }
    };

    return (
        <div className="pb-12 bg-brand-bg min-h-screen relative">
            <Top
                title="행사 상세"
                onBack={() => navigate('/events')}
                rightAction={
                    <button onClick={handleReset} className="text-[#8B95A1] text-[13px] underline">
                        진행 초기화
                    </button>
                }
            />

            {/* Hero / Context Card */}
            <div className="px-[20px] pt-[20px]">
                <div className="bg-white rounded-[24px] p-[24px] shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-[22px] font-bold text-brand-black mb-1">{eventInfo.name}</h2>
                            <p className="text-[15px] text-[#6B7684]">{eventInfo.place}</p>
                        </div>
                        <div className="bg-[#E8F3FF] p-2 rounded-full">
                            <Phone size={20} className="text-[#1B64DA]" />
                        </div>
                    </div>

                    <div className="space-y-[8px]">
                        <InfoRow label="상주" value={eventInfo.sangju} />
                        <InfoRow label="일정" value={eventInfo.date} />
                        <InfoRow label="상품" value={<span className="text-brand-orange font-bold">{savedProduct}</span>} />
                    </div>
                </div>
            </div>

            {/* Dynamic Reporting Timeline */}
            <div className="px-[20px] mt-[32px]">
                <ListHeader>진행 타임라인</ListHeader>
                <div className="mt-[16px] pl-[10px]">
                    {timelineSteps.map((step, index) => (
                        <div key={step.id} className="relative flex gap-4 pb-10 last:pb-0 group">
                            {/* Vertical Line */}
                            {index !== timelineSteps.length - 1 && (
                                <div className={`absolute left-[13px] top-[26px] h-full w-[2px] ${step.status === 'done' ? 'bg-brand-orange' : 'bg-[#E5E8EB]'}`} />
                            )}

                            {/* Status Icon */}
                            <div className="z-10 bg-brand-bg py-1"> {/* Padding to hide line behind */}
                                {step.status === 'done' ? (
                                    <div className="w-[26px] h-[26px] rounded-full bg-brand-orange text-white flex items-center justify-center shadow-md shadow-orange-100">
                                        <CheckCircle2 size={16} />
                                    </div>
                                ) : step.status === 'active' ? (
                                    <div className="w-[26px] h-[26px] rounded-full border-[3px] border-brand-orange bg-white box-border animate-pulse" />
                                ) : (
                                    <div className="w-[26px] h-[26px] rounded-full bg-[#E5E8EB] flex items-center justify-center text-[#B0B8C1]">
                                        <Lock size={14} />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-[2px]">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`text-[16px] font-bold ${step.status === 'locked' ? 'text-[#B0B8C1]' : 'text-brand-black'}`}>
                                            {step.label}
                                        </h3>
                                        {/* Edit Icon for Done Steps */}
                                        {step.status === 'done' && step.action && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); step.action(); }}
                                                className="text-[#8B95A1] hover:text-brand-orange transition-colors"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                    {step.status === 'done' && (
                                        <span className="text-[13px] text-[#8B95A1] font-medium">{step.date || "01.25 16:00"}</span>
                                    )}
                                </div>

                                {/* Active State Actions */}
                                {step.status === 'active' && (
                                    <div className="mt-3 animate-fade-in-up">
                                        <button
                                            onClick={step.action}
                                            className="w-full h-[48px] bg-white border border-brand-orange text-brand-orange rounded-[16px] font-bold text-[15px] shadow-sm flex items-center justify-center gap-2 active:bg-orange-50 transition-colors"
                                        >
                                            {step.btnText} <ArrowRight size={18} />
                                        </button>
                                    </div>
                                )}

                                {/* Locked State Desc */}
                                {step.status === 'locked' && step.desc && (
                                    <p className="text-[13px] text-[#B0B8C1] mt-1">{step.desc}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Additional Info */}
            <div className="px-[20px] mt-[40px]">
                <ListHeader>행사 정보</ListHeader>
                <div className="bg-white rounded-[20px] overflow-hidden mt-[12px] border border-[#F2F4F6]">
                    <DetailedRow label="장지 정보" value="용인공원묘원" />
                    <DetailedRow label="차량 배차" value="캐딜락 리무진 1대" />
                    <DetailedRow label="제단 꽃" value="특2호 (현대)" hasBorder={false} />
                </div>
            </div>

            {/* Settlement Entry (NEW) */}
            <div className="px-[20px] mt-[40px]">
                <ListHeader>정산 관리</ListHeader>
                <div
                    onClick={() => navigate(`/events/${id}/settlement`)}
                    className="bg-white rounded-[20px] p-[20px] mt-[12px] border border-[#F2F4F6] flex justify-between items-center active:bg-gray-50 transition-colors shadow-sm"
                >
                    <div>
                        <span className="block text-[14px] text-[#8B95A1] mb-1">현재 예상 정산금</span>
                        <span className="text-[20px] font-bold text-brand-black">0원</span>
                    </div>
                    <div className="w-[32px] h-[32px] rounded-full bg-[#F2F4F6] flex items-center justify-center">
                        <ChevronRight size={18} className="text-[#B0B8C1]" />
                    </div>
                </div>
            </div>

        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex items-center gap-3">
        <span className="text-[14px] text-[#8B95A1] w-[40px]">{label}</span>
        <span className="text-[15px] text-[#333D4B] font-medium">{value}</span>
    </div>
);

const DetailedRow = ({ label, value, hasBorder = true }) => (
    <div className={`px-[20px] py-[18px] flex justify-between items-center ${hasBorder ? 'border-b border-[#F2F4F6]' : ''}`}>
        <span className="text-[15px] text-[#333D4B] font-medium">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-[15px] text-[#6B7684]">{value}</span>
            <ChevronRight size={18} className="text-[#D1D6DB]" />
        </div>
    </div>
);

export default EventDetail;
