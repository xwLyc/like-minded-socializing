
import React, { useState } from 'react';
import { TripEvent } from '../types';
import { Search, Plus, ArrowLeft } from 'lucide-react';
import { EventCard } from '../components';
import { ACTIVITY_TYPES, AGE_RANGES } from '../mockData';

export const SquareView = ({ events, onEventClick, onCreateClick }: { events: TripEvent[], onEventClick: (e: TripEvent) => void, onCreateClick: () => void }) => {
   const [filter, setFilter] = useState('全部');

   const filteredEvents = events.filter(e => {
      if (filter === '全部') return true;
      return e.tags.includes(filter);
   });

   return (
     /* Changed class to className */
     <div className="pb-24">
        <div className="bg-white/90 backdrop-blur-md p-6 sticky top-0 z-10 border-b border-gray-50 space-y-4">
           <h1 className="text-2xl font-black text-gray-900 tracking-tight">寻找伴侣</h1>
           <div className="flex items-center bg-gray-100 rounded-2xl px-4 py-3">
              <Search size={18} className="text-gray-400 mr-3" />
              <input placeholder="想去哪儿玩？想找什么搭子？" className="bg-transparent text-sm flex-1 outline-none text-gray-800 font-bold placeholder:text-gray-400" />
           </div>
           <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
              {['全部', ...ACTIVITY_TYPES].map(type => (
                 <button 
                   key={type}
                   onClick={() => setFilter(type)}
                   className={`px-5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${filter === type ? 'bg-brand-600 text-white shadow-lg shadow-brand-100' : 'bg-white text-gray-400 border border-gray-100'}`}
                 >
                   {type}
                 </button>
              ))}
           </div>
        </div>

        <div className="p-6">
           {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} onClick={() => onEventClick(event)} />
           ))}
           {filteredEvents.length === 0 && <div className="text-center py-20 text-gray-400 font-bold">暂时没发现新局</div>}
        </div>

        <button 
          onClick={onCreateClick}
          className="fixed bottom-24 right-6 bg-brand-600 text-white w-14 h-14 rounded-2xl shadow-xl shadow-brand-200 flex items-center justify-center active:scale-90 transition-all z-40"
        >
          <Plus size={32} strokeWidth={3} />
        </button>
     </div>
   );
};

export const CreateView = ({ onBack }: { user: any, onBack: () => void }) => (
  /* Changed class to className */
  <div className="fixed inset-0 z-[110] bg-white p-6 flex flex-col overflow-y-auto">
    <div className="flex justify-between items-center mb-8 shrink-0">
      <button onClick={onBack} className="p-2 -ml-2 text-gray-400"><ArrowLeft size={24} /></button>
      <h2 className="text-xl font-black">发起活动</h2>
      <button onClick={() => { alert('发布成功！'); onBack(); }} className="bg-brand-600 text-white px-5 py-2 rounded-xl font-black text-sm shadow-lg shadow-brand-100">发布</button>
    </div>
    
    <div className="space-y-6 flex-1 pb-10">
      <div className="space-y-2">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">活动主题</label>
        <input placeholder="比如：周三下午麻将局" className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none border border-transparent focus:bg-white focus:border-brand-500 transition-all" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
           <label className="text-xs font-black text-gray-400 uppercase tracking-widest">目的地</label>
           <input placeholder="烟台·阳光花园" className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none border border-transparent focus:bg-white focus:border-brand-500 transition-all" />
        </div>
        <div className="space-y-2">
           <label className="text-xs font-black text-gray-400 uppercase tracking-widest">时间</label>
           <input placeholder="本周三 14:00" className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none border border-transparent focus:bg-white focus:border-brand-500 transition-all" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
           <label className="text-xs font-black text-gray-400 uppercase tracking-widest">人数上限</label>
           <input type="number" placeholder="4" className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none border border-transparent focus:bg-white focus:border-brand-500 transition-all" />
        </div>
        <div className="space-y-2">
           <label className="text-xs font-black text-gray-400 uppercase tracking-widest">适龄范围</label>
           <select className="w-full bg-gray-50 rounded-2xl p-4 font-bold outline-none border border-transparent focus:bg-white focus:border-brand-500 transition-all appearance-none">
              {AGE_RANGES.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
           </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">具体介绍</label>
        <textarea placeholder="三缺一，纯娱乐，打得快的来..." className="w-full h-32 bg-gray-50 rounded-2xl p-4 font-bold outline-none border border-transparent focus:bg-white focus:border-brand-500 transition-all resize-none" />
      </div>
    </div>
  </div>
);
