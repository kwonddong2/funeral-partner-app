import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Camera, Check, ArrowLeft, Upload, ChevronRight } from 'lucide-react';
import Top from '../components/tds/Top';
import Button from '../components/tds/Button';
import Toast from '../components/tds/Toast';

const DailyReport = () => {
    const { id, day } = useParams(); // day: '1', '2', '3'
    const navigate = useNavigate();
    const currentDay = parseInt(day) || 1;

    const [showToast, setShowToast] = useState(false);

    // --- Mock Data ---
    // 1. Get Product State
    const savedProduct = localStorage.getItem(`event_${id}_product`) || "";
    const isNoMortuary = savedProduct.includes("무빈소");

    const rawChecklists = {
        1: [
            {
                category: "고객 첫 통화",
                items: [
                    "본인 소개와 함께 짧게 감정을 추스를 수 있는 위로의 말씀을 전달해주세요.",
                    "신분증, 사망진단서 등 고객이 필수적으로 준비해야 할 사항을 안내해주세요.",
                    "슬리퍼, 벨트, 세면도구 등 더 챙기면 좋은 준비사항도 가능하면 안내해주세요."
                ]
            },
            {
                category: "장례식장 변경",
                items: [
                    "장례식장을 불가피하게 변경해야 할 경우, 전후 사정에 대해 고객과 충분히 소통했나요?",
                    "장례식장 변경에 대해 본사에 즉시 알렸나요?"
                ]
            },
            {
                category: "첫 상담",
                items: [
                    "수의, 유골함 업그레이드 시 고객이 자발적으로 선택했나요?",
                    "제단꽃 장례식장 대신 결제받은 경우 고객에게 충분히 업셀링이 아님을 설명해주세요.",
                    "접객도우미 초과 근무시 추가금에 대해 미리 충분히 안내했나요?", // Mortuary Only
                ]
            },
            {
                category: "빈소 설치 후", // Mortuary Only
                isMortuaryOnly: true,
                items: [
                    "접객도우미 분들에게 음식 낭비 관리에 대해 교육하셨나요?",
                    "가족분들에게 조문객 받는 요령, 조문예절을 알려드렸나요?"
                ]
            },
            {
                category: "퇴근",
                items: [
                    "퇴근 시 고객에게 내일 일정에 대해 충분히 소통하셨나요?",
                    "기타 문제가 발생한 것이 있다면 본사에 보고해주세요."
                ]
            }
        ],
        2: [
            {
                category: "입관 예식 준비 및 진행",
                items: [
                    "입관 전 유족과 라포를 형성할 수 있는 대화를 시도했다 (헌화꽃, 가족 대화 등)",
                    "헌화 꽃 만들기, 용품 준비 등 유족과 함께하는 활동을 통해 관계를 형성했다",
                    "입관 전, 이별식을 의미 있게 준비하기 위해 유족과 상의해 예를들어 헌화, 음악 등을 조율했다",
                    "꽃바구니, 편지 등 이별에 감정을 실을 수 있는 요소를 사전에 준비했다",
                    "입관 절차 전후로 고인을 기리는 시간과 공간을 조성했다 (조용한 묵념, 설명 등)",
                    "정해진 입관 시간에 맞춰 준비하고 안내했다",
                    "종교에 맞는 입관 절차와 언어를 사전에 준비하고 적용했다",
                    "입관식 중 설명 없이 절차를 생략하지 않고, 주요 장면마다 의미를 전달했다",
                    "입관의 의미를 유족이 이해할 수 있도록 설명했다",
                    "입관 중 투박하지 않고, 감정을 해치지 않는 언어와 태도로 진행했다",
                    "입관을 기억에 남을 장면으로 연출했다",
                    "종교적 의식이 있을 경우 의미와 절차를 사전 설명했다",
                    "입관 후 성복제의 의미를 안내하고 종교가 있을 경우 진행하지 않았다",
                    "유족에게 3일차 발인 및 일정 관련 안내를 상세히 전달했다 (일반장/가족장)",
                    "이별식에 감정을 추스르는 행동으로 유족분들을 케어했다"
                ]
            }
        ],
        3: [
            {
                category: "발인 및 종료",
                items: [
                    "발인 물품 최종 점검",
                    "화장장 예약 확인"
                ]
            }
        ]
    };

    // Filter Checklists
    const checklists = {};
    Object.keys(rawChecklists).forEach(dayKey => {
        checklists[dayKey] = rawChecklists[dayKey].filter(group => {
            // 1. Remove entire groups if marked as Mortuary Only (e.g., "빈소 설치 후")
            if (isNoMortuary && group.isMortuaryOnly) return false;
            return true;
        }).map(group => {
            // 2. Filter specific items inside groups
            if (isNoMortuary) {
                const newItems = group.items.filter(item => {
                    const blacklistedKeywords = [
                        "슬리퍼",
                        "제단꽃",
                        "접객도우미"
                    ];
                    return !blacklistedKeywords.some(keyword => item.includes(keyword));
                });
                return { ...group, items: newItems };
            }
            return group;
        });
    });


    const rawPhotoSlots = [
        "장례식장 전경", "이행완료확인서", "장례 일정표",
        "근조기", "조문", "제단꽃",
        "접객도우미",
        "입관용품", "입관식진행", "성복제", "식사안내", "빈소꽃확인"
    ];

    // Filter Photos
    const photoSlots = rawPhotoSlots.filter(slot => {
        // STRICT SEPARATION OF DAYS
        if (currentDay === 1) {
            const day1Slots = ["장례식장 전경", "이행완료확인서", "장례 일정표", "근조기", "조문", "제단꽃", "접객도우미"];
            if (!day1Slots.includes(slot)) return false; // Filter out Day 2 stuff

            if (isNoMortuary) {
                const mortuaryOnlySlots = ["장례 일정표", "근조기", "조문", "제단꽃", "접객도우미"];
                return !mortuaryOnlySlots.includes(slot);
            }
            return true;
        }

        if (currentDay === 2) {
            const day2Slots = ["입관용품", "입관식진행", "성복제", "식사안내", "빈소꽃확인"];
            if (!day2Slots.includes(slot)) return false; // Filter out Day 1 stuff

            if (isNoMortuary && slot === "빈소꽃확인") return false;
            return true;
        }

        return false; // Default safe (e.g. Day 3)
    });

    // --- State ---
    const [checkedItems, setCheckedItems] = useState({});
    const [photos, setPhotos] = useState({}); // { "장례식장 전경": "url" }

    // Logic: Unlocking Days
    const isDay1Done = localStorage.getItem(`event_${id}_day_1_done`) === 'true';
    const isDay2Done = localStorage.getItem(`event_${id}_day_2_done`) === 'true';

    // Day 1 always open. Day 2 opens if Day 1 done. Day 3 opens if Day 2 done.
    const unlockedDays = [1];
    if (isDay1Done) unlockedDays.push(2);
    if (isDay2Done) unlockedDays.push(3);

    const toggleCheck = (categoryWithIdx) => {
        setCheckedItems(prev => ({
            ...prev,
            [categoryWithIdx]: !prev[categoryWithIdx]
        }));
    };

    const handlePhotoUpload = (slot) => {
        // Simulation
        const mockUrl = "https://via.placeholder.com/150/FF7225/FFFFFF?text=Photo";
        setPhotos(prev => ({ ...prev, [slot]: mockUrl }));
    };

    const handleSubmit = () => {
        // Save Day Completion Status
        localStorage.setItem(`event_${id}_day_${currentDay}_done`, 'true');

        // Save Timestamp
        const now = new Date();
        const formattedDate = `${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        localStorage.setItem(`event_${id}_day_${currentDay}_date`, formattedDate);

        setShowToast(true);
        setTimeout(() => navigate(`/events/${id}`), 1500);
    };

    const handleTabChange = (d) => {
        if (!unlockedDays.includes(d)) {
            alert("이전 단계 보고를 먼저 완료해주세요.");
            return;
        }
        navigate(`/events/${id}/report/daily/${d}`);
    };

    return (
        <div className="pb-24 bg-brand-bg min-h-screen relative">
            <Top
                title={`${currentDay}일차 보고`}
                showBack={true}
                onBack={() => navigate(`/events/${id}`)}
            />

            {/* Tabs */}
            <div className="bg-white border-b border-[#F2F4F6] flex">
                {(isNoMortuary ? [1, 2] : [1, 2, 3]).map(d => {
                    const isLocked = !unlockedDays.includes(d);
                    return (
                        <button
                            key={d}
                            onClick={() => handleTabChange(d)}
                            disabled={isLocked}
                            className={`flex-1 h-[48px] text-[15px] font-bold transition-colors relative flex items-center justify-center gap-1
                                ${currentDay === d ? 'text-brand-black' : isLocked ? 'text-[#D1D6DB] cursor-not-allowed' : 'text-[#B0B8C1]'}`}
                        >
                            {d}일차
                            {isLocked && <div className="w-[4px] h-[4px] bg-[#D1D6DB] rounded-full" />}
                            {currentDay === d && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-black"></div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="px-[20px] pt-[24px] space-y-[32px]">

                {/* Checklist Section */}
                <div>
                    <h2 className="text-[19px] font-bold text-brand-black mb-[16px]">체크리스트</h2>
                    <div className="space-y-[16px]">
                        {checklists[currentDay]?.map((group, gIdx) => (
                            <div key={gIdx}>
                                <h3 className="text-[15px] font-bold text-[#333D4B] mb-[12px]">{group.category}</h3>
                                <div className="bg-white rounded-[20px] shadow-sm overflow-hidden border border-[#F2F4F6]">
                                    {group.items.map((item, iIdx) => {
                                        const uniqueKey = `${currentDay}-${gIdx}-${iIdx}`;
                                        const isChecked = checkedItems[uniqueKey];
                                        return (
                                            <div
                                                key={iIdx}
                                                onClick={() => toggleCheck(uniqueKey)}
                                                className={`p-[20px] flex gap-[12px] items-start border-b border-[#F2F4F6] last:border-0 active:bg-[#F9FAFB] cursor-pointer transition-colors`}
                                            >
                                                <div className="flex-1 text-[15px] text-[#4E5968] leading-relaxed">
                                                    {item}
                                                </div>
                                                <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0 transition-colors
                                                    ${isChecked ? 'bg-brand-orange text-white' : 'bg-[#E5E8EB] text-white'}`}>
                                                    <Check size={14} strokeWidth={3} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                        {!checklists[currentDay] && (
                            <div className="text-center text-[#B0B8C1] py-10">체크리스트가 없습니다.</div>
                        )}
                    </div>
                </div>

                {/* Photo Grid Section */}
                <div>
                    <h2 className="text-[19px] font-bold text-brand-black mb-[16px]">사진 등록</h2>
                    <div className="grid grid-cols-3 gap-[10px]">
                        {photoSlots.map((slot, idx) => (
                            <div key={idx} className="flex flex-col gap-2">
                                <div
                                    onClick={() => handlePhotoUpload(slot)}
                                    className="aspect-square bg-white rounded-[16px] border border-[#E5E8EB] flex items-center justify-center cursor-pointer active:scale-[0.98] transition-all relative overflow-hidden shadow-sm"
                                >
                                    {photos[slot] ? (
                                        <img src={photos[slot]} alt={slot} className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera size={24} className="text-[#B0B8C1]" />
                                    )}
                                </div>
                                <span className="text-[13px] font-medium text-[#4E5968] text-center tracking-tight break-keep">
                                    {slot}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Bottom Action */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#F2F4F6] p-[20px] pb-[32px] z-10 flex justify-center">
                <Button
                    variant="primary"
                    size="large"
                    className="w-full max-w-[440px]"
                    onClick={handleSubmit}
                >
                    {currentDay}일차 업무 완료
                </Button>
            </div>

            <Toast message={`${currentDay}일차 보고가 완료되었습니다`} isVisible={showToast} onClose={() => setShowToast(false)} />
        </div>
    );
};

export default DailyReport;
