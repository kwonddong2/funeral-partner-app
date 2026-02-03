import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Top from '../components/tds/Top';
import Button from '../components/tds/Button';
import Toast from '../components/tds/Toast';
import { Phone, CheckCircle2, AlertTriangle, ArrowRight, User, PauseCircle, PlayCircle } from 'lucide-react';

const QueueStatus = () => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [isExcluded, setIsExcluded] = useState(false); // Mock state for exclusion

    // 1. Mock Data
    const [instructors, setInstructors] = useState([
        { name: '김철수', status: 'waiting', lastActionTime: new Date(Date.now() - 1000 * 60 * 60 * 5) },
        { name: '이영희', status: 'waiting', lastActionTime: new Date(Date.now() - 1000 * 60 * 60 * 2) },
        { name: '박민수', status: 'active', lastActionTime: new Date(Date.now() - 1000 * 60 * 60 * 24) },
        { name: '최지훈', status: 'waiting', lastActionTime: new Date(Date.now() - 1000 * 60 * 30) },
        { name: '정다은', status: 'waiting', lastActionTime: new Date(Date.now() - 1000 * 60 * 60 * 10) },
    ]);

    const [myStatus, setMyStatus] = useState({ name: '김지훈', status: 'waiting' });

    // Update time
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const getHotline = () => {
        const hour = currentTime.getHours();
        const isNightShift = hour >= 21 || hour < 7;
        if (!isNightShift) return null;

        const days = ["일", "월", "화", "수", "목", "금", "토"];
        let dayIdx = currentTime.getDay();
        if (hour < 7) dayIdx = dayIdx === 0 ? 6 : dayIdx - 1;

        const schedule = {
            "월": { name: "김담당", phone: "010-1234-5678" },
            "화": { name: "이담당", phone: "010-1234-5678" },
            "수": { name: "박담당", phone: "010-1234-5678" },
            "목": { name: "최담당", phone: "010-1234-5678" },
            "금": { name: "정담당", phone: "010-1234-5678" },
            "토": { name: "주말팀", phone: "010-9999-9999" },
            "일": { name: "주말팀", phone: "010-9999-9999" },
        };
        return schedule[days[dayIdx]];
    };

    const hotline = getHotline();

    const sortedQueue = [...instructors].sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return 1;
        if (a.status !== 'active' && b.status === 'active') return -1;
        return a.lastActionTime - b.lastActionTime;
    });

    const handleReturn = () => {
        if (isExcluded) {
            setIsExcluded(false);
            setToastMsg("순번 복귀가 완료되었습니다.");
            setShowToast(true);
        } else {
            // Already returning logic? 
            setToastMsg("이미 대기 중입니다.");
            setShowToast(true);
        }
    };

    const handleExclude = () => {
        setIsExcluded(true);
        setToastMsg("순번 제외(휴식) 신청이 완료되었습니다.");
        setShowToast(true);
    };

    return (
        <div className="bg-[#F2F4F6] min-h-screen pb-12 relative font-sans">
            <Top title="순번 현황" showBack={true} onBack={() => navigate('/dashboard')} className="bg-white" />

            {/* Hotline */}
            {hotline ? (
                <div className="bg-[#FFF5F1] p-4 flex flex-col items-center justify-center border-b border-[#FFEFEA]">
                    <span className="text-[#FF5F2C] font-bold text-[13px] mb-1 flex items-center gap-1">
                        <AlertTriangle size={14} /> 야간 긴급 핫라인 (21시~07시)
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-[#333D4B] font-bold">{hotline.name}</span>
                        <a href={`tel:${hotline.phone}`} className="text-[18px] font-bold text-[#333D4B] border-b-2 border-[#FF5F2C] leading-none pb-[1px]">
                            {hotline.phone}
                        </a>
                    </div>
                </div>
            ) : null}

            <div className="px-5 pt-6">
                {/* My Status Card */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm mb-8">
                    <div className="text-[14px] font-bold text-[#8B95A1] mb-2">나의 현재 상태</div>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-[48px] h-[48px] rounded-full flex items-center justify-center ${isExcluded ? 'bg-[#FFEFEA] text-[#FF5F2C]' : 'bg-[#F2F4F6] text-[#B0B8C1]'}`}>
                                {isExcluded ? <PauseCircle size={24} /> : <User size={24} />}
                            </div>
                            <div>
                                <div className="text-[22px] font-bold text-[#191F28] leading-tight">
                                    {myStatus.name}님
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    {isExcluded ? (
                                        <span className="text-[14px] font-bold text-[#FF5F2C] bg-[#FFF5F1] px-2 py-0.5 rounded-[6px]">
                                            순번 제외 (휴식 중)
                                        </span>
                                    ) : (
                                        <span className="text-[14px] font-bold text-[#FF7225] bg-[#FFF5F1] px-2 py-0.5 rounded-[6px]">
                                            3순위 대기 중
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {isExcluded ? (
                            <Button
                                variant="primary"
                                size="medium"
                                className="w-full font-bold"
                                onClick={handleReturn}
                            >
                                <PlayCircle size={18} className="mr-2" /> 순번 복귀 하기
                            </Button>
                        ) : (
                            <Button
                                variant="secondary"
                                size="medium"
                                className="w-full bg-[#F2F4F6] text-[#4E5968] font-bold border-0 hover:bg-[#E5E8EB]"
                                onClick={handleExclude}
                            >
                                <PauseCircle size={18} className="mr-2" /> 순번 제외 신청
                            </Button>
                        )}
                    </div>
                </div>

                {/* Queue List */}
                <div className="flex items-center justify-between mb-3 px-1">
                    <h2 className="text-[18px] font-bold text-[#191F28]">실시간 순번</h2>
                    <span className="text-[13px] text-[#8B95A1]">
                        {currentTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 기준
                    </span>
                </div>

                <div className="bg-white rounded-[24px] shadow-sm overflow-hidden">
                    {sortedQueue.map((item, index) => {
                        const isActive = item.status === 'active';
                        const rank = index + 1;
                        const isMe = item.name === '최지훈'; // Highlight mock

                        return (
                            <div key={index} className={`flex items-center justify-between py-4 px-6 border-b border-[#F2F4F6] last:border-0 ${isMe ? 'bg-[#F9FAFB]' : ''}`}>
                                <div className="flex items-center gap-4">
                                    {/* Rank Column: Empty if Active */}
                                    <span className={`text-[16px] font-bold w-[24px] text-center ${rank <= 3 && !isActive ? 'text-[#FF7225]' : 'text-[#8B95A1]'}`}>
                                        {isActive ? '' : rank}
                                    </span>
                                    <span className={`text-[16px] font-bold ${isActive ? 'text-[#B0B8C1]' : 'text-[#333D4B]'}`}>
                                        {item.name}
                                    </span>
                                </div>
                                <div>
                                    {isActive ? (
                                        <span className="text-[13px] font-bold text-[#3182F6] bg-[#E8F3FF] px-2.5 py-1.5 rounded-[8px]">
                                            장례 중
                                        </span>
                                    ) : (
                                        <span className="text-[13px] font-medium text-[#8B95A1] bg-[#F2F4F6] px-2.5 py-1.5 rounded-[8px]">
                                            대기 중
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Info */}
                <div className="mt-6 bg-white p-5 rounded-[20px] shadow-sm text-[13px] text-[#8B95A1] leading-relaxed flex gap-3">
                    <div className="shrink-0 pt-0.5 text-[#FFD400]">💡</div>
                    <div>
                        <strong className="text-[#333D4B] block mb-1">안내</strong>
                        장례가 종료되면 자동으로 가장 하위 순번으로 복귀합니다.<br />
                        개인 사정으로 인한 순번 제외는 '순번 제외 신청'을 이용해주세요.
                    </div>
                </div>
            </div>

            <Toast message={toastMsg} isVisible={showToast} onClose={() => setShowToast(false)} />
        </div>
    );
};

export default QueueStatus;
