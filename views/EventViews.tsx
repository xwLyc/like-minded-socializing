
import React, { useState } from 'react';
import { TripEvent, UserProfile } from '../types';
import { ACTIVITY_TYPES } from '../mockData';
import { Search, Plus, X, Calendar, Clock, ChevronDown } from 'lucide-react';
import { Tag, FloatingActionButton, EventCard } from '../components';

export const SquareView = ({ events, onEventClick, onCreateClick }: { events: TripEvent[], onEventClick: (e: TripEvent) => void, onCreateClick: () => void }) => {
   const [filter, setFilter] = useState('全部');
   
   const filteredEvents = filter === '全部' ? events : events.filter(e => e.tags.includes(filter));

   return (
     <div className="pb-20">
        <div className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-gray-100">
           <div className="flex items-center bg-gray-100 rounded-full px-4 py-2.5 mb-3 transition-all focus-within:ring-2 focus-within:ring-brand-100 focus-within:bg-white border border-transparent focus-within:border-brand-200">
              <Search size={18} className="text-gray-400 mr-2" />
              <input placeholder="搜所一起想做的事情吧..." className="bg-transparent text-sm flex-1 outline-none text-gray-800 placeholder:text-gray-400" />
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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [capacity, setCapacity] = useState('4');

  const handleSubmit = () => {
     if (!title || !desc || !startDate) {
        alert("请填写完整信息（标题、内容、开始时间必填）");
        return;
     }
     // Just mock for now
     alert("活动发起成功！(模拟)");
     onBack();
  };

  return (
     <div className="fixed inset-0 z-[70] bg-gray-50 flex flex-col animate-slide-up">
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
           <button onClick={onBack} className="p-1 hover:bg-gray-100 rounded-full">
             <X size={24} className="text-gray-600" />
           </button>
           <h2 className="font-bold text-lg">发起一起</h2>
           <div className="w-8"></div> {/* Spacer */}
        </div>
        
        {/* Form Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar pb-24">
           <div className="bg-white p-4 rounded-xl shadow-sm space-y-5">
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">
                    想做什么？ <span className="text-red-500 font-bold">*</span>
                 </label>
                 <input 
                   value={title}
                   onChange={e => setTitle(e.target.value)}
                   placeholder="例如：周末下午学习交流，三缺一" 
                   className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-brand-500 font-bold text-sm" 
                 />
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">所属分类</label>
                 <div className="flex flex-wrap gap-2">
                    {ACTIVITY_TYPES.map(t => (
                       <button
                          key={t}
                          onClick={() => setType(t)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${type === t ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-200'}`}
                       >
                          {t}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">人数限制</label>
                   <div className="relative">
                     <select 
                       value={capacity}
                       onChange={e => setCapacity(e.target.value)}
                       className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-brand-500 appearance-none text-sm"
                     >
                        <option value="2">2人</option>
                        <option value="3">3人</option>
                        <option value="4">4人</option>
                        <option value="5">5人</option>
                        <option value="6">6人</option>
                     </select>
                     <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                       开始时间 <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="datetime-local"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 pl-8 outline-none focus:border-brand-500 text-xs" 
                      />
                      <Clock size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">结束时间</label>
                    <div className="relative">
                      <input 
                        type="datetime-local"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 pl-8 outline-none focus:border-brand-500 text-xs" 
                      />
                      <Clock size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 opacity-50" />
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white p-4 rounded-xl shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                 详细介绍 <span className="text-red-500 font-bold">*</span>
              </label>
              <textarea 
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="介绍一下活动内容、集合地点、对搭子的期待等..." 
                className="w-full h-40 bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-brand-500 resize-none text-sm leading-relaxed" 
              />
           </div>
        </div>

        {/* Bottom Button */}
        <div className="bg-white border-t border-gray-100 p-4 pb-safe sticky bottom-0 z-20">
           <button 
             onClick={handleSubmit}
             className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-brand-700 active:scale-95 transition-all"
           >
             立即发布
           </button>
        </div>
     </div>
  );
};
