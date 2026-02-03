import React, { useState } from 'react';
import { Settings, RefreshCw, BookOpen, Gift, Download, FileEdit, ChevronRight, Phone, X, MapPin, Clock, FileText, AlertCircle, UserPlus, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Top from '../components/tds/Top';
import ListHeader from '../components/tds/ListHeader';
import Button from '../components/tds/Button';
import Toast from '../components/tds/Toast';

const Dashboard = () => {
    const navigate = useNavigate();
    const userName = "김지훈";

    // Workflow State: 'idle' | 'dispatching' | 'accepted' | 'reporting' | 'active'
    const [workflowState, setWorkflowState] = useState('idle');
    const [isDispatchViewOpen, setIsDispatchViewOpen] = useState(false);
    const [activeEvent, setActiveEvent] = useState(null);

    React.useEffect(() => {
        const id = 1; // Locking to ID 1 for prototype
        const prelimStr = localStorage.getItem(`event_${id}_preliminary`);
        const prelimDone = localStorage.getItem(`event_${id}_preliminary_done`) === 'true';

        if (prelimStr && prelimDone) {
            const prelimData = JSON.parse(prelimStr);
            const consultStr = localStorage.getItem(`event_${id}_consultation`);
            const consultData = (consultStr && consultStr !== "undefined") ? JSON.parse(consultStr) : null;

            // Merge Logic (Consultation > Preliminary)
            const name = consultData?.deceasedName
                ? `${consultData.deceasedName}님 빈소`
                : (prelimData.deceasedName ? `${prelimData.deceasedName}님 빈소`
                    : (prelimData.customerName ? `${prelimData.customerName}님 (의뢰)` : "행사 정보 없음"));

            const place = consultData?.place || prelimData.place || "장소 미정";

            setActiveEvent({ name, place });
            setWorkflowState('active'); // Force active state if data exists
        }
    }, []);

    // Toast State
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    // Manual Modal State (Ported Logic)
    const [manualModal, setManualModal] = useState({ isOpen: false, url: '' });
    const openManual = () => {
        setManualModal({
            isOpen: true,
            url: 'https://goifuneral-co.gitbook.io/undefined/LPNUXEK3k1qowwlZU9hS/'
        });
    };

    // Trigger Toast Helper
    const triggerToast = (msg) => {
        setToastMessage(msg);
        setShowToast(true);
    }

    // Dispatch Data State
    const [dispatchData, setDispatchData] = useState(null);

    // Listen for Admin Dispatch Events
    React.useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === 'dispatch_request_v2' && e.newValue) {
                const newData = JSON.parse(e.newValue);
                setDispatchData(newData);
                setWorkflowState('dispatching');
                triggerToast("🔔 신규 출동 요청이 도착했습니다!");

                // Play sound or vibration here if possible
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Helper to format text
    const getDispatchText = () => {
        const data = currentRequest;
        const notesSection = data.notes ? data.notes : '-';

        return `${notesSection}

━━━━━━━━━━━━━━━━━━

성함 : ${data.customerName || '(미입력)'} (${data.relation || '-'})
휴대폰번호 : ${data.phone}
장례희망지역 : ${data.location}
임종위치 : ${data.deathLocation}`;
    };

    // Dispatch Request State
    const [newRequest, setNewRequest] = useState(null);

    // Default Demo Data (Fallback)
    const demoRequest = {
        customerName: '홍길동',
        phone: '010-3791-6598',
        deathLocation: '자택 (호스피스 병동 퇴원)',
        location: '경기 하남시',
        relation: '누나',
        funeralHome: '하남시 마루공원 무빈소장 희망',
        jangji: '화장 : 성남 화장장 관외',
        sangjo: '2026 고이 무빈소장 159',
        notes: '장례 최대한 간소화하게 치르고 싶어하시는 고객님이셔서, 불필요하다고 생각하는 부분에 대해서는 공제 필요합니다.'
    };

    const currentRequest = newRequest || demoRequest;

    // Listen for Real Dispatch Requests
    React.useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === 'dispatch_request_v2' && e.newValue) {
                const data = JSON.parse(e.newValue);
                // Check if this dispatch is for me (Mock ID: p1 for '김지훈')
                if (data.targetPartnerId === 'p1') {
                    setNewRequest(data);
                    setWorkflowState('dispatching');

                    // Optional: Browser Notification / Sound
                    // alert('새로운 출동 요청이 도착했습니다!');
                }
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const goToEvents = () => navigate('/events');

    // Report Modal State
    const [reportForm, setReportForm] = useState({
        customerName: '',
        cremation: '',
        ambulance: '',
        mortuary: '',
        notes: ''
    });

    const handleReportChange = (e) => {
        const { name, value } = e.target;
        setReportForm(prev => ({ ...prev, [name]: value }));
    };

    // simulation handlers
    const triggerDispatch = () => setWorkflowState('dispatching');
    const acceptDispatch = () => {
        setWorkflowState('accepted');
        // Notify Admin
        localStorage.setItem('dispatch_accepted_v2', JSON.stringify({
            acceptedAt: new Date().toISOString(),
            partnerName: userName // "김지훈"
        }));
    };
    const openReportModal = () => setWorkflowState('reporting');

    const submitReport = () => {
        // Validation
        if (!reportForm.customerName) {
            triggerToast("의뢰인(상주) 성함을 입력해주세요");
            return;
        }

        const id = 1;
        const submitData = {
            customerName: reportForm.customerName,
            place: reportForm.mortuary || "장소 미정",
            dispatchTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            notes: reportForm.notes,
            cremation: reportForm.cremation,
            ambulance: reportForm.ambulance
        };

        // Save to LocalStorage
        localStorage.setItem(`event_${id}_preliminary`, JSON.stringify(submitData));
        localStorage.setItem(`event_${id}_preliminary_done`, 'true');

        // Ensure status is ongoing
        if (!localStorage.getItem(`event_${id}_status`)) {
            localStorage.setItem(`event_${id}_status`, 'ongoing');
        }

        // Update UI immediately
        setActiveEvent({
            name: `${submitData.customerName}님 (의뢰)`,
            place: submitData.place
        });
        setWorkflowState('active');
        triggerToast("본사로 선행보고가 전송되었습니다");
    };

    const resetFlow = () => {
        setWorkflowState('idle');
        setReportForm({ customerName: '', cremation: '', ambulance: '', mortuary: '', notes: '' });
        setActiveEvent(null);
        // Clean localStorage for testing
        const id = 1;
        localStorage.removeItem(`event_${id}_preliminary`);
        localStorage.removeItem(`event_${id}_preliminary_done`);
        localStorage.removeItem(`event_${id}_consultation`);
        localStorage.removeItem(`event_${id}_status`);
    };

    return (
        <div className="pb-12 bg-brand-bg min-h-screen relative">
            {/* Toast Notification */}
            <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />

            {/* Minimal Header with Settings */}
            <Top
                rightAction={
                    <div className="flex items-center gap-3">
                        {/* Dev Toggle for Workflow */}
                        {workflowState === 'idle' && (
                            <button
                                onClick={triggerDispatch}
                                className="text-[12px] bg-red-100 text-red-600 px-2 py-1 rounded font-bold animate-pulse"
                            >
                                [테스트] 출동 요청
                            </button>
                        )}
                        {/* Always show Reset for Dev/Prototype ease */}
                        <button
                            onClick={resetFlow}
                            className="text-[12px] bg-gray-200 px-2 py-1 rounded border border-gray-300"
                        >
                            초기화
                        </button>
                        <button onClick={() => navigate('/profile')}>
                            <Settings size={26} className="text-[#8B95A1]" />
                        </button>
                    </div>
                }
            />

            {/* Greeting */}
            <div className="px-[24px] pt-[12px] pb-[32px]">
                <h1 className="text-[26px] font-bold text-brand-black leading-snug tracking-tight">
                    안녕하세요, {userName}님<br />
                    {workflowState === 'active' ? "오늘도 힘내세요!" :
                        workflowState === 'accepted' ? "고객님과 통화 후\n선행보고를 작성해주세요" : "출동 대기 중입니다"}
                </h1>
            </div>

            {/* Notice Banner */}
            <div className="px-[20px] mb-[32px]">
                <div className="bg-white rounded-[20px] p-[18px] text-[#4E5968] text-[15px] shadow-sm flex items-center justify-between">
                    <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center mb-1">
                            <span
                                onClick={() => navigate('/notice')}
                                className="font-bold text-brand-black mr-2 cursor-pointer flex items-center gap-1 active:opacity-70"
                            >
                                공지사항 <ChevronRight size={14} className="text-gray-400" />
                            </span>
                            <span className="text-[11px] text-brand-orange bg-orange-50 px-1.5 py-0.5 rounded font-bold">New</span>
                        </div>
                        <div
                            onClick={() => navigate('/notice/1')}
                            className="text-[#8B95A1] truncate cursor-pointer hover:text-gray-600 transition-colors"
                        >
                            <span className="font-medium text-black">11월 1주차 정산금 지급 안내</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settlement Card */}
            <div className="px-[20px] mb-[24px]">
                <div onClick={() => navigate('/settlement/detail')} className="bg-white rounded-[24px] p-[26px] shadow-toss-sm relative overflow-hidden group active:scale-[0.98] transition-transform duration-200 cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[16px] font-semibold text-[#6B7684]">내 정산금</span>
                        <div className="text-[#D1D6DB]"><ChevronRight size={20} /></div>
                    </div>
                    <div className="text-[32px] font-bold text-brand-black tracking-tighter mt-1">
                        3,450,000<span className="text-[24px] font-semibold ml-1">원</span>
                    </div>
                    <div className="mt-5 pt-5 border-t border-[#F2F4F6] flex justify-between items-center">
                        <span className="text-[14px] font-medium text-[#8B95A1]">이번 주 지급 예정</span>
                        <span className="text-[15px] font-bold text-brand-orange bg-[rgba(255,114,37,0.08)] px-2 py-1 rounded-[6px]">11월 10일</span>
                    </div>
                </div>
            </div>

            {/* Status Board (Conditionally Rendered) */}
            <div className="px-[20px] gap-[16px] flex flex-col">
                <div className="mb-[4px]">
                    <span className="text-[19px] font-bold text-brand-black">현황</span>
                </div>

                {workflowState === 'active' ? (
                    /* Active State: Orange Card */
                    <div onClick={goToEvents} className="bg-[#FF7225] rounded-[24px] p-[24px] text-white shadow-md shadow-orange-200 cursor-pointer active:scale-[0.96] transition-all relative overflow-hidden min-h-[140px] flex flex-col justify-center">
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <div className="bg-white/20 backdrop-blur-md rounded-[10px] px-[10px] py-[4px] inline-flex items-center text-[12px] font-bold mb-3 border border-white/10">
                                    현재 진행 중
                                </div>
                                <h3 className="text-[22px] font-bold leading-tight tracking-tight">
                                    {activeEvent ? activeEvent.name : "진행 중인 행사"}<br />
                                    <span className="text-white/80 text-[16px] font-medium">{activeEvent ? activeEvent.place : "-"}</span>
                                </h3>
                            </div>
                            <div className="bg-white/20 p-3 rounded-full">
                                <ChevronRight size={24} className="text-white" />
                            </div>
                        </div>
                        <div className="relative z-10 mt-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDispatchViewOpen(true);
                                }}
                                className="text-white/70 text-[12px] underline bg-black/10 px-2 py-1 rounded"
                            >
                                배정 정보 보기
                            </button>
                        </div>
                        <div className="absolute top-[-20%] right-[-10%] w-[120px] h-[120px] bg-white/10 rounded-full blur-[30px]" />
                    </div>
                ) : workflowState === 'accepted' || workflowState === 'reporting' ? (
                    /* Accepted State: Prompts for Pre-Report */
                    <div className="bg-white border-2 border-brand-orange rounded-[24px] p-[24px] shadow-md flex flex-col items-center justify-center min-h-[160px] gap-4 animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[6px] bg-brand-orange"></div>
                        <div className="text-center">
                            <h3 className="text-[18px] font-bold text-brand-black mb-1">출동 접수가 완료되었습니다</h3>
                            <p className="text-[14px] text-[#6B7684]">고객님과 통화 후 선행보고를 작성해주세요</p>
                        </div>
                        <button
                            onClick={openReportModal}
                            className="w-full h-[52px] bg-brand-orange text-white rounded-[16px] font-bold text-[16px] shadow-md shadow-orange-100 flex items-center justify-center gap-2"
                        >
                            <FileEdit size={20} /> 선행보고 작성하기
                        </button>
                        <button
                            onClick={() => setIsDispatchViewOpen(true)}
                            className="text-[#8B95A1] text-[13px] font-medium underline"
                        >
                            출동 정보 다시보기
                        </button>
                    </div>
                ) : (
                    /* Idle State: Blue Queue Card */
                    <div onClick={() => navigate('/queue')} className="bg-gradient-to-br from-[#3182F6] to-[#1B64DA] rounded-[24px] p-[24px] text-white shadow-md shadow-blue-200 cursor-pointer active:scale-[0.96] transition-all relative overflow-hidden min-h-[140px] flex flex-col justify-center">
                        <div className="relative z-10">
                            <div className="text-[15px] font-medium text-white/90 mb-1">
                                대기 중
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-[32px] font-bold tracking-tighter">3순위</span>
                                <span className="text-[16px] font-medium text-white/80"></span>
                            </div>
                        </div>
                        <div className="absolute top-[-10%] right-[-10%] w-[100px] h-[100px] bg-white/10 rounded-full blur-[20px]" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[80px] h-[80px] bg-white/10 rounded-full blur-[20px]" />
                    </div>
                )}


            </div>

            {/* Queue Check Button (Added per request) */}
            <div className="px-[20px] mb-[32px] mt-[24px]">
                <div onClick={() => navigate('/queue')} className="bg-white rounded-[24px] p-[20px] shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-[16px]">
                        <div className="bg-[#F2F4F6] p-[10px] rounded-full text-brand-black">
                            <Clock size={24} />
                        </div>
                        <div className="text-[17px] font-bold text-brand-black">
                            실시간 순번 확인하기
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-[#D1D6DB]" />
                </div>
            </div>

            {/* Menu Grid */}
            <div className="px-[20px] mt-[48px]">
                <ListHeader>메뉴</ListHeader>
                <div className="grid grid-cols-2 gap-[14px] mt-[16px]">
                    <MenuCard
                        icon={<UserPlus size={24} className="text-brand-orange" />}
                        label="현장 가입 링크"
                        onClick={() => navigate('/business/invite')}
                    />
                    <MenuCard
                        icon={<BookOpen size={24} className="text-brand-orange" />}
                        label="정책/매뉴얼"
                        onClick={openManual}
                    />
                    <MenuCard
                        icon={<Gift size={24} className="text-[#FFC700]" />}
                        label="물품 신청"
                        onClick={() => navigate('/items/order')}
                    />
                    <MenuCard
                        icon={<Calendar size={24} className="text-[#4DA1F5]" />}
                        label="내 행사"
                        onClick={() => navigate('/events/history')}
                    />
                    <div className="col-span-2">
                        <MenuCard
                            icon={
                                <img src="/ribbon.png" alt="부고" className="w-[40px] h-[40px] object-contain" />
                            }
                            label="부고"
                            onClick={() => triggerToast("준비중입니다")}
                            className="items-center"
                        />
                    </div>
                </div>
            </div>

            {/* --- WORKFLOW MODALS --- */}

            {/* 1. Dispatch Notification Modal (Raw Data/View Mode) */}
            {
                (workflowState === 'dispatching' || isDispatchViewOpen) && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white w-full max-w-[480px] rounded-t-[24px] p-[24px] pb-[40px] animate-slide-up max-h-[85vh] flex flex-col">
                            <div className="flex flex-col items-center mb-6 shrink-0 relative">
                                {/* Close Button for View Mode */}
                                {workflowState !== 'dispatching' && (
                                    <button
                                        onClick={() => setIsDispatchViewOpen(false)}
                                        className="absolute right-0 top-0 text-[#8B95A1] p-2"
                                    >
                                        <X size={24} />
                                    </button>
                                )}

                                <div className="w-[48px] h-[48px] bg-brand-orange text-white rounded-full flex items-center justify-center mb-3 shadow-lg shadow-orange-200">
                                    <AlertCircle size={28} />
                                </div>
                                <h2 className="text-[22px] font-bold text-brand-black">
                                    {workflowState === 'dispatching' ? "신규 장례 배정" : "배정된 장례 정보"}
                                </h2>
                                <p className="text-[#6B7684] text-[15px]">
                                    {workflowState === 'dispatching' ? "고객 정보를 확인하고 수락해주세요." : "배정된 고객 및 장례 정보입니다."}
                                </p>
                            </div>

                            {/* Scrollable Raw Text Area */}
                            <div className="bg-[#F2F4F6] rounded-[16px] p-[20px] mb-6 overflow-y-auto grow custom-scrollbar">
                                <pre className="whitespace-pre-wrap font-sans text-[15px] text-[#333D4B] leading-relaxed">
                                    {getDispatchText()}
                                </pre>

                                {/* Attachment Viewer */}
                                {currentRequest.attachedFile && (
                                    <div className="mt-4 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                                        <div className="text-[13px] text-blue-600 font-bold mb-2 flex items-center gap-1">
                                            <FileText size={16} /> 첨부된 서류가 있습니다
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="text-[14px] text-gray-800 font-medium truncate flex-1 mr-2">
                                                {currentRequest.attachedFile.name}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const win = window.open();
                                                    win.document.write(
                                                        `<iframe src="${currentRequest.attachedFile.data}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
                                                    );
                                                }}
                                                className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-200 hover:bg-blue-100"
                                            >
                                                보기
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 shrink-0">
                                {workflowState === 'dispatching' ? (
                                    <>
                                        <button className="flex-1 h-[52px] bg-[#E8F3FF] text-[#1B64DA] rounded-[16px] font-bold text-[16px] flex items-center justify-center gap-2">
                                            <Phone size={20} /> 전화 걸기
                                        </button>
                                        <button
                                            onClick={acceptDispatch}
                                            className="flex-1 h-[52px] bg-brand-orange text-white rounded-[16px] font-bold text-[16px] shadow-md shadow-orange-200/50"
                                        >
                                            출동 수락
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsDispatchViewOpen(false)}
                                        className="flex-1 h-[52px] bg-[#F2F4F6] text-[#4E5968] rounded-[16px] font-bold text-[16px]"
                                    >
                                        닫기
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* 2. Preliminary Report Modal (Detailed Form) - UPDATED */}
            {
                workflowState === 'reporting' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                        <div className="bg-white w-full max-w-[400px] rounded-[24px] p-[24px] relative animate-scale-in max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-[20px] font-bold text-brand-black">선행보고 작성</h2>
                                <button onClick={() => setWorkflowState('accepted')}><X size={24} className="text-[#B0B8C1]" /></button>
                            </div>

                            <div className="bg-[#FFF5F1] p-3 rounded-[12px] text-[13px] text-brand-orange mb-6">
                                * 고객님과 통화하여 확인된 내용을 바탕으로 작성해주세요.
                            </div>

                            <div className="space-y-5 mb-8">
                                <InputGroup label="의뢰인(상주) 성함">
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={reportForm.customerName}
                                        onChange={handleReportChange}
                                        placeholder="예: 홍길동"
                                        className="w-full h-[48px] px-3 rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] focus:border-brand-orange outline-none"
                                    />
                                </InputGroup>

                                <InputGroup label="화장 예약 (날짜/장소)">
                                    <input
                                        type="text"
                                        name="cremation"
                                        value={reportForm.cremation}
                                        onChange={handleReportChange}
                                        placeholder="예: 1/28 서울시립승화원"
                                        className="w-full h-[48px] px-3 rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] focus:border-brand-orange outline-none"
                                    />
                                </InputGroup>

                                <InputGroup label="앰뷸런스 이송">
                                    <input
                                        type="text"
                                        name="ambulance"
                                        value={reportForm.ambulance}
                                        onChange={handleReportChange}
                                        placeholder="예: 이송 배차 완료"
                                        className="w-full h-[48px] px-3 rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] focus:border-brand-orange outline-none"
                                    />
                                </InputGroup>

                                <InputGroup label="빈소 예약 여부">
                                    <input
                                        type="text"
                                        name="mortuary"
                                        value={reportForm.mortuary}
                                        onChange={handleReportChange}
                                        placeholder="예: 50평 예약 예정"
                                        className="w-full h-[48px] px-3 rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] focus:border-brand-orange outline-none"
                                    />
                                </InputGroup>

                                <InputGroup label="특이사항">
                                    <textarea
                                        name="notes"
                                        value={reportForm.notes}
                                        onChange={handleReportChange}
                                        placeholder="빈소 현황, 특이사항 등 입력"
                                        className="w-full h-[80px] p-3 rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] focus:border-brand-orange outline-none resize-none"
                                    />
                                </InputGroup>
                            </div>

                            <button
                                onClick={submitReport}
                                className="w-full h-[52px] bg-brand-black text-white rounded-[16px] font-bold text-[16px]"
                            >
                                보고 완료 및 출동
                            </button>
                        </div>
                    </div>
                )
            }

            {/* 3. Manual Viewer Modal (Ported from GAS) */}
            <ViewerModal
                isOpen={manualModal.isOpen}
                onClose={() => setManualModal({ ...manualModal, isOpen: false })}
                url={manualModal.url}
                title="정책/매뉴얼"
            />

        </div >
    );
};

const InputGroup = ({ label, children }) => (
    <div>
        <label className="block text-[14px] font-bold text-[#4E5968] mb-2">{label}</label>
        {children}
    </div>
)

// Polished MenuCard
const MenuCard = ({ icon, label, onClick, className = '' }) => (
    <div
        onClick={onClick}
        className={`bg-white rounded-[20px] px-[20px] py-[20px] flex flex-col justify-center gap-[10px] shadow-sm border border-[#F2F4F6] transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${onClick ? 'active:bg-[#F9FAFB] active:scale-[0.98]' : ''} ${className}`}
    >
        <div className="w-fit">{icon}</div>
        <span className="text-[15px] font-bold text-[#4E5968] tracking-tight">{label}</span>
    </div>
);

// Viewer Modal Component (Ported from GAS)
const ViewerModal = ({ isOpen, onClose, url, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#F2F4F6] animate-fade-in">
            {/* Header */}
            <div className="bg-white px-4 py-3 flex justify-between items-center shadow-sm z-50 shrink-0">
                <h2 className="font-bold text-[#333D4B] truncate text-[17px]">{title}</h2>
                <button
                    onClick={onClose}
                    className="bg-[#F2F4F6] text-[#4E5968] px-4 py-2 rounded-[12px] text-[14px] font-bold active:bg-[#E5E8EB]"
                >
                    닫기
                </button>
            </div>

            {/* Content Frame */}
            <div className="flex-grow relative w-full h-full bg-white">
                <iframe
                    src={url}
                    className="w-full h-full border-0"
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />

                {/* Fallback Overlay (Visible if iframe fails/blocks) */}
                <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
                    <div className="bg-black/70 text-white px-4 py-2 rounded-full text-[13px] backdrop-blur-md shadow-lg pointer-events-auto flex items-center gap-2 animate-bounce-slight">
                        <span>혹시 화면이 안 보이시나요?</span>
                        <button
                            onClick={() => window.open(url, '_blank')}
                            className="underline font-bold text-brand-orange"
                        >
                            새 창으로 열기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
