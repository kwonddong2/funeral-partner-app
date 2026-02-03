import React, { useState, useEffect } from 'react';
import { Search, Filter, PhoneCall, Star, MapPin, User, CheckCircle2, ChevronDown, MoreHorizontal, X, FileText } from 'lucide-react';
import Badge from '../../components/tds/Badge';

const AdminEventList = () => {
    // -------------------------------------------------------------------------
    // 1. Logic & State
    // -------------------------------------------------------------------------
    const [events, setEvents] = useState([]);
    const [filters, setFilters] = useState({
        partner_id: 'all',
        region: 'all',
        product: 'all',
        status: 'all',
        type: 'all', // 의전 구분 (직영/의전)
        happy_call: 'all' // 해피콜 상태/등급
    });
    const [selectedEvent, setSelectedEvent] = useState(null); // For Happy Call Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Partners
    const partners = [
        { id: 'p1', name: '김지훈', location: '서울 강남구', type: '직영' },
        { id: 'p2', name: '이민수', location: '경기 성남시', type: '의전' },
        { id: 'p3', name: '박철수', location: '인천 부평구', type: '의전' },
    ];

    // Load Data
    useEffect(() => {
        // Load from LocalStorage + Mock Data (to see populated list)
        const loadData = () => {
            const savedEventsStr = localStorage.getItem('partner_events');
            const savedEvents = savedEventsStr ? JSON.parse(savedEventsStr) : [];

            // Mock Data for Demo
            const mockEvents = [
                {
                    id: 901,
                    status: 'completed',
                    date: '2025.10.20',
                    customerName: '이영희',
                    phone: '010-1234-5678',
                    location: '서울 송파구',
                    funeralHome: '서울아산병원',
                    partnerName: '김지훈',
                    partnerType: '직영',
                    product: '고이 스탠다드 299',
                    dispatchSuccess: true,
                    review: { rating: 5, content: '경황이 없었는데 덕분에 잘 치렀습니다. 감사합니다.' },
                    happyCall: { status: 'done', grade: '긍정', content: '고객 만족도가 매우 높음.' }
                },
                {
                    id: 902,
                    status: 'ongoing',
                    date: '2025.10.22',
                    customerName: '박민수',
                    phone: '010-9876-5432',
                    location: '경기 성남시',
                    funeralHome: '분당서울대병원',
                    partnerName: '이민수',
                    partnerType: '의전',
                    product: '무빈소 159',
                    dispatchSuccess: true,
                    review: null,
                    happyCall: { status: 'pending', grade: '', content: '' }
                },
                {
                    id: 903,
                    status: 'cancelled',
                    date: '2025.10.23',
                    customerName: '최지원',
                    phone: '010-5555-5555',
                    location: '인천 부평구',
                    funeralHome: '인천성모병원',
                    partnerName: '박철수',
                    partnerType: '의전',
                    product: '상담 중 취소',
                    dispatchSuccess: false,
                    review: null,
                    happyCall: { status: 'done', grade: '부정', content: '가격 문제로 이탈.' }
                }
            ];

            // Normalize Saved Events to match structure
            const normalizedSaved = savedEvents.map(evt => ({
                id: evt.id,
                status: evt.status,
                date: evt.date || new Date().toLocaleDateString(), // Use event date or today
                customerName: evt.name.replace('님 (의뢰)', '').replace('님 빈소', ''),
                phone: evt.dispatchData?.phone || '-',
                location: evt.dispatchData?.location || '미정',
                funeralHome: evt.place,
                partnerName: '김지훈', // Assuming current user for demo
                partnerType: '직영', // Default
                product: evt.dispatchData?.sangjo || '미정',
                dispatchSuccess: true,
                review: null,
                happyCall: { status: 'pending', grade: '', content: '' }
            }));

            // Sort by Date (Descending: Newest First)
            const sortedEvents = [...normalizedSaved, ...mockEvents].sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });

            setEvents(sortedEvents);
        };
        loadData();
    }, []);

    // Filter Logic
    const filteredEvents = events.filter(evt => {
        if (filters.partner_id !== 'all' && evt.partnerName !== filters.partner_id) return false;
        if (filters.region !== 'all' && !evt.location.includes(filters.region)) return false;
        if (filters.status !== 'all' && evt.status !== filters.status) return false;
        if (filters.type !== 'all' && evt.partnerType !== filters.type) return false;
        if (filters.happy_call !== 'all') {
            if (filters.happy_call === 'pending') {
                if (evt.happyCall.status === 'done') return false;
            } else if (filters.happy_call === 'done') {
                if (evt.happyCall.status !== 'done') return false;
            } else {
                // Grade filters (긍정, 보통, 부정)
                if (evt.happyCall.grade !== filters.happy_call) return false;
            }
        }
        return true;
    });

    // Happy Call Handler
    const openHappyCall = (evt) => {
        setSelectedEvent({ ...evt }); // Clone to edit
        setIsModalOpen(true);
    };

    const saveHappyCall = () => {
        // Update local state (In real app, API call)
        setEvents(prev => prev.map(e => e.id === selectedEvent.id ? selectedEvent : e));
        setIsModalOpen(false);
        alert('해피콜 정보가 저장되었습니다.');
    };

    // Status Change Handler
    const handleStatusChange = (id, newStatus) => {
        // 1. Update State
        const updatedEvents = events.map(evt =>
            evt.id === id ? { ...evt, status: newStatus } : evt
        );
        setEvents(updatedEvents);

        // 2. Update LocalStorage (partner_events)
        // Note: In a real app, we'd update the DB. Here, we sync with partner_events.
        // We need to match the structure of partner_events.
        const savedEventsStr = localStorage.getItem('partner_events');
        if (savedEventsStr) {
            const savedEvents = JSON.parse(savedEventsStr);
            // We need to find the matching event in savedEvents. 
            // Our 'events' state is a mix of saved and mock. 
            // We only update if it exists in savedEvents.
            const updatedSaved = savedEvents.map(evt =>
                evt.id === id ? { ...evt, status: newStatus } : evt
            );
            localStorage.setItem('partner_events', JSON.stringify(updatedSaved));
        }
    };

    // -------------------------------------------------------------------------
    // 2. UI Components
    // -------------------------------------------------------------------------
    return (
        <div className="max-w-7xl mx-auto min-h-screen pb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="text-brand-black" /> 행사 관리 (출동 내역)
            </h2>

            {/* Filters */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-end">
                <div className="w-[140px]">
                    <label className="block text-xs font-bold text-gray-500 mb-1">진행 상태</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="all">전체 상태</option>
                        <option value="ongoing">행사중</option>
                        <option value="completed">종료</option>
                        <option value="cancelled">취소</option>
                    </select>
                </div>
                <div className="w-[140px]">
                    <label className="block text-xs font-bold text-gray-500 mb-1">의전 구분</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    >
                        <option value="all">전체</option>
                        <option value="직영">직영</option>
                        <option value="의전">의전</option>
                    </select>
                </div>
                <div className="w-[140px]">
                    <label className="block text-xs font-bold text-gray-500 mb-1">장례지도사</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                        value={filters.partner_id}
                        onChange={(e) => setFilters({ ...filters, partner_id: e.target.value })}
                    >
                        <option value="all">전체 보기</option>
                        {partners.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                </div>
                <div className="w-[140px]">
                    <label className="block text-xs font-bold text-gray-500 mb-1">지역</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                        value={filters.region}
                        onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                    >
                        <option value="all">전체 지역</option>
                        <option value="서울">서울</option>
                        <option value="경기">경기</option>
                        <option value="인천">인천</option>
                    </select>
                </div>
                <div className="w-[140px]">
                    <label className="block text-xs font-bold text-gray-500 mb-1">해피콜 상태</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                        value={filters.happy_call}
                        onChange={(e) => setFilters({ ...filters, happy_call: e.target.value })}
                    >
                        <option value="all">전체</option>
                        <option value="pending">미완료 (상담전)</option>
                        <option value="done">완료 (전체)</option>
                        <option value="긍정">완료 (긍정)</option>
                        <option value="보통">완료 (보통)</option>
                        <option value="부정">완료 (부정)</option>
                    </select>
                </div>
                <button className="bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-black transition-colors ml-auto">
                    <Search size={16} /> 조회
                </button>
            </div>

            {/* Event Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-200">
                            <th className="px-6 py-4 font-bold">상태/결과</th>
                            <th className="px-6 py-4 font-bold">출동일</th>
                            <th className="px-6 py-4 font-bold">고객 정보</th>
                            <th className="px-6 py-4 font-bold">출동 정보 (지역/장례식장)</th>
                            <th className="px-6 py-4 font-bold">담당 지도사</th>
                            <th className="px-6 py-4 font-bold">후기/별점</th>
                            <th className="px-6 py-4 font-bold text-center">해피콜 관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredEvents.map(evt => (
                            <tr key={evt.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1 items-start relative group">
                                        <div className="relative">
                                            <Badge variant={evt.status === 'ongoing' ? 'orange' : evt.status === 'completed' ? 'black' : 'red'}>
                                                {evt.status === 'ongoing' ? '행사중' : evt.status === 'completed' ? '종료' : '취소'}
                                                <ChevronDown size={10} className="ml-1 inline-block opacity-50" />
                                            </Badge>
                                            <select
                                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                                value={evt.status}
                                                onChange={(e) => handleStatusChange(evt.id, e.target.value)}
                                            >
                                                <option value="ongoing">행사중</option>
                                                <option value="completed">종료</option>
                                                <option value="cancelled">취소</option>
                                            </select>
                                        </div>
                                        <span className="text-[11px] text-gray-400 bg-gray-100 px-1 rounded">{evt.partnerType}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-medium">
                                    {evt.date || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{evt.customerName}</div>
                                    <div className="text-xs text-gray-500">{evt.phone}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-gray-800 font-medium">
                                        <MapPin size={12} className="text-gray-400" /> {evt.location}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">{evt.funeralHome}</div>
                                    <div className="text-[11px] text-blue-600 mt-1 bg-blue-50 inline-block px-1.5 py-0.5 rounded">
                                        {evt.product}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-medium text-gray-900">{evt.partnerName}</span>
                                </td>
                                <td className="px-6 py-4 w-48">
                                    {evt.review ? (
                                        <div>
                                            <div className="flex text-yellow-400 mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} fill={i < evt.review.rating ? "currentColor" : "none"} className={i < evt.review.rating ? "" : "text-gray-300"} />
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-600 line-clamp-2 leading-tight">
                                                "{evt.review.content}"
                                            </p>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => openHappyCall(evt)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${evt.happyCall.status === 'done'
                                            ? evt.happyCall.grade === '긍정'
                                                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                                                : evt.happyCall.grade === '부정'
                                                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {evt.happyCall.status === 'done' ? (
                                            <span className="flex items-center gap-1 justify-center">
                                                <CheckCircle2 size={12} /> 평가완료 ({evt.happyCall.grade})
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 justify-center">
                                                <PhoneCall size={12} /> 상담관리
                                            </span>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredEvents.length === 0 && (
                    <div className="p-12 text-center text-gray-400 text-sm">
                        조건에 맞는 행사 내역이 없습니다.
                    </div>
                )}
            </div>

            {/* Happy Call Modal */}
            {/* Happy Call Modal */}
            {isModalOpen && selectedEvent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                <PhoneCall size={20} className="text-brand-orange" /> 해피콜 관리 ({selectedEvent.customerName})
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Summary */}
                            <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 space-y-1">
                                <p><span className="font-bold">담당 지도사:</span> {selectedEvent.partnerName}</p>
                                <p><span className="font-bold">행사 상품:</span> {selectedEvent.product}</p>
                            </div>

                            {/* Evaluation Grade */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">종합 평가 등급</label>
                                <div className="flex gap-2">
                                    {['긍정', '보통', '부정'].map(grade => {
                                        let activeClass = '';
                                        let inactiveClass = 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50';

                                        if (grade === '긍정') activeClass = 'bg-blue-600 text-white border-blue-600 ring-2 ring-offset-1 ring-blue-600';
                                        if (grade === '보통') activeClass = 'bg-gray-600 text-white border-gray-600 ring-2 ring-offset-1 ring-gray-600';
                                        if (grade === '부정') activeClass = 'bg-red-600 text-white border-red-600 ring-2 ring-offset-1 ring-red-600';

                                        return (
                                            <button
                                                key={grade}
                                                onClick={() => setSelectedEvent({ ...selectedEvent, happyCall: { ...selectedEvent.happyCall, grade } })}
                                                className={`flex-1 py-3 rounded-lg font-bold border transition-all ${selectedEvent.happyCall.grade === grade ? activeClass : inactiveClass
                                                    } ${selectedEvent.happyCall.grade === grade ? '' :
                                                        grade === '긍정' ? 'hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50' :
                                                            grade === '부정' ? 'hover:text-red-600 hover:border-red-200 hover:bg-red-50' : ''
                                                    }`}
                                            >
                                                {grade}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">상담 내용 및 피드백</label>
                                <textarea
                                    className="w-full h-32 p-3 border border-gray-300 rounded-xl resize-none text-sm outline-none focus:border-brand-orange"
                                    placeholder="고객과의 통화 내용, 불편 사항, 칭찬 내용 등을 상세히 기록해주세요."
                                    value={selectedEvent.happyCall.content}
                                    onChange={(e) => setSelectedEvent({ ...selectedEvent, happyCall: { ...selectedEvent.happyCall, content: e.target.value } })}
                                />
                            </div>

                            {/* Toggle Completeness */}
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedEvent({ ...selectedEvent, happyCall: { ...selectedEvent.happyCall, status: selectedEvent.happyCall.status === 'done' ? 'pending' : 'done' } })}>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedEvent.happyCall.status === 'done' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 bg-white'
                                    }`}>
                                    {selectedEvent.happyCall.status === 'done' && <CheckCircle2 size={14} />}
                                </div>
                                <span className="text-sm font-medium text-gray-700">해피콜 상담 완료 처리</span>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100"
                            >
                                취소
                            </button>
                            <button
                                onClick={saveHappyCall}
                                className="px-6 py-2 bg-brand-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 shadow-lg"
                            >
                                저장하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEventList;
