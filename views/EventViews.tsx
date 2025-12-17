
import React, { useState } from 'react';
import { TripEvent, UserProfile } from '../types';
import { ACTIVITY_TYPES } from '../mockData';
import { Search, Plus, X } from 'lucide-react';
import { Tag, FloatingActionButton, EventCard } from '../components';

export const SquareView = ({ events, onEventClick, onCreateClick }: { events: TripEvent[], onEventClick: (e: TripEvent) => void, onCreateClick: () => void }) => {
   const [filter, setFilter] = useState('全部');
   
   const filteredEvents = filter === '全部' ? events : events.filter(e => e.tags.includes(filter));

   return (
     <div className="pb-20">
        <div className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-gray-100">
           <div className="flex items-center bg-gray-100 rounded-full px-4 py-2.5 mb-3 transition-all focus-within:ring-2 focus-within:ring-brand-100 focus-within:bg-white border border-transparent focus-within:border-brand-200">
              <Search size={18} className="text-gray-400 mr-2" />
              <input placeholder="搜索活动、地点..." className="bg-transparent text-sm flex-1 outline-none text-gray-800 placeholder:text-gray-400" />
           </div>
           <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
              {['全部', ...ACTIVITY_TYPES].map(type => (
                 <Tag 
                   key={type} 
                   label={type} 
                   active={filter === type} 
                   onClick={() => setFilter(type)} 
                 />
              ))}
           </div>
        </div>

        <div className="p-4">
           {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} onClick={() => onEventClick(event)} />
           ))}
           <div className="h-10"></div>
        </div>

        <FloatingActionButton onClick={onCreateClick} icon={Plus} label="发起" />
     </div>
   );
};

export const CreateView = ({ user, onBack }: { user: UserProfile, requirePhoneBinding?: () => void, onBack: () => void }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState(ACTIVITY_TYPES[0]);
  const [date, setDate] = useState('');

  const handleSubmit = () => {
     if (!title || !desc || !date) {
        alert("请填写完整信息");
        return;
     }
     // Just mock for now
     alert("活动发起成功！(模拟)");
     onBack();
  };

  return (
     <div className="fixed inset-0 z-[70] bg-gray-50 flex flex-col animate-slide-up">
        <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between sticky top-0">
           <button onClick={onBack}><X size={24} className="text-gray-600" /></button>
           <h2 className="font-bold text-lg">发起活动</h2>
           <button onClick={handleSubmit} className="text-brand-600 font-bold text-sm bg-brand-50 px-3 py-1.5 rounded-lg">发布</button>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
           <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">活动主题</label>
                 <input 
                   value={title}
                   onChange={e => setTitle(e.target.value)}
                   placeholder="例如：周末公园徒步，三缺一" 
                   className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-brand-500 font-bold" 
                 />
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">活动类型</label>
                 <div className="flex flex-wrap gap-2">
                    {ACTIVITY_TYPES.map(t => (
                       <button
                          key={t}
                          onClick={() => setType(t)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${type === t ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-200'}`}
                       >
                          {t}
                       </button>
                    ))}
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">时间</label>
                 <input 
                   type="datetime-local"
                   value={date}
                   onChange={e => setDate(e.target.value)}
                   className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-brand-500" 
                 />
              </div>
           </div>

           <div className="bg-white p-4 rounded-xl shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-2">活动详情</label>
              <textarea 
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="介绍一下活动内容、集合地点、费用说明等..." 
                className="w-full h-40 bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-brand-500 resize-none" 
              />
           </div>
        </div>
     </div>
  );
};
