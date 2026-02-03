import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Top from '../components/tds/Top';
import { ChevronRight, Calendar, MapPin, Star, MessageSquare, ClipboardList, Info, FileText } from 'lucide-react';

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="text-gray-900 font-bold text-right">{value}</span>
    </div>
);

const EventHistory = () => {
    const navigate = useNavigate();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('info'); // 'info' | 'review' | 'report'

    // Mock Data
    const events = [
        {
            id: 1,
            date: '2024.01.28',
            deceased: '박*수',
            location: '서울아산병원 장례식장',
            status: '완료',
            hasIssue: false,
            info: {
                place: '서울아산병원 장례식장 3호실',
                jangji: '서울추모공원 - 분당 메모리얼파크',
                product: '일반장',
                settlementAmount: '2,800,000원',
                dispatchTime: '2024.01.26 14:30',
                endTime: '2024.01.28 11:00'
            },
            review: {
                score: 5,
                content: '팀장님이 너무 친절하셔서 믿고 맡길 수 있었습니다. 감사합니다.',
                date: '2024.01.30'
            },
            report: {
                content: '상주님께서 경황이 없으셔서 발인 절차를 꼼꼼히 챙겨드렸습니다. 특별한 컴플레인 없이 잘 마무리되었습니다.',
                date: '2024.01.28 13:00'
            }
        },
        {
            id: 2,
            date: '2024.01.20',
            deceased: '최*민',
            location: '신촌세브란스병원 장례식장',
            status: '완료',
            hasIssue: false,
            info: {
                place: '신촌세브란스병원 장례식장 특1호실',
                jangji: '벽제승화원 - 일산 청아공원',
                product: '가족장',
                settlementAmount: '1,500,000원',
                dispatchTime: '2024.01.18 09:00',
                endTime: '2024.01.20 10:30'
            },
            review: {
                score: 5,
                content: '정신없었는데 하나하나 챙겨주셔서 감사했습니다.',
                date: '2024.01.22'
            },
            report: {
                content: '조문객이 예상보다 많아 도우미 추가 배치를 신속하게 진행했습니다. 입관 시 유족분들이 많이 우셔서 위로해 드리는 데 집중했습니다.',
                date: '2024.01.20 12:00'
            }
        },
        {
            id: 3,
            date: '2024.01.05',
            deceased: '김*호',
            location: '삼성서울병원 장례식장',
            status: '완료',
            hasIssue: true,
            info: {
                place: '삼성서울병원 장례식장 5호실',
                jangji: '용인 평온의 숲',
                product: '무빈소장',
                settlementAmount: '900,000원',
                dispatchTime: '2024.01.03 21:00',
                endTime: '2024.01.05 09:00'
            },
            review: {
                score: 2,
                content: '서비스는 좋았지만 시간이 좀 지체되었네요.',
                date: '2024.01.06'
            },
            report: {
                content: '발인 시간이 지연되어 고객 불만이 있었습니다.',
                date: '2024.01.05 10:00'
            }
        }
    ];

    // Stats Calculation
    const totalEvents = events.length;
    const totalReviews = events.filter(e => e.review).length;
    const totalReports = events.filter(e => e.report).length;

    const renderDetailContent = () => {
        if (!selectedEvent) return null;

        switch (activeTab) {
            case 'info':
                return (
                    <div className="space-y-4 animate-fade-in">
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-lg mb-4 text-brand-black flex items-center gap-2">
                                <Info size={18} /> 기본 정보
                            </h3>
                            <div className="space-y-3 text-sm">
                                <InfoRow label="고인명" value={`${selectedEvent.deceased} 님`} />
                                <InfoRow label="장례식장" value={selectedEvent.info.place} />
                                <InfoRow label="장지" value={selectedEvent.info.jangji} />
                                <InfoRow label="이용 상품" value={selectedEvent.info.product} />
                                <InfoRow label="정산 금액" value={<span className="text-brand-orange">{selectedEvent.info.settlementAmount}</span>} />
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-lg mb-4 text-brand-black flex items-center gap-2">
                                <Calendar size={18} /> 일정 정보
                            </h3>
                            <div className="space-y-3 text-sm">
                                <InfoRow label="출동 일시" value={selectedEvent.info.dispatchTime} />
                                <InfoRow label="종료 일시" value={selectedEvent.info.endTime} />
                            </div>
                        </div>
                    </div>
                );
            case 'review': // Customer Review
                return (
                    <div className="scale-100 transition-all animate-fade-in">
                        {selectedEvent.review ? (
                            <div className="bg-white p-6 rounded-2xl border border-brand-orange/20 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[6px] bg-brand-orange"></div>
                                <div className="flex flex-col items-center mb-6">
                                    <span className="text-gray-500 text-sm mb-2 font-medium">고객 만족도 점수</span>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={32}
                                                className={i < selectedEvent.review.score ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-2xl font-bold text-brand-black mt-2">
                                        {selectedEvent.review.score} / 5
                                    </span>
                                </div>
                                <div className="bg-[#FFF5F1] p-5 rounded-xl text-gray-700 italic border border-orange-100 relative">
                                    <MessageSquare size={20} className="text-brand-orange absolute top-4 left-4 opacity-50" />
                                    <p className="pl-6 text-[15px] font-medium">"{selectedEvent.review.content}"</p>
                                </div>
                                <div className="text-right mt-3 text-xs text-gray-400">
                                    등록일: {selectedEvent.review.date}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                                <MessageSquare size={48} className="text-gray-200 mb-4" />
                                <p className="text-gray-500 font-medium">아직 등록된 후기가 없습니다.</p>
                            </div>
                        )}
                    </div>
                );
            case 'report': // Happy Call Contents
                return (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-fade-in">
                        <div className="flex items-center gap-2 mb-4 text-brand-black font-bold text-lg">
                            <FileText size={20} /> 해피콜 내용
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                            {selectedEvent.report?.content || "작성된 내용은 없습니다."}
                        </div>
                        <div className="text-right mt-3 text-xs text-gray-400">
                            작성일: {selectedEvent.report?.date || "-"}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="pb-12 bg-gray-50 min-h-screen">
            <Top
                title={selectedEvent ? "행사 상세 정보" : "내 행사"}
                showBack={true}
                onBack={() => {
                    if (selectedEvent) setSelectedEvent(null);
                    else navigate(-1);
                }}
            />

            <div className="px-5 pt-4">
                {!selectedEvent ? (
                    /* Event List View */
                    <div className="space-y-4">
                        {/* Stats Summary */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-2 flex justify-between items-center text-center">
                            <div className="flex-1 border-r border-gray-100 last:border-0 hover:bg-gray-50 transition-colors p-2 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1">총 행사</div>
                                <div className="text-xl font-bold text-brand-black">{totalEvents}건</div>
                            </div>
                            <div className="flex-1 border-r border-gray-100 last:border-0 hover:bg-gray-50 transition-colors p-2 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1">고객 후기</div>
                                <div className="text-xl font-bold text-brand-orange">{totalReviews}건</div>
                            </div>
                            <div className="flex-1 hover:bg-gray-50 transition-colors p-2 rounded-lg">
                                <div className="text-xs text-gray-500 mb-1">해피콜</div>
                                <div className="text-xl font-bold text-gray-700">{totalReports}건</div>
                            </div>
                        </div>

                        {events.map((event) => (
                            <div
                                key={event.id}
                                onClick={() => setSelectedEvent(event)}
                                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer relative"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-bold text-[12px]">
                                            {event.status}
                                        </span>
                                        {event.hasIssue && (
                                            <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded text-xs font-bold text-[12px] animate-pulse">
                                                이슈 건
                                            </span>
                                        )}
                                        <span className="text-gray-400 text-[13px] ml-1">{event.date}</span>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {event.deceased} 님 빈소
                                </h3>
                                <p className="text-gray-500 text-[14px] flex items-center gap-1">
                                    <MapPin size={14} /> {event.location}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Event Detail View */
                    <div>
                        {/* Header Summary */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1 leading-snug">
                                {selectedEvent.deceased} 님<br />장례 행사
                            </h2>
                            <p className="text-gray-500 text-sm">{selectedEvent.location}</p>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-white p-1 rounded-xl shadow-sm mb-6 border border-gray-100">
                            {['info', 'review', 'report'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === tab
                                        ? 'bg-brand-black text-white shadow-md'
                                        : 'text-gray-400 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab === 'info' && '정보'}
                                    {tab === 'review' && '고객 후기'}
                                    {tab === 'report' && '해피콜'}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        {renderDetailContent()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventHistory;
