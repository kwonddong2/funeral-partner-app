import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Top from '../components/tds/Top';
import { ChevronRight, ChevronDown, CheckCircle2, AlertCircle, Calendar, DollarSign, FileText, AlertTriangle, MapPin } from 'lucide-react';

const SettlementDetail = () => {
    const navigate = useNavigate();
    const [openPolicy, setOpenPolicy] = useState(null);

    const togglePolicy = (index) => {
        setOpenPolicy(openPolicy === index ? null : index);
    };

    // Mock Data - Weekly Events
    const weeklyEvents = [
        {
            id: 1,
            deceased: '박*수',
            location: '서울아산병원',
            date: '10.30',
            amount: 2500000,
            status: 'normal', // payment confirmed
            statusLabel: '정산 확정'
        },
        {
            id: 2,
            deceased: '최*민',
            location: '신촌세브란스',
            date: '11.01',
            amount: 950000,
            status: 'normal',
            statusLabel: '정산 확정'
        },
        {
            id: 3,
            deceased: '김*호',
            location: '삼성서울병원',
            date: '11.03',
            amount: 1200000,
            status: 'issue',
            statusLabel: '정산 보류 (이슈)',
            issueReason: '고객 불만족 접수'
        }
    ];

    // Calculations
    const currentWeek = "11월 1주차";
    const payoutDate = "11월 10일"; // For normal items
    const bankInfo = "카카오뱅크 3333-01-2345678 (김지훈)";

    const payoutAmount = weeklyEvents
        .filter(e => e.status === 'normal')
        .reduce((sum, e) => sum + e.amount, 0);

    const delayedAmount = weeklyEvents
        .filter(e => e.status === 'issue')
        .reduce((sum, e) => sum + e.amount, 0);

    const totalExpected = payoutAmount + delayedAmount;
    const hasIssue = delayedAmount > 0;

    const formatMoney = (amount) => amount.toLocaleString();

    const policies = [
        {
            title: "부분 정산 정책 안내",
            content: "이슈가 발생한 행사 건만 정산이 보류되며, 나머지 정상적인 행사 건은 예정된 날짜에 정상 지급됩니다.\n\n* 보류된 금액은 이슈 해결(환불 여부 결정) 후 다음 정산 주기에 소급 적용될 수 있습니다."
        },
        {
            title: "정산 계산식 (수익 정산 기준)",
            content: "순수익 = 매출 - 지출(실비)\n\n매출: 상조매출 + 각종 수수료(장지, 제단RT 등)\n지출: 인건비, 물품비 등 실제 발생 비용\n\n* 순수익을 계약된 배분율에 따라 나눕니다."
        },
        {
            title: "환불 발생 시 정산 (정산 지연)",
            content: "이슈(고객 불만족 등)가 식별되면 해당 건의 정산 절차가 일시 정지됩니다.\n\n[처리 절차]\n1. 문제 식별 및 정산 보류\n2. 고객/팀장님 소통 및 사실 확인\n3. 환불 여부/금액 결정 및 입금\n4. 매출액 재조정 후 정산 재개"
        }
    ];

    return (
        <div className="pb-12 bg-gray-50 min-h-screen">
            <Top
                title="내 정산금 (주간)"
                showBack={true}
                onBack={() => navigate(-1)}
            />

            <div className="px-5 pt-6">
                {/* Partial Delay Alert */}
                {hasIssue && (
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
                        <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={20} />
                        <div>
                            <h3 className="font-bold text-orange-700 text-sm mb-1">부분 정산이 진행됩니다.</h3>
                            <p className="text-xs text-orange-600 leading-snug">
                                총 {weeklyEvents.length}건 중 <span className="font-bold">{weeklyEvents.filter(e => e.status === 'issue').length}건</span>에 대해 이슈가 확인되어, 해당 금액을 제외하고 정산됩니다.
                            </p>
                        </div>
                    </div>
                )}

                {/* Summary Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
                    <div className="relative z-10 text-center">
                        <div className="text-gray-500 text-sm font-medium mb-1">{currentWeek} 지급 예정 금액</div>
                        <div className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                            {formatMoney(payoutAmount)}<span className="text-2xl font-semibold ml-1">원</span>
                        </div>
                        {hasIssue && (
                            <div className="text-sm text-red-500 font-medium mb-4 bg-red-50 inline-block px-3 py-1 rounded-full">
                                (보류 금액: {formatMoney(delayedAmount)}원)
                            </div>
                        )}

                        <div className="flex flex-col gap-2 mt-2">
                            <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                                <span className="flex items-center gap-2"><Calendar size={16} className="text-gray-400" /> 지급 예정일</span>
                                <span className="font-bold text-brand-black">{payoutDate}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                                <span className="flex items-center gap-2"><DollarSign size={16} className="text-gray-400" /> 입금 계좌</span>
                                <span className="font-bold text-gray-800">카카오 3333-01...</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly Event List Breakdown */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex justify-between items-end">
                        이번 주 행사 내역
                        <span className="text-xs font-normal text-gray-400">총 {weeklyEvents.length}건</span>
                    </h3>
                    <div className="space-y-3">
                        {weeklyEvents.map((event) => (
                            <div key={event.id} className={`bg-white rounded-2xl p-5 border shadow-sm flex justify-between items-center relative overflow-hidden ${event.status === 'issue' ? 'border-red-100' : 'border-gray-100'
                                }`}>
                                {event.status === 'issue' && (
                                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-red-500"></div>
                                )}
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">{event.deceased} 님 빈소</h4>
                                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                                        <MapPin size={12} /> {event.location} <span className="w-[1px] h-[10px] bg-gray-200 inline-block mx-1"></span> {event.date}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {event.status === 'issue' ? (
                                            <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[11px] font-bold border border-red-100">
                                                {event.statusLabel}
                                            </span>
                                        ) : (
                                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[11px] font-bold border border-blue-100">
                                                {event.statusLabel}
                                            </span>
                                        )}
                                        {event.issueReason && (
                                            <span className="text-xs text-red-400">({event.issueReason})</span>
                                        )}
                                    </div>
                                </div>
                                <div className={`text-right font-bold text-lg ${event.status === 'issue' ? 'text-gray-300 line-through' : 'text-gray-900'
                                    }`}>
                                    {formatMoney(event.amount)}원
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Policy Accordion */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText size={20} /> 정산 기준 안내
                    </h3>
                    <div className="space-y-3">
                        {policies.map((policy, index) => (
                            <div key={index} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                <button
                                    onClick={() => togglePolicy(index)}
                                    className="w-full flex justify-between items-center p-4 text-left active:bg-gray-50 transition-colors"
                                >
                                    <span className="text-[15px] font-bold text-gray-800">{policy.title}</span>
                                    <ChevronDown size={20} className={`text-gray-400 transition-transform ${openPolicy === index ? 'rotate-180' : ''}`} />
                                </button>
                                {openPolicy === index && (
                                    <div className="px-4 pb-5 pt-0">
                                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                            {policy.content}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettlementDetail;
