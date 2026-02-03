import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Phone, CheckCircle2, Lock, ArrowRight, Edit2, X, ChevronRight, Check } from 'lucide-react';
import Top from '../components/tds/Top';
import ListHeader from '../components/tds/ListHeader';
import Button from '../components/tds/Button';
import Toast from '../components/tds/Toast';

const EventDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    useLocation(); // Hook to trigger re-render on navigation return
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    // Modal States
    const [isJangjiModalOpen, setIsJangjiModalOpen] = useState(false);
    const [editJangji, setEditJangji] = useState({ first: '', second: '' });

    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
    const [editVehicle, setEditVehicle] = useState({
        busVendor: '',
        limoVendor: '',
        busPrice: '',
        limoPrice: '',
        tip: '',
        extraCost: '',
        isReserved: false
    });

    // 1. Get Saved State
    const savedConsultation = localStorage.getItem(`event_${id}_consultation`);
    const savedPreliminary = localStorage.getItem(`event_${id}_preliminary`);
    const savedVehicle = localStorage.getItem(`event_${id}_vehicle`);

    const consultationData = (savedConsultation && savedConsultation !== "undefined") ? JSON.parse(savedConsultation) : null;
    const preliminaryData = (savedPreliminary && savedPreliminary !== "undefined") ? JSON.parse(savedPreliminary) : null;
    const vehicleData = (savedVehicle && savedVehicle !== "undefined") ? JSON.parse(savedVehicle) : null;

    // Derived Info
    const derivedName = consultationData?.deceasedName
        ? `${consultationData.deceasedName}님 빈소`
        : (preliminaryData?.deceasedName ? `${preliminaryData.deceasedName}님 빈소` : (preliminaryData?.customerName ? `${preliminaryData.customerName}님 (의뢰)` : "행사 정보 없음"));

    const derivedPlace = consultationData?.place || preliminaryData?.place || "-";
    const derivedSangju = consultationData?.memberName || preliminaryData?.customerName || "-";

    // Bottom Info Section Data
    const infoFirstDest = consultationData?.firstDest || "";
    const infoSecondDest = consultationData?.secondDest || "";
    const infoJangji = (infoFirstDest || infoSecondDest)
        ? `${infoFirstDest} ${infoSecondDest ? '/ ' + infoSecondDest : ''}`
        : "-";

    // Vehicle Info Logic
    const vehicleSummary = vehicleData
        ? `${vehicleData.busVendor ? '버스:' + vehicleData.busVendor : ''} ${vehicleData.limoVendor ? '리무진:' + vehicleData.limoVendor : ''}${vehicleData.isReserved ? ' (예약완료)' : ''}`.trim() || (vehicleData.isReserved ? "예약 완료" : "미지정")
        : (consultationData?.dispatchCar || "-");

    const infoFlower = consultationData?.flower || "-";
    const derivedDate = consultationData?.receptionDate
        ? `${consultationData.receptionDate} ~ ${consultationData.cortegeTime || '발인 미정'}`
        : (preliminaryData ? `${new Date().toLocaleDateString()} (접수)` : "-");

    const eventInfo = {
        name: derivedName,
        place: derivedPlace,
        date: derivedDate,
        sangju: derivedSangju
    };

    const isPreliminaryDone = localStorage.getItem(`event_${id}_preliminary_done`) === 'true';
    const reportStatus = localStorage.getItem(`event_${id}_status`);
    const savedProduct = localStorage.getItem(`event_${id}_product`) || "미정";
    const isNoMortuary = savedProduct.includes("무빈소");
    const isDay1Done = localStorage.getItem(`event_${id}_day_1_done`) === 'true';
    const isDay2Done = localStorage.getItem(`event_${id}_day_2_done`) === 'true';
    const isDay3Done = localStorage.getItem(`event_${id}_day_3_done`) === 'true';

    // Handler to open Jangji Edit
    const handleOpenJangjiEdit = () => {
        setEditJangji({
            first: consultationData?.firstDest || '',
            second: consultationData?.secondDest || ''
        });
        setIsJangjiModalOpen(true);
    };

    // Handler to save Jangji
    const handleSaveJangji = () => {
        const updatedConsultation = {
            ...(consultationData || {}),
            firstDest: editJangji.first,
            secondDest: editJangji.second
        };
        localStorage.setItem(`event_${id}_consultation`, JSON.stringify(updatedConsultation));
        setIsJangjiModalOpen(false);
        setToastMsg("장지 정보가 수정되었습니다.");
        setShowToast(true);
        setTimeout(() => window.location.reload(), 500);
    };

    // Handler to open Vehicle Edit
    const handleOpenVehicleEdit = () => {
        // Init with existing data or defaults
        setEditVehicle({
            busVendor: vehicleData?.busVendor || '',
            limoVendor: vehicleData?.limoVendor || '',
            busPrice: vehicleData?.busPrice || '',
            limoPrice: vehicleData?.limoPrice || '',
            tip: vehicleData?.tip || '',
            extraCost: vehicleData?.extraCost || '',
            isReserved: vehicleData?.isReserved || false
        });
        setIsVehicleModalOpen(true);
    };

    // Handler to save Vehicle
    const handleSaveVehicle = () => {
        localStorage.setItem(`event_${id}_vehicle`, JSON.stringify(editVehicle));
        setIsVehicleModalOpen(false);
        setToastMsg("차량 배차 정보가 저장되었습니다.");
        setShowToast(true);
        setTimeout(() => window.location.reload(), 500);
    };

    // 2. Define All Steps
    const allSteps = [
        {
            id: 1,
            label: "출동 및 선행보고",
            status: isPreliminaryDone ? "done" : "active",
            date: preliminaryData?.dispatchTime ? `출동 ${preliminaryData.dispatchTime}` : null,
            action: () => navigate(`/events/${id}/report/preliminary`),
            btnText: isPreliminaryDone ? "내용 수정" : "보고서 작성"
        },
        {
            id: 2,
            label: "초도상담 보고",
            status: reportStatus === 'consultation_done' ? "done" : "active",
            date: reportStatus === 'consultation_done' ? "01.25 15:00" : null,
            action: () => navigate(`/events/${id}/report/consultation`),
            btnText: "보고서 작성"
        },
        {
            id: 3,
            label: "1일차 보고",
            status: isDay1Done ? "done" : (reportStatus === 'consultation_done' ? "active" : "locked"),
            desc: "초도상담 완료 후 진행",
            action: () => navigate(`/events/${id}/report/daily/1`),
            btnText: "체크리스트 & 사진"
        },
        {
            id: 4,
            label: "2일차 보고",
            status: isDay2Done ? "done" : (isDay1Done ? "active" : "locked"),
            desc: "2일차 오전 09:00 오픈",
            action: () => navigate(`/events/${id}/report/daily/2`),
            btnText: "체크리스트 & 사진"
        },
        {
            id: 5,
            label: "3일차 보고",
            status: isDay3Done ? "done" : (isDay2Done ? "active" : "locked"),
            desc: "발인일 오전 05:00 오픈",
            action: () => navigate(`/events/${id}/report/daily/3`),
            btnText: "체크리스트 & 사진"
        },
        {
            id: 6,
            label: "장례 종료 보고",
            status: isDay3Done ? "active" : "locked",
            action: () => navigate(`/events/${id}/report/end`),
            btnText: "장례 종료 보고"
        }
    ];

    let timelineSteps = allSteps;
    if (isNoMortuary) {
        timelineSteps = allSteps.filter(step => step.id !== 5);
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
            localStorage.removeItem(`event_${id}_consultation`);
            localStorage.removeItem(`event_${id}_preliminary`);
            localStorage.removeItem(`event_${id}_preliminary_done`);
            localStorage.removeItem(`event_${id}_vehicle`);
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

            <div className="px-[20px] mt-[32px]">
                <ListHeader>진행 타임라인</ListHeader>
                <div className="mt-[16px] pl-[10px]">
                    {timelineSteps.map((step, index) => (
                        <div key={step.id} className="relative flex gap-4 pb-10 last:pb-0 group">
                            {index !== timelineSteps.length - 1 && (
                                <div className={`absolute left-[13px] top-[26px] h-full w-[2px] ${step.status === 'done' ? 'bg-brand-orange' : 'bg-[#E5E8EB]'}`} />
                            )}

                            <div className="z-10 bg-brand-bg py-1">
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

                            <div className="flex-1 pt-[2px]">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`text-[16px] font-bold ${step.status === 'locked' ? 'text-[#B0B8C1]' : 'text-brand-black'}`}>
                                            {step.label}
                                        </h3>
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
                                        <span className="text-[13px] text-[#8B95A1] font-medium">{step.date || "완료"}</span>
                                    )}
                                </div>

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
                    <DetailedRow
                        label="장지 정보"
                        value={infoJangji}
                        onClick={handleOpenJangjiEdit}
                    />
                    <DetailedRow
                        label="차량 배차"
                        value={vehicleSummary}
                        onClick={handleOpenVehicleEdit}
                    />
                    <DetailedRow label="제단 꽃" value={infoFlower} hasBorder={false} />
                </div>
            </div>

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

            {/* Jangji Edit Modal */}
            {isJangjiModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-[24px] w-full max-w-[340px] overflow-hidden animate-fade-in-up">
                        <div className="flex justify-between items-center p-5 border-b border-[#F2F4F6]">
                            <h3 className="text-[18px] font-bold text-brand-black">장지 정보 수정</h3>
                            <button onClick={() => setIsJangjiModalOpen(false)} className="text-[#8B95A1]">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-[13px] font-bold text-[#8B95A1] mb-1.5">1차 장지</label>
                                <input
                                    type="text"
                                    value={editJangji.first}
                                    onChange={(e) => setEditJangji({ ...editJangji, first: e.target.value })}
                                    className="w-full h-[48px] rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] px-3 font-medium text-[15px] outline-none focus:border-brand-orange"
                                    placeholder="예: 인천가족공원"
                                />
                            </div>
                            <div>
                                <label className="block text-[13px] font-bold text-[#8B95A1] mb-1.5">2차 장지</label>
                                <input
                                    type="text"
                                    value={editJangji.second}
                                    onChange={(e) => setEditJangji({ ...editJangji, second: e.target.value })}
                                    className="w-full h-[48px] rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] px-3 font-medium text-[15px] outline-none focus:border-brand-orange"
                                    placeholder="예: 산골"
                                />
                            </div>
                        </div>
                        <div className="p-5 pt-0">
                            <Button onClick={handleSaveJangji} variant="primary" size="large" className="w-full">
                                저장하기
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Vehicle Edit Modal */}
            {isVehicleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-[24px] w-full max-w-[340px] max-h-[90vh] overflow-y-auto animate-fade-in-up no-scrollbar">
                        <div className="flex justify-between items-center p-5 border-b border-[#F2F4F6] sticky top-0 bg-white z-10">
                            <h3 className="text-[18px] font-bold text-brand-black">차량 배차 정보</h3>
                            <button onClick={() => setIsVehicleModalOpen(false)} className="text-[#8B95A1]">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            {/* Bus */}
                            <div className="bg-[#F9FAFB] p-3 rounded-[12px] space-y-3">
                                <h4 className="text-[14px] font-bold text-[#333D4B]">버스</h4>
                                <div>
                                    <label className="block text-[12px] text-[#8B95A1] mb-1">업체명</label>
                                    <input
                                        type="text"
                                        value={editVehicle.busVendor}
                                        onChange={(e) => setEditVehicle({ ...editVehicle, busVendor: e.target.value })}
                                        className="w-full h-[40px] rounded-[8px] bg-white border border-[#E5E8EB] px-3 text-[14px] outline-none focus:border-brand-orange"
                                        placeholder="버스 업체명"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[12px] text-[#8B95A1] mb-1">단가</label>
                                    <input
                                        type="number"
                                        value={editVehicle.busPrice}
                                        onChange={(e) => setEditVehicle({ ...editVehicle, busPrice: e.target.value })}
                                        className="w-full h-[40px] rounded-[8px] bg-white border border-[#E5E8EB] px-3 text-[14px] outline-none focus:border-brand-orange"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Limo */}
                            <div className="bg-[#F9FAFB] p-3 rounded-[12px] space-y-3">
                                <h4 className="text-[14px] font-bold text-[#333D4B]">리무진</h4>
                                <div>
                                    <label className="block text-[12px] text-[#8B95A1] mb-1">업체명</label>
                                    <input
                                        type="text"
                                        value={editVehicle.limoVendor}
                                        onChange={(e) => setEditVehicle({ ...editVehicle, limoVendor: e.target.value })}
                                        className="w-full h-[40px] rounded-[8px] bg-white border border-[#E5E8EB] px-3 text-[14px] outline-none focus:border-brand-orange"
                                        placeholder="리무진 업체명"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[12px] text-[#8B95A1] mb-1">단가</label>
                                    <input
                                        type="number"
                                        value={editVehicle.limoPrice}
                                        onChange={(e) => setEditVehicle({ ...editVehicle, limoPrice: e.target.value })}
                                        className="w-full h-[40px] rounded-[8px] bg-white border border-[#E5E8EB] px-3 text-[14px] outline-none focus:border-brand-orange"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Other Costs */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[13px] font-bold text-[#8B95A1] mb-1.5">수고비</label>
                                    <input
                                        type="number"
                                        value={editVehicle.tip}
                                        onChange={(e) => setEditVehicle({ ...editVehicle, tip: e.target.value })}
                                        className="w-full h-[48px] rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] px-3 font-medium text-[15px] outline-none focus:border-brand-orange"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-bold text-[#8B95A1] mb-1.5">추가 비용</label>
                                    <input
                                        type="number"
                                        value={editVehicle.extraCost}
                                        onChange={(e) => setEditVehicle({ ...editVehicle, extraCost: e.target.value })}
                                        className="w-full h-[48px] rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] px-3 font-medium text-[15px] outline-none focus:border-brand-orange"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Reservation Status */}
                            <div
                                onClick={() => setEditVehicle(prev => ({ ...prev, isReserved: !prev.isReserved }))}
                                className={`flex items-center gap-3 p-4 rounded-[12px] cursor-pointer border transition-colors ${editVehicle.isReserved ? 'bg-orange-50 border-brand-orange' : 'bg-[#F9FAFB] border-[#E5E8EB]'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${editVehicle.isReserved ? 'bg-brand-orange border-brand-orange' : 'bg-white border-[#D1D6DB]'}`}>
                                    {editVehicle.isReserved && <Check size={14} className="text-white" />}
                                </div>
                                <span className={`text-[15px] font-bold ${editVehicle.isReserved ? 'text-brand-orange' : 'text-[#8B95A1]'}`}>
                                    예약 완료
                                </span>
                            </div>
                        </div>
                        <div className="p-5 pt-0">
                            <Button onClick={handleSaveVehicle} variant="primary" size="large" className="w-full">
                                저장하기
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Toast message={toastMsg} isVisible={showToast} onClose={() => setShowToast(false)} />
        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex items-center gap-3">
        <span className="text-[14px] text-[#8B95A1] w-[40px]">{label}</span>
        <span className="text-[15px] text-[#333D4B] font-medium">{value}</span>
    </div>
);

const DetailedRow = ({ label, value, hasBorder = true, onClick }) => (
    <div
        onClick={onClick}
        className={`px-[20px] py-[18px] flex justify-between items-center ${hasBorder ? 'border-b border-[#F2F4F6]' : ''} ${onClick ? 'cursor-pointer active:bg-gray-50' : ''}`}
    >
        <span className="text-[15px] text-[#333D4B] font-medium">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-[15px] text-[#6B7684]">{value}</span>
            {onClick ? (
                <Edit2 size={14} className="text-[#D1D6DB]" />
            ) : (
                <ChevronRight size={18} className="text-[#D1D6DB]" />
            )}
        </div>
    </div>
);

export default EventDetail;
