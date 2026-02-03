import React, { useState } from 'react';
import { Send, User, MapPin, Phone, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

const AdminDispatch = () => {
    // Form State
    const [form, setForm] = useState({
        customerName: '',
        phone: '',
        relation: '',
        deathLocation: '',
        location: '',
        funeralHome: '',
        jangji: '',
        sangjo: '',
        notes: '',
        attachedFile: null // { name, type, data }
    });

    // Mock Partners
    const partners = [
        { id: 'p1', name: '김지훈', location: '서울 강남구', status: '대기중 (1순위)', rating: 4.9 },
        { id: 'p2', name: '이영희', location: '서울 서초구', status: '대기중', rating: 4.8 },
        { id: 'p3', name: '박철수', location: '경기 성남시', status: '출동중', rating: 4.7 },
        { id: 'p4', name: '최민수', location: '서울 송파구', status: '휴무', rating: 4.5 },
    ];

    const [selectedPartner, setSelectedPartner] = useState('');

    // Monitoring State
    const [statusLog, setStatusLog] = useState([
        { id: 'mk1', status: 'onsite', customerName: '박철수', time: '1시간 전', partner: '김지훈' }
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(prev => ({
                    ...prev,
                    attachedFile: {
                        name: file.name,
                        type: file.type,
                        data: reader.result // Base64
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSendDispatch = () => {
        if (!form.phone) {
            alert('전화번호는 필수입니다.');
            return;
        }
        if (!selectedPartner) {
            alert('출동할 파트너를 선택해주세요.');
            return;
        }

        const partnerM = partners.find(p => p.id === selectedPartner);

        // 1. Create Data Object
        const dispatchData = {
            ...form,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            status: 'waiting',
            targetPartnerId: selectedPartner,
            targetPartnerName: partnerM.name
        };

        // 2. Save to LocalStorage (Simulate Backend Push)
        localStorage.setItem('dispatch_request_v2', JSON.stringify(dispatchData));

        // Add to log as "Waiting"
        const newLog = {
            id: dispatchData.id,
            status: 'waiting',
            customerName: form.customerName,
            time: '방금 전',
            partner: partnerM.name
        };
        setStatusLog(prev => [newLog, ...prev]);

        alert(`${partnerM.name} 파트너에게 출동 요청(파일 포함)을 전송했습니다.`);
    };

    // Listen for Partner Acceptance
    React.useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === 'dispatch_accepted_v2' && e.newValue) {
                const data = JSON.parse(e.newValue);

                // Update Log
                const newLog = {
                    id: Date.now(),
                    status: 'accepted',
                    customerName: form.customerName || '신규 고객',
                    time: '방금 전',
                    partner: data.partnerName
                };
                setStatusLog(prev => [newLog, ...prev]);
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [form.customerName]);

    // Auto-fill for demo
    const fillDemoData = () => {
        setForm(prev => ({
            ...prev,
            customerName: '홍길동',
            phone: '010-1234-5678',
            relation: '자녀',
            deathLocation: '자택',
            location: '서울 강남구',
            funeralHome: '서울아산병원 장례식장',
            jangji: '분당 메모리얼파크',
            sangjo: '고이 스탠다드 299',
            notes: '특이사항: 기독교 장례 희망'
        }));
    };

    const [smartText, setSmartText] = useState('');

    const handleSmartApply = () => {
        if (!smartText.trim()) return;

        let newForm = { ...form };
        const text = smartText;

        // Helper regex extraction
        const extract = (regex) => {
            const match = text.match(regex);
            return match && match[1] ? match[1].trim() : '';
        };

        // 1. Basic Fields
        // Use [ \t]* to avoid matching newlines in the space wrapper
        newForm.customerName = extract(/성함[ \t]*:[ \t]*(.*)/);
        newForm.phone = extract(/휴대폰번호[ \t]*:[ \t]*(.*)/);
        newForm.location = extract(/장례희망지역[ \t]*:[ \t]*(.*)/);
        newForm.deathLocation = extract(/임종위치[ \t]*:[ \t]*(.*)/);

        // 2. Sections (Multi-line)
        const extractSection = (header) => {
            // Match from [Header] until next [Header] or End of String
            const regex = new RegExp(`\\[${header}\\]\\s*([\\s\\S]*?)(?=\\[|$)`);
            return extract(regex);
        };

        newForm.funeralHome = extractSection('장례식장');
        newForm.jangji = extractSection('장지');
        // Sangjo might be simple text or need mapping. For now, just take text.
        // If it matches one of the options, it will auto-select.
        const sangjoText = extractSection('상조');
        if (sangjoText.includes('299') || sangjoText.includes('스탠다드')) newForm.sangjo = '고이 스탠다드 299';
        else if (sangjoText.includes('389') || sangjoText.includes('프리미엄')) newForm.sangjo = '고이 프리미엄 389';
        else if (sangjoText.includes('159') || sangjoText.includes('무빈소')) newForm.sangjo = '무빈소 159';

        // 3. Notes (Comprehensive Compilation as per Request)
        const deceasedInfo = extractSection('고인\\(예정인\\) 정보');
        const funeralHomeDetail = extractSection('장례식장');
        const jangjiDetail = extractSection('장지');
        const sangjoDetail = extractSection('상조');
        const relation = extractSection('고객 특이사항');
        const extraInfo = extractSection('추가, 공제 필요 내역');
        const otherBenefits = extractSection('기타 서비스 혜택');

        // Construct a formatted string matching the user's desired output
        newForm.notes = `
[고객 특이사항]
${relation || '-'}

[고인(예정인) 정보]
${deceasedInfo || '-'}

[장례식장]
${funeralHomeDetail || '-'}

[장지]
${jangjiDetail || '-'}

[상조]
${sangjoDetail || '-'}

[추가, 공제 필요 내역]
${extraInfo || '-'}

[기타 서비스 혜택]
${otherBenefits || '-'}`;

        // Relation field hack: try to find '관계 :' inside '고객 특이사항' or just use first line
        if (relation.includes('관계')) {
            newForm.relation = relation.match(/관계\s*:\s*(.*)/)?.[1] || '';
        }

        // Debug: Check if notes are generated
        // alert(`Generated Notes:\n${newForm.notes}`); 

        setForm(newForm);
        // alert('카카오톡 양식이 적용되었습니다.'); (Commented out to use the logic below)

        // Use a more descriptive success message or check if empty
        if (newForm.notes.trim().length > 50) { // arbitrary small length check
            alert('카카오톡 양식이 적용되었습니다. (특이사항 업데이트 완료)');
        } else {
            alert('카카오톡 양식이 적용되었으나, 특이사항을 찾지 못했습니다. 양식을 확인해주세요.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">출동 요청 관리</h2>

            <div className="flex gap-8">
                {/* Left: Input Form */}
                <div className="flex-1 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                    {/* Smart Paste Section */}
                    <div className="mb-8 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-yellow-800 flex items-center gap-2">
                                <FileText size={16} /> 알림톡 양식 붙여넣기 (자동입력)
                            </label>
                            <button
                                onClick={handleSmartApply}
                                className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-lg text-xs font-bold hover:bg-yellow-500 transition-colors"
                            >
                                적용하기
                            </button>
                        </div>
                        <textarea
                            value={smartText}
                            onChange={(e) => setSmartText(e.target.value)}
                            placeholder="카카오톡 알림톡 내용을 여기에 붙여넣으세요.&#13;&#10;[파트너 전달사항]..."
                            className="w-full h-24 p-3 text-xs border border-yellow-200 rounded-lg focus:border-yellow-400 outline-none resize-none bg-white"
                        />
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Send size={18} /> 새 출동 요청
                        </h3>
                        <button onClick={fillDemoData} className="text-xs text-gray-400 hover:text-gray-600 underline">
                            데모 데이터 채우기
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">고객명 (상주)</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                    <input
                                        name="customerName" value={form.customerName} onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-orange outline-none"
                                        placeholder="홍길동"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                    <input
                                        name="phone" value={form.phone} onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-brand-orange outline-none"
                                        placeholder="010-0000-0000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">고인과의 관계</label>
                                <input
                                    name="relation" value={form.relation} onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                                    placeholder="자녀, 배우자 등"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">임종 장소</label>
                                <input
                                    name="deathLocation" value={form.deathLocation} onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                                    placeholder="자택, 요양병원 등"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">장례 희망 지역</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <input
                                    name="location" value={form.location} onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                                    placeholder="서울시 강남구"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">장례식장 (희망)</label>
                                <input
                                    name="funeralHome" value={form.funeralHome} onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                                    placeholder="미정 시 공란"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">장지 (희망)</label>
                                <input
                                    name="jangji" value={form.jangji} onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                                    placeholder="선산, 납골당 등"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">이용 예정 상품</label>
                            <select
                                name="sangjo" value={form.sangjo} onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none bg-white"
                            >
                                <option value="">선택해주세요</option>
                                <option value="고이 스탠다드 299">고이 스탠다드 299</option>
                                <option value="고이 프리미엄 389">고이 프리미엄 389</option>
                                <option value="무빈소 159">무빈소 159</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">특이사항 (전달사항)</label>
                            <textarea
                                name="notes" value={form.notes} onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none h-24 resize-none"
                                placeholder="파트너에게 전달할 중요 사항을 입력하세요."
                            />
                        </div>

                        {/* File Attachment */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <FileText size={16} /> 이행완료확인서/증빙서류 첨부
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.jpg,.png"
                                onChange={handleFileChange}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {form.attachedFile && (
                                <div className="mt-2 text-xs text-green-600 font-bold flex items-center gap-1">
                                    <CheckCircle2 size={12} /> {form.attachedFile.name} 첨부됨
                                </div>
                            )}
                            <p className="text-[11px] text-gray-400 mt-1 ml-1">
                                * 고이 상조 가입자인 경우 이행완료확인서를 반드시 첨부해주세요.
                            </p>
                        </div>

                        {/* Partner Selection */}
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                            <label className="block text-sm font-bold text-orange-800 mb-2">배정할 파트너 선택 (필수)</label>
                            <select
                                value={selectedPartner}
                                onChange={(e) => setSelectedPartner(e.target.value)}
                                className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm outline-none bg-white font-medium text-gray-800 focus:ring-2 focus:ring-orange-200"
                            >
                                <option value="">파트너를 선택하세요</option>
                                {partners.map(p => (
                                    <option key={p.id} value={p.id} disabled={p.status === '출동중' || p.status === '휴무'}>
                                        {p.name} ({p.location}) - {p.status} {p.rating ? `⭐${p.rating}` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleSendDispatch}
                        className="w-full mt-6 bg-brand-black text-white h-12 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg"
                    >
                        출동 요청 보내기
                    </button>
                </div>

                {/* Right: Monitoring (Dynamic) */}
                <div className="w-80 space-y-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <AlertCircle size={18} /> 실시간 상태
                        </h3>
                        <div className="space-y-3">
                            {statusLog.map((log) => (
                                <div key={log.id} className={`border-l-4 p-3 rounded ${log.status === 'onsite' ? 'border-l-blue-500 bg-blue-50/50 border-gray-100' :
                                    log.status === 'accepted' ? 'border-l-green-500 bg-green-50/50 border-gray-100' :
                                        'border-l-orange-500 bg-orange-50/50 border-gray-100'
                                    }`}>
                                    <div className={`text-xs font-bold mb-1 ${log.status === 'onsite' ? 'text-blue-600' :
                                        log.status === 'accepted' ? 'text-green-600' :
                                            'text-orange-600'
                                        }`}>
                                        {log.status === 'onsite' ? 'On Site (현장 도착)' :
                                            log.status === 'accepted' ? 'Accepted (출동 수락)' :
                                                'Waiting (수락 대기)'}
                                    </div>
                                    <div className="text-sm font-bold text-gray-900">{log.customerName} 고객님</div>
                                    <div className="text-xs text-gray-500 flex justify-between mt-1">
                                        <span>{log.time}</span>
                                        <span>{log.partner}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                        <h4 className="font-bold text-blue-800 text-sm mb-3">파트너 대기 현황 (추천)</h4>
                        <div className="space-y-2">
                            {partners.map((p, idx) => (
                                <div key={p.id} className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold ${p.status.includes('1순위') ? 'text-blue-700 bg-blue-200 px-1.5 py-0.5 rounded' : 'text-gray-600'
                                            }`}>
                                            {p.status.includes('1순위') ? '1순위' : `${idx + 1}순위`}
                                        </span>
                                        <span className="text-gray-800">{p.name}</span>
                                    </div>
                                    <span className={`font-medium ${p.status === '출동중' ? 'text-orange-500' :
                                            p.status === '휴무' ? 'text-gray-400' :
                                                'text-blue-600'
                                        }`}>
                                        {p.status.replace(' (1순위)', '')}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] text-blue-400 mt-4 leading-relaxed">
                            * 거리를 고려하여 최적의 파트너를 배정해주세요.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDispatch;
