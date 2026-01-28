import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Camera, Plus, Minus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import Top from '../components/tds/Top';
import Button from '../components/tds/Button';
import Toast from '../components/tds/Toast';

const Settlement = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

    // UI State
    const [activeTab, setActiveTab] = useState('revenue'); // 'revenue' | 'cost'

    // --- 1. Revenue State ---
    const [revenueData, setRevenueData] = useState({
        serviceName: '2026 고이 가족장 289', // Default or loaded
        basicPrice: 2890000,
        advancePayment: 0,
        discount: 0,
        merchantUid: 'merchant_1234' // Mock UID
    });

    // --- 2. Cost State ---
    // Cost Toggles (The "Item Addition" logic)
    const [costToggles, setCostToggles] = useState({
        vehicle: true,
        manpower: true,
        supplies: true,
        flowers: true,
        consumables: false,
        etc: false
    });

    // Detailed Cost Data
    const [costData, setCostData] = useState({
        manpower: {
            helpers: { count: 6, price: 620000, note: '1일차(2명), 2일차(4명)' },
            director: { count: 1, price: 100000, note: '' },
            assistant: { count: 1, price: 100000, note: '' }
        },
        vehicle: {
            ambulance: { company: '식장-무료', price: 0, note: '' },
            bus: { company: '대산/관내', price: 330000, note: '' },
            limo: { company: '대산/관내', price: 250000, note: '좁은골목 운행' }
        },
        supplies: {
            coffin: { name: '오동나무 0.6', price: 0, note: '' },
            shroud: { name: '자가수의', price: 0, note: '' },
            urn: { name: '상품 상세', price: 0, note: '' },
            male_sangbok: { count: 10, price: 175000, note: '' },
            female_sangbok: { count: 11, price: 176000, note: '3벌 서비스 제공' }
        },
        flowers: {
            altar: { name: '식장제단(200만원)', price: 1200000, note: '60% 적용' },
            tribute: { name: '헌화용 국화', price: 60000, note: '' }
        },
        consumables: {
            list: [
                { name: '양초', detail: '', price: 0 },
                { name: '향', detail: '', price: 0 },
                { name: '알코올', detail: '', price: 0 }
            ]
        },
        etc: {
            description: '',
            price: 0
        }
    });

    const [profitRatio, setProfitRatio] = useState(0.5);

    // --- Initialization ---
    useEffect(() => {
        const saved = localStorage.getItem(`event_${id}_settlement_v6`);
        if (saved) {
            const parsed = JSON.parse(saved);
            setRevenueData(parsed.revenueData);
            setCostData(parsed.costData);
            setCostToggles(parsed.costToggles);
            setProfitRatio(parsed.profitRatio);
        }
    }, [id]);

    // --- Helpers ---
    const handleRevenueChange = (field, val) => {
        const num = parseInt(val.replace(/,/g, ''), 10) || 0;
        setRevenueData(prev => ({ ...prev, [field]: num }));
    };

    const handleCostChange = (cat, item, field, val) => {
        setCostData(prev => ({
            ...prev,
            [cat]: {
                ...prev[cat],
                [item]: { ...prev[cat][item], [field]: val }
            }
        }));
    };

    const handleConsumableChange = (idx, field, val) => {
        const newList = [...costData.consumables.list];
        newList[idx][field] = field === 'price' ? (parseInt(val.replace(/,/g, ''), 10) || 0) : val;
        setCostData(prev => ({
            ...prev,
            consumables: { ...prev.consumables, list: newList }
        }));
    };

    // Calculations
    const totalRevenue = revenueData.basicPrice - revenueData.discount; // Revenue = Basic - Discount (Advance is just a payment record usually, but adhering to screenshot logic: Revenue includes Advance?)
    // Screenshot: "Revenue (Include Advance)" -> Usually Advance is PART of the Basic Price paid early. 
    // Let's assume Revenue = Basic Price. Discount reduces the Receivable amount but maybe not the Sales Revenue? 
    // Usually Net Revenue = Basic - Discount.
    // Let's stick to Net Revenue = Basic - Discount.

    const calcCategoryTotal = (catData) => {
        if (!catData) return 0;
        return Object.values(catData).reduce((sum, item) => {
            // Handle 'list' for consumables
            if (Array.isArray(item)) return sum + item.reduce((s, i) => s + (i.price || 0), 0);
            return sum + (parseInt(item.price) || 0);
        }, 0);
    };

    const totalCost =
        (costToggles.manpower ? calcCategoryTotal(costData.manpower) : 0) +
        (costToggles.vehicle ? calcCategoryTotal(costData.vehicle) : 0) +
        (costToggles.supplies ? calcCategoryTotal(costData.supplies) : 0) +
        (costToggles.flowers ? calcCategoryTotal(costData.flowers) : 0) +
        (costToggles.consumables ? calcCategoryTotal(costData.consumables) : 0) +
        (costToggles.etc ? (costData.etc.price || 0) : 0);

    const netProfit = (totalRevenue - totalCost) * profitRatio;

    const handleSave = () => {
        const data = { revenueData, costData, costToggles, profitRatio, totalRevenue, totalCost, netProfit };
        localStorage.setItem(`event_${id}_settlement_v6`, JSON.stringify(data));
        // Back-compat
        localStorage.setItem(`event_${id}_settlement_v3`, JSON.stringify(data));
        setShowToast(true);
        setTimeout(() => navigate(`/events/${id}`), 1000);
    };

    return (
        <div className="pb-32 bg-[#F2F4F6] min-h-screen font-sans">
            <Top title="정산 상세 관리" showBack={true} onBack={() => navigate(`/events/${id}`)} />

            {/* 1. Header: Profit Summary (Always Visible) */}
            <div className="bg-white p-6 pb-2 sticky top-[50px] z-20 shadow-sm">
                <div className="text-center mb-6">
                    <span className="text-gray-500 text-xs font-medium bg-gray-100 px-2 py-1 rounded mb-2 inline-block">
                        공식: (매출 - 비용) × 수익배분율 {profitRatio * 100}%
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 leading-none">
                        {Math.floor(netProfit).toLocaleString()}원
                    </h1>
                    <span className="text-xs text-gray-400 mt-1 block">예상 수익 (정산 전)</span>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-[#F2F4F6] p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('revenue')}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'revenue'
                            ? 'bg-white text-brand-black shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        매출 내역 ({totalRevenue.toLocaleString()})
                    </button>
                    <button
                        onClick={() => setActiveTab('cost')}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'cost'
                            ? 'bg-white text-brand-black shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        비용 내역 ({totalCost.toLocaleString()})
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-6">

                {/* --- REVENUE TAB --- */}
                {activeTab === 'revenue' && (
                    <div className="bg-white rounded-xl p-5 shadow-sm space-y-6 animate-fade-in">
                        <div className="border-b pb-3 mb-3">
                            <h3 className="text-lg font-bold text-gray-800">상조 서비스 매출</h3>
                            <p className="text-xs text-gray-400 mt-1">기본 가격과 할인 금액을 입력하세요.</p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-brand-orange mb-1">서비스 선택</label>
                                <div className="h-12 bg-gray-50 rounded-lg flex items-center px-4 font-bold text-gray-700 border border-gray-100">
                                    {revenueData.serviceName}
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-gray-700">상조 기본 가격</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={revenueData.basicPrice.toLocaleString()}
                                        onChange={(e) => handleRevenueChange('basicPrice', e.target.value)}
                                        className="w-[140px] text-right text-lg font-bold text-gray-900 border-b-2 border-gray-100 focus:border-brand-orange focus:outline-none py-1"
                                    />
                                    <span className="text-sm text-gray-400">원</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center opacity-75">
                                <label className="text-sm font-medium text-gray-500">선수금 (참고용)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={revenueData.advancePayment.toLocaleString()}
                                        onChange={(e) => handleRevenueChange('advancePayment', e.target.value)}
                                        className="w-[140px] text-right text-base font-medium text-gray-600 border-b border-gray-100 focus:border-gray-300 focus:outline-none py-1"
                                    />
                                    <span className="text-sm text-gray-400">원</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-100">
                                <label className="text-sm font-bold text-red-500">계약 할인 금액 (-)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={revenueData.discount.toLocaleString()}
                                        onChange={(e) => handleRevenueChange('discount', e.target.value)}
                                        className="w-[140px] text-right text-lg font-bold text-red-500 bg-transparent border-b border-red-200 focus:border-red-400 focus:outline-none py-1"
                                    />
                                    <span className="text-sm text-red-300">원</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- COST TAB --- */}
                {activeTab === 'cost' && (
                    <div className="space-y-4 animate-fade-in">

                        {/* 2-1. Cost Toggles (Add Items) */}
                        <div className="bg-white rounded-xl p-5 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">공제 항목 추가 (+)</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.keys(costToggles).map(key => (
                                    <label key={key} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${costToggles[key] ? 'border-brand-orange bg-orange-50' : 'border-gray-100 bg-white hover:bg-gray-50'}`}>
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${costToggles[key] ? 'bg-brand-orange border-brand-orange' : 'bg-white border-gray-300'}`}>
                                            {costToggles[key] && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <span className={`text-sm font-bold ${costToggles[key] ? 'text-brand-orange' : 'text-gray-500'}`}>
                                            {key === 'manpower' && '인력'}
                                            {key === 'vehicle' && '차량'}
                                            {key === 'supplies' && '용품'}
                                            {key === 'flowers' && '꽃/제단'}
                                            {key === 'consumables' && '소모품'}
                                            {key === 'etc' && '기타'}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 2-2. Detailed Sections */}

                        {/* Manpower */}
                        {costToggles.manpower && (
                            <CostSection title="인력" total={calcCategoryTotal(costData.manpower)}>
                                <CostItem
                                    label="접객도우미"
                                    meta="6명"
                                    price={costData.manpower.helpers.price}
                                    note={costData.manpower.helpers.note}
                                    onPrice={(v) => handleCostChange('manpower', 'helpers', 'price', v)}
                                    onNote={(v) => handleCostChange('manpower', 'helpers', 'note', v)}
                                />
                                <CostItem
                                    label="장례지도사"
                                    meta="1명"
                                    price={costData.manpower.director.price}
                                    onPrice={(v) => handleCostChange('manpower', 'director', 'price', v)}
                                />
                                <CostItem
                                    label="입관보조"
                                    meta="1명"
                                    price={costData.manpower.assistant.price}
                                    onPrice={(v) => handleCostChange('manpower', 'assistant', 'price', v)}
                                />
                            </CostSection>
                        )}

                        {/* Vehicle */}
                        {costToggles.vehicle && (
                            <CostSection title="차량" total={calcCategoryTotal(costData.vehicle)}>
                                <CostItem
                                    label="앰뷸런스"
                                    meta={costData.vehicle.ambulance.company}
                                    price={costData.vehicle.ambulance.price}
                                    onPrice={(v) => handleCostChange('vehicle', 'ambulance', 'price', v)}
                                />
                                <CostItem
                                    label="장의버스"
                                    meta={costData.vehicle.bus.company}
                                    price={costData.vehicle.bus.price}
                                    onPrice={(v) => handleCostChange('vehicle', 'bus', 'price', v)}
                                />
                                <CostItem
                                    label="리무진"
                                    meta={costData.vehicle.limo.company}
                                    price={costData.vehicle.limo.price}
                                    note={costData.vehicle.limo.note}
                                    onPrice={(v) => handleCostChange('vehicle', 'limo', 'price', v)}
                                    onNote={(v) => handleCostChange('vehicle', 'limo', 'note', v)}
                                />
                            </CostSection>
                        )}

                        {/* Supplies */}
                        {costToggles.supplies && (
                            <CostSection title="용품" total={calcCategoryTotal(costData.supplies)}>
                                <CostItem
                                    label="관"
                                    meta={costData.supplies.coffin.name}
                                    price={costData.supplies.coffin.price}
                                    onPrice={(v) => handleCostChange('supplies', 'coffin', 'price', v)}
                                />
                                <CostItem
                                    label="수의"
                                    meta={costData.supplies.shroud.name}
                                    price={costData.supplies.shroud.price}
                                    onPrice={(v) => handleCostChange('supplies', 'shroud', 'price', v)}
                                />
                                <div className="bg-gray-50 h-px my-2" />
                                <CostItem
                                    label="남자 상복"
                                    meta="10벌 (17,500원)"
                                    price={costData.supplies.male_sangbok.price}
                                    onPrice={(v) => handleCostChange('supplies', 'male_sangbok', 'price', v)}
                                />
                                <CostItem
                                    label="여자 상복"
                                    meta="11벌 (16,000원)"
                                    price={costData.supplies.female_sangbok.price}
                                    note={costData.supplies.female_sangbok.note}
                                    onPrice={(v) => handleCostChange('supplies', 'female_sangbok', 'price', v)}
                                    onNote={(v) => handleCostChange('supplies', 'female_sangbok', 'note', v)}
                                />
                            </CostSection>
                        )}

                        {/* Flowers */}
                        {costToggles.flowers && (
                            <CostSection title="꽃 / 제단" total={calcCategoryTotal(costData.flowers)}>
                                <CostItem
                                    label="화원 원판"
                                    meta={costData.flowers.altar.name}
                                    price={costData.flowers.altar.price}
                                    note={costData.flowers.altar.note}
                                    onPrice={(v) => handleCostChange('flowers', 'altar', 'price', v)}
                                />
                                <CostItem
                                    label="헌화용 국화"
                                    meta="식장헌화 포함"
                                    price={costData.flowers.tribute.price}
                                    onPrice={(v) => handleCostChange('flowers', 'tribute', 'price', v)}
                                />
                            </CostSection>
                        )}

                        {/* Consumables */}
                        {costToggles.consumables && (
                            <CostSection title="소모품" total={calcCategoryTotal(costData.consumables)}>
                                <div className="space-y-4 pt-2">
                                    {costData.consumables.list.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-600">{item.name}</span>
                                            <div className="flex gap-2 w-[55%]">
                                                <input
                                                    type="text"
                                                    placeholder="상세"
                                                    className="w-[50%] bg-gray-50 text-xs px-2 rounded border border-gray-100"
                                                    value={item.detail}
                                                    onChange={(e) => handleConsumableChange(idx, 'detail', e.target.value)}
                                                />
                                                <div className="flex-1 relative">
                                                    <input
                                                        type="text"
                                                        value={item.price.toLocaleString()}
                                                        onChange={(e) => handleConsumableChange(idx, 'price', e.target.value)}
                                                        className="w-full text-right text-sm font-bold border-b border-gray-200 focus:border-brand-orange focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CostSection>
                        )}

                    </div>
                )}
            </div>

            {/* Bottom Action */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#F2F4F6] p-[20px] pb-[32px] z-20 flex justify-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <Button variant="primary" size="large" className="w-full max-w-[440px] flex justify-between px-6" onClick={handleSave}>
                    <span>저장하기</span>
                    <span className="font-bold opacity-80">수익 {Math.floor(netProfit).toLocaleString()}원</span>
                </Button>
            </div>

            <Toast message="저장되었습니다" isVisible={showToast} onClose={() => setShowToast(false)} />
        </div>
    );
};

// --- Sub Components ---

const CostSection = ({ title, total, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
            <h4 className="font-bold text-gray-800">- {title} -</h4>
            <span className="text-sm font-bold text-brand-black">{total.toLocaleString()} 원</span>
        </div>
        <div className="p-5 space-y-6">
            {children}
        </div>
    </div>
);

const CostItem = ({ label, meta, price, note, onPrice, onNote }) => (
    <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
            <div>
                <span className="block text-sm font-bold text-gray-800">{label}</span>
                {meta && <span className="block text-xs text-brand-orange mt-0.5">{meta}</span>}
            </div>
            <div className="flex items-center gap-1">
                <input
                    type="text"
                    value={price.toLocaleString()}
                    onChange={(e) => onPrice(parseInt(e.target.value.replace(/,/g, '')) || 0)}
                    className="w-[100px] text-right font-bold text-gray-900 border-b border-gray-200 focus:border-brand-orange focus:outline-none py-1 bg-transparent"
                />
                <span className="text-xs text-gray-400">원</span>
            </div>
        </div>
        {onNote && (
            <div className="mt-1 flex items-start gap-2">
                <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap">특이사항</span>
                <input
                    type="text"
                    value={note || ''}
                    onChange={(e) => onNote(e.target.value)}
                    className="w-full text-xs text-gray-600 bg-transparent focus:outline-none border-b border-dashed border-gray-200 focus:border-gray-400 hover:border-gray-300 transition-colors"
                />
            </div>
        )}
    </div>
);

export default Settlement;
