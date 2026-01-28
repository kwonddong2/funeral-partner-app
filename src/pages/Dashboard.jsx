import React, { useState } from 'react';
import { Settings, RefreshCw, BookOpen, Gift, Download, FileEdit, ChevronRight, CheckCircle2, Phone, X, MapPin, Clock, FileText, AlertCircle } from 'lucide-react';
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

    // Toast State
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    // Trigger Toast Helper
    const triggerToast = (msg) => {
        setToastMessage(msg);
        setShowToast(true);
    }

    // Mock Data for Dispatch (Real-world Raw Text)
    const rawDispatchText = `[파트너 전달사항]
2024 상품표, 2025 상품표, 할인, 선납금 등 명확하게 기재하고자 합니다. 명확하지 않은 경우 본사로 꼭 연락주세요.
성함 : 홍길동
휴대폰번호 : 010-3791-6598
장례희망지역 : 경기 하남시
임종위치 : 자택 (호스피스 병동 퇴원)

[고객 특이사항]
- 관계 : 누나
[고인(예정인) 정보]
- 관계 : 동생
- 경기도 남양주시 시민
- 고객 임박도 : 호스피스 병동 / 얼마 안 남으신 상황
- 기가입 상조 X

[장례식장] 하남시 마루공원 무빈소장 희망
[장지] 화장 : 성남 화장장 관외
[상조] 2026 고이 무빈소장 159
[추가, 공제 필요 내역] 장례 최대한 간소화하게 치르고 싶어하시는 고객님이셔서, 불필요하다고 생각하는 부분에 대해서는 공제 필요합니다.`;

    const goToEvents = () => navigate('/events');

    // simulation handlers
    const triggerDispatch = () => setWorkflowState('dispatching');
    const acceptDispatch = () => setWorkflowState('accepted'); // Decoupled: Go to 'Accepted' state first
    const openReportModal = () => setWorkflowState('reporting');
    const submitReport = () => {
        setWorkflowState('active');
        triggerToast("본사로 선행보고가 전송되었습니다");
    }
    const resetFlow = () => setWorkflowState('idle');

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
                        {workflowState === 'active' && (
                            <button
                                onClick={resetFlow}
                                className="text-[12px] bg-gray-200 px-2 py-1 rounded border border-gray-300"
                            >
                                초기화
                            </button>
                        )}
                        <Settings size={26} className="text-[#8B95A1]" />
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
                    <div>
                        <span className="font-bold text-brand-black mr-2">공지사항</span>
                        <span className="text-[#8B95A1]">공지사항이 없습니다</span>
                    </div>
                </div>
            </div>

            {/* Settlement Card */}
            <div className="px-[20px] mb-[24px]">
                <div className="bg-white rounded-[24px] p-[26px] shadow-toss-sm relative overflow-hidden group active:scale-[0.98] transition-transform duration-200">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[16px] font-semibold text-[#6B7684]">내 정산금</span>
                        <div className="text-[#D1D6DB]"><ChevronRight size={20} /></div>
                    </div>
                    <div className="text-[32px] font-bold text-brand-black tracking-tighter mt-1">
                        3,450,000<span className="text-[24px] font-semibold ml-1">원</span>
                    </div>
                    <div className="mt-5 pt-5 border-t border-[#F2F4F6] flex justify-between items-center">
                        <span className="text-[14px] font-medium text-[#8B95A1]">이번 달 지급 예정</span>
                        <span className="text-[15px] font-bold text-brand-orange bg-[rgba(255,114,37,0.08)] px-2 py-1 rounded-[6px]">11월 25일</span>
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
                                    홍길동님 빈소<br />
                                    <span className="text-white/80 text-[16px] font-medium">하남시 마루공원 무빈소</span>
                                </h3>
                            </div>
                            <div className="bg-white/20 p-3 rounded-full">
                                <ChevronRight size={24} className="text-white" />
                            </div>
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
                    </div>
                ) : (
                    /* Idle State: Blue Queue Card */
                    <div className="bg-gradient-to-br from-[#3182F6] to-[#1B64DA] rounded-[24px] p-[24px] text-white shadow-md shadow-blue-200 cursor-pointer active:scale-[0.96] transition-all relative overflow-hidden min-h-[140px] flex flex-col justify-center">
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

                {/* Monthly Stats Card */}
                <div onClick={goToEvents} className="bg-white rounded-[24px] p-[24px] shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-[16px]">
                        <div className="bg-[#F2F4F6] p-[12px] rounded-full text-brand-black">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <div className="text-[14px] text-[#6B7684] font-medium mb-1">
                                이번 달 완료된 행사
                            </div>
                            <div className="text-[20px] font-bold text-brand-black">
                                4건
                            </div>
                        </div>
                    </div>
                    <ChevronRight size={20} className="text-[#D1D6DB]" />
                </div>
            </div>

            {/* Menu Grid */}
            <div className="px-[20px] mt-[48px]">
                <ListHeader>메뉴</ListHeader>
                <div className="grid grid-cols-2 gap-[14px] mt-[16px]">
                    <MenuCard icon={<RefreshCw size={24} className="text-brand-orange" />} label="고이 패키지" />
                    <MenuCard icon={<BookOpen size={24} className="text-brand-orange" />} label="정책/매뉴얼" />
                    <MenuCard icon={<Gift size={24} className="text-[#FFC700]" />} label="물품 신청" />
                    <MenuCard icon={<RefreshCw size={24} className="text-brand-black" />} label="순번 복귀" />
                    <MenuCard icon={<Download size={24} className="text-[#4DA1F5]" />} label="서류 다운로드" />
                    <MenuCard icon={<FileEdit size={24} className="text-[#4DA1F5]" />} label="내 후기/리포트" />
                </div>
            </div>

            {/* --- WORKFLOW MODALS --- */}

            {/* 1. Dispatch Notification Modal (Raw Data) */}
            {workflowState === 'dispatching' && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-[480px] rounded-t-[24px] p-[24px] pb-[40px] animate-slide-up max-h-[85vh] flex flex-col">
                        <div className="flex flex-col items-center mb-6 shrink-0">
                            <div className="w-[48px] h-[48px] bg-brand-orange text-white rounded-full flex items-center justify-center mb-3 shadow-lg shadow-orange-200">
                                <AlertCircle size={28} />
                            </div>
                            <h2 className="text-[22px] font-bold text-brand-black">신규 장례 배정</h2>
                            <p className="text-[#6B7684] text-[15px]">고객 정보를 확인하고 수락해주세요.</p>
                        </div>

                        {/* Scrollable Raw Text Area */}
                        <div className="bg-[#F2F4F6] rounded-[16px] p-[20px] mb-6 overflow-y-auto grow custom-scrollbar">
                            <pre className="whitespace-pre-wrap font-sans text-[15px] text-[#333D4B] leading-relaxed">
                                {rawDispatchText}
                            </pre>
                        </div>

                        <div className="flex gap-3 shrink-0">
                            <button className="flex-1 h-[52px] bg-[#E8F3FF] text-[#1B64DA] rounded-[16px] font-bold text-[16px] flex items-center justify-center gap-2">
                                <Phone size={20} /> 전화 걸기
                            </button>
                            <button
                                onClick={acceptDispatch}
                                className="flex-1 h-[52px] bg-brand-orange text-white rounded-[16px] font-bold text-[16px] shadow-md shadow-orange-200/50"
                            >
                                출동 수락
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Preliminary Report Modal (Detailed Form) */}
            {workflowState === 'reporting' && (
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
                            <InputGroup label="화장 예약 (날짜/장소)">
                                <input type="text" placeholder="예: 1/28 서울시립승화원" className="w-full h-[48px] px-3 rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] focus:border-brand-orange outline-none" />
                            </InputGroup>

                            <InputGroup label="앰뷸런스 이송">
                                <input type="text" placeholder="예: 이송 배차 완료" className="w-full h-[48px] px-3 rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] focus:border-brand-orange outline-none" />
                            </InputGroup>

                            <InputGroup label="빈소 예약 여부">
                                <input type="text" placeholder="예: 50평 예약 예정" className="w-full h-[48px] px-3 rounded-[12px] bg-[#F9FAFB] border border-[#E5E8EB] focus:border-brand-orange outline-none" />
                            </InputGroup>

                            <InputGroup label="특이사항">
                                <textarea
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
            )}

        </div>
    );
};

const InputGroup = ({ label, children }) => (
    <div>
        <label className="block text-[14px] font-bold text-[#4E5968] mb-2">{label}</label>
        {children}
    </div>
)

// Polished MenuCard
const MenuCard = ({ icon, label }) => (
    <div className="bg-white rounded-[20px] px-[20px] py-[20px] flex flex-col justify-center gap-[10px] shadow-sm border border-[#F2F4F6] active:bg-[#F9FAFB] active:scale-[0.98] transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5">
        <div className="w-fit">{icon}</div>
        <span className="text-[15px] font-bold text-[#4E5968] tracking-tight">{label}</span>
    </div>
);


export default Dashboard;
