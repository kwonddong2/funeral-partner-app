import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Search, Filter } from 'lucide-react';

const AdminSettlement = () => {
    // Mock Data (In real app, this would come from DB)
    const [events, setEvents] = useState([
        { id: 1, partner: '김지훈', customer: '박*수', date: '2024.10.30', amount: 2500000, status: 'normal' },
        { id: 2, partner: '김지훈', customer: '최*민', date: '2024.11.01', amount: 950000, status: 'normal' },
        { id: 3, partner: '김지훈', customer: '김*호', date: '2024.11.03', amount: 1200000, status: 'issue', issueReason: '고객 불만족' },
        { id: 4, partner: '이영희', customer: '정*석', date: '2024.11.02', amount: 1800000, status: 'normal' },
    ]);

    const toggleIssue = (id) => {
        setEvents(events.map(e => {
            if (e.id === id) {
                const newStatus = e.status === 'normal' ? 'issue' : 'normal';
                return { ...e, status: newStatus, issueReason: newStatus === 'issue' ? '관리자 수동 지정' : null };
            }
            return e;
        }));
    };

    const totalAmount = events.filter(e => e.status === 'normal').reduce((sum, e) => sum + e.amount, 0);
    const holdAmount = events.filter(e => e.status === 'issue').reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">정산 관리 (11월 1주차)</h2>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                        엑셀 다운로드
                    </button>
                    <button className="bg-brand-orange text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-600">
                        정산 확정 및 송금
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">총 지급 예정 금액</div>
                    <div className="text-2xl font-bold text-blue-600">{totalAmount.toLocaleString()}원</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">지급 보류 금액 (이슈)</div>
                    <div className="text-2xl font-bold text-red-500">{holdAmount.toLocaleString()}원</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-sm text-gray-500 mb-1">총 정산 대상</div>
                    <div className="text-2xl font-bold text-gray-800">{events.length}건</div>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex gap-4">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="파트너명, 고객명 검색"
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-orange"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                    <Filter size={16} /> 필터
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3">파트너</th>
                            <th className="px-6 py-3">행사 정보 (고객/일자)</th>
                            <th className="px-6 py-3 text-right">정산 금액</th>
                            <th className="px-6 py-3 text-center">상태</th>
                            <th className="px-6 py-3 text-center">이슈 관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {events.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{event.partner}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium">{event.customer} 님</div>
                                    <div className="text-xs text-gray-400">{event.date}</div>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900">
                                    {event.amount.toLocaleString()}원
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {event.status === 'normal' ? (
                                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs font-bold">정산 예정</span>
                                    ) : (
                                        <span className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-bold">보류 중</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => toggleIssue(event.id)}
                                        className={`px-3 py-1.5 rounded border text-xs font-bold transition-colors ${event.status === 'normal'
                                                ? 'border-gray-300 text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                                                : 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                                            }`}
                                    >
                                        {event.status === 'normal' ? '이슈 등록' : '이슈 해제'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSettlement;
