import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Top from '../components/tds/Top';
import Button from '../components/tds/Button';
import Toast from '../components/tds/Toast';
import { Minus, Plus, ShoppingBag, Shirt, Flag, Package, Check } from 'lucide-react';

const ItemOrder = () => {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [activeTab, setActiveTab] = useState('전체');

    const [customRequest, setCustomRequest] = useState('');

    // Categorized Data
    const itemData = [
        {
            category: '의류/복장',
            items: [
                { id: 4, name: '손수건', option: '고급 면 100%', icon: <Shirt size={24} className="text-[#333D4B]" /> },
                { id: 5, name: '앞치마', option: '다크 그레이', icon: <Shirt size={24} className="text-[#333D4B]" /> },
                { id: 14, name: '머리스카프', option: '여성용', icon: <Shirt size={24} className="text-[#333D4B]" /> },
            ]
        },
        {
            category: '홍보물',
            items: [
                { id: 8, name: '명함', option: '200매', icon: <Flag size={24} className="text-brand-orange" /> },
                { id: 9, name: '개인 명찰', option: '마그네틱 타입', icon: <Flag size={24} className="text-[#333D4B]" /> },
                { id: 15, name: '도우미 명찰', option: '집게/옷핀 겸용', icon: <Flag size={24} className="text-[#333D4B]" /> },
                { id: 6, name: '배너', option: 'X배너 거치대 포함', icon: <Flag size={24} className="text-[#333D4B]" /> },
                { id: 7, name: '카탈로그', option: '50매 1세트', icon: <Flag size={24} className="text-[#333D4B]" /> },
            ]
        },
        {
            category: '소모품/기타',
            items: [
                { id: 11, name: '근조기', option: '설치용 스탠드 포함', icon: <Package size={24} className="text-brand-orange" /> },
                { id: 10, name: '일회용품', option: '종이컵/접시/수저', icon: <Package size={24} className="text-[#333D4B]" /> },
                { id: 12, name: '단말기', option: '카드 결제용 (임대)', icon: <Package size={24} className="text-[#333D4B]" /> },
            ]
        }
    ];

    const categories = ['전체', ...itemData.map(d => d.category)];

    // Flat list for state management
    const allItems = itemData.flatMap(cat => cat.items);
    const [counts, setCounts] = useState(
        allItems.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
    );

    const updateCount = (id, delta) => {
        setCounts(prev => ({
            ...prev,
            [id]: Math.max(0, prev[id] + delta)
        }));
    };

    const getTotalCount = () => Object.values(counts).reduce((a, b) => a + b, 0);

    const handleOrder = () => {
        const hasCustomRequest = customRequest.trim().length > 0;

        if (getTotalCount() === 0 && !hasCustomRequest) {
            setToastMsg("신청할 물품을 선택하거나 기타 내용을 입력해주세요.");
            setShowToast(true);
            return;
        }

        setToastMsg("물품 신청이 완료되었습니다.");
        setShowToast(true);
        setTimeout(() => navigate('/dashboard'), 1500);
    };

    // Filter Logic
    const filteredData = activeTab === '전체'
        ? itemData
        : itemData.filter(d => d.category === activeTab);

    return (
        <div className="pb-32 bg-gray-50 min-h-screen relative">
            <Top
                title="물품 신청"
                showBack={true}
                onBack={() => navigate('/dashboard')}
            />

            {/* Sticky Tabs */}
            <div className="sticky top-[50px] z-20 bg-gray-50 pt-2 pb-4 px-5 flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-100">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-4 py-2 rounded-full text-[14px] font-bold whitespace-nowrap transition-all ${activeTab === cat
                            ? 'bg-brand-black text-white shadow-md'
                            : 'bg-white text-gray-500 border border-gray-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="px-5 space-y-8 mt-2">
                {filteredData.map((section) => (
                    <div key={section.category} className="animate-fade-in">
                        <h2 className="text-[18px] font-bold text-gray-800 mb-4 flex items-center gap-2">
                            {section.category}
                        </h2>
                        <div className="grid gap-3">
                            {section.items.map(item => (
                                <div key={item.id} className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex justify-between items-center group active:scale-[0.99] transition-transform">
                                    <div className="flex items-center gap-4">
                                        <div className="w-[48px] h-[48px] rounded-[16px] bg-gray-50 flex items-center justify-center shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="text-[16px] font-bold text-gray-800 mb-1 leading-none">{item.name}</div>
                                            <div className="text-[13px] text-gray-400 font-medium">{item.option}</div>
                                        </div>
                                    </div>

                                    {/* Stepper */}
                                    <div className="flex items-center bg-gray-50 rounded-[12px] p-1 h-[40px]">
                                        <button
                                            onClick={() => updateCount(item.id, -1)}
                                            disabled={counts[item.id] === 0}
                                            className={`w-[32px] h-full rounded-[8px] flex items-center justify-center transition-colors ${counts[item.id] === 0 ? 'text-gray-300' : 'bg-white text-brand-black shadow-sm'
                                                }`}
                                        >
                                            <Minus size={14} strokeWidth={3} />
                                        </button>
                                        <div className="w-[32px] text-center font-bold text-[15px] text-brand-black">
                                            {counts[item.id]}
                                        </div>
                                        <button
                                            onClick={() => updateCount(item.id, 1)}
                                            className="w-[32px] h-full rounded-[8px] flex items-center justify-center bg-brand-black text-white shadow-sm active:bg-gray-800"
                                        >
                                            <Plus size={14} strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Request Section */}
            <div className="px-5 mt-4">
                <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
                    <h2 className="text-[18px] font-bold text-gray-800 mb-2">기타 / 직접 입력</h2>
                    <p className="text-[13px] text-gray-400 mb-3">
                        리스트에 없는 물품이 필요하거나, 추가 요청사항이 있으시면 적어주세요.
                    </p>
                    <textarea
                        value={customRequest}
                        onChange={(e) => setCustomRequest(e.target.value)}
                        placeholder="예) 의전용 장갑 5켤레 추가 부탁드립니다."
                        className="w-full h-[100px] p-4 rounded-[12px] bg-gray-50 border border-gray-200 focus:border-brand-orange outline-none resize-none text-[15px] placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Bottom Floating Bar */}
            <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 p-5 pb-8 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="max-w-mobile mx-auto">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <span className="text-gray-500 font-medium">총 선택 수량</span>
                        <span className="text-[20px] font-bold text-brand-black">
                            <span className="text-brand-orange">{getTotalCount()}</span>개
                        </span>
                    </div>
                    <Button
                        variant="primary"
                        size="large"
                        className="w-full flex justify-between items-center pl-6 pr-4 shadow-lg shadow-orange-200"
                        onClick={handleOrder}
                        disabled={getTotalCount() === 0}
                    >
                        <span className="font-bold">물품 신청하기</span>
                        {getTotalCount() > 0 && (
                            <div className="bg-white/20 px-2 py-0.5 rounded text-[13px] font-bold">
                                {getTotalCount()}
                            </div>
                        )}
                    </Button>
                </div>
            </div>

            <Toast message={toastMsg} isVisible={showToast} onClose={() => setShowToast(false)} />
        </div >
    );
};

export default ItemOrder;
