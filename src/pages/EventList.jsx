import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Top from '../components/tds/Top';
import ListRow from '../components/tds/ListRow';
import Badge from '../components/tds/Badge';

const EventList = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('ongoing'); // ongoing | completed

    // Helper to get Event Data from LocalStorage
    const getEventData = (baseEvent) => {
        const consultationStr = localStorage.getItem(`event_${baseEvent.id}_consultation`);
        const preliminaryStr = localStorage.getItem(`event_${baseEvent.id}_preliminary`);

        const consData = (consultationStr && consultationStr !== "undefined") ? JSON.parse(consultationStr) : null;
        const preData = (preliminaryStr && preliminaryStr !== "undefined") ? JSON.parse(preliminaryStr) : null;

        let name = baseEvent.name;
        let place = baseEvent.place;
        let date = baseEvent.date;

        // Name Priority: Consultation > Preliminary (Deceased) > Preliminary (Customer) > Default
        if (consData?.deceasedName) name = `${consData.deceasedName}님 빈소`;
        else if (preData?.deceasedName) name = `${preData.deceasedName}님 빈소`;
        else if (preData?.customerName) name = `${preData.customerName}님 (의뢰)`;

        // Place Priority
        if (consData?.place) place = consData.place;
        else if (preData?.place) place = preData.place;

        // Date Priority
        if (consData?.receptionDate) date = `${consData.receptionDate} ~`;

        // Check if Preliminary is done
        const isPrelimDone = localStorage.getItem(`event_${baseEvent.id}_preliminary_done`) === 'true';

        return { ...baseEvent, name, place, date, isPrelimDone };
    };

    const [events, setEvents] = useState([]);

    // Load Events from LocalStorage + Demo Data
    React.useEffect(() => {
        const loadEvents = () => {
            // 1. Load Dynamic Events (saved from Dashboard)
            const savedEventsStr = localStorage.getItem('partner_events');
            const savedEvents = savedEventsStr ? JSON.parse(savedEventsStr) : [];

            // 2. Demo Events (Keep for UI showcase)
            // 2. Demo Events (Keep for UI showcase)
            const demoEvents = []; // Removed hardcoded duplicates
            const demoCompleted = [
                { id: 993, name: "이영희님 빈소", place: "삼성서울병원 1호실", date: "2024.12.20", status: "completed" },
                { id: 994, name: "박민수님 빈소", place: "아산병원 2호실", date: "2024.12.15", status: "completed" },
                { id: 995, name: "최지우님 빈소", place: "성모병원 7호실", date: "2024.12.10", status: "completed" },
            ];

            // 3. Process Dynamic Events through getEventData helper
            const processedDynamic = savedEvents.map(evt => getEventData(evt));
            const processedDemo = demoEvents.map(evt => getEventData(evt)); // Wait, demo events might not need processing if they don't have LS triggers

            // 4. Combine based on activeTab
            // If tab is 'ongoing', show dynamic events (ongoing) + demo ongoing
            // If tab is 'completed', show dynamic events (completed) + demo completed

            // Simple Filter
            const allEvents = [...processedDynamic, ...processedDemo, ...demoCompleted];

            // Filter by active Tab
            const filtered = allEvents.filter(e => e.status === activeTab);

            // Sort by Date (Newest first) - Optional
            // filtered.sort((a,b) => b.id - a.id); // Simple ID sort for now

            setEvents(filtered);
        };

        loadEvents();
        // Listen for updates (in case we come back from detail page)
        window.addEventListener('storage', loadEvents);
        return () => window.removeEventListener('storage', loadEvents);
    }, [activeTab]);

    // Const events removal since it's now state
    // const events = activeTab === 'ongoing' ? ongoingEvents : completedEvents;

    return (
        <div className="pb-12 bg-brand-bg min-h-screen">
            <Top
                title="행사 관리"
                onBack={() => navigate('/dashboard')}
            />

            {/* Tabs */}
            <div className="flex bg-white border-b border-[#F2F4F6]">
                <Tab label="진행 중" isActive={activeTab === 'ongoing'} onClick={() => setActiveTab('ongoing')} />
                <Tab label="완료" isActive={activeTab === 'completed'} onClick={() => setActiveTab('completed')} />
            </div>

            {/* List */}
            <div className="mt-2">
                {events.map((event) => (
                    <div key={event.id} className="bg-white mb-[1px]">
                        <ListRow
                            onClick={() => navigate(`/events/${event.id}`)}
                            left={
                                <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-[14px] font-bold ${event.status === 'ongoing' ? 'bg-[#FFF1EB] text-brand-orange' : 'bg-[#F2F4F6] text-[#8B95A1]'}`}>
                                    {event.name[0]}
                                </div>
                            }
                            contents={
                                <>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-[16px] font-bold text-brand-black">{event.name}</span>
                                        {event.status === 'ongoing' && <Badge variant="orange">진행</Badge>}
                                    </div>
                                    <div className="text-[13px] text-[#8B95A1]">{event.place}</div>
                                </>
                            }
                            right={
                                <span className="text-[13px] text-[#8B95A1]">{event.date}</span>
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const Tab = ({ label, isActive, onClick }) => (
    <div
        onClick={onClick}
        className={`flex-1 text-center h-[52px] flex items-center justify-center text-[15px] font-semibold cursor-pointer transition-colors relative ${isActive ? 'text-brand-black' : 'text-[#8B95A1]'}`}
    >
        {label}
        {isActive && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-black" />
        )}
    </div>
)

export default EventList;
