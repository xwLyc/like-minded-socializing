
import React, { useState, useEffect, useRef } from 'react';
import { ChatSession, Notification, ChatMessage, UserProfile } from '../types';
import { INITIAL_MESSAGES } from '../mockData';
import { Bell, ChevronRight, ArrowLeft, MoreHorizontal, Send } from 'lucide-react';

export const MessagesTab = ({ 
  chats, 
  notifications,
  onNotificationClick,
  onChatClick
}: { 
  chats: ChatSession[],
  notifications: Notification[],
  onNotificationClick: () => void,
  onChatClick: (id: string) => void
}) => {
  const unreadNotes = notifications.filter(n => !n.isRead).length;

  return (
    /* Changed class to className */
    <div className="pb-20 min-h-screen bg-gray-50">
       <div className="bg-white sticky top-0 flex items-center p-4 border-b border-gray-100 shadow-sm z-10">
          <span className="font-bold text-lg">消息</span>
       </div>

       <div 
         onClick={onNotificationClick}
         className="bg-white p-4 mb-2 flex items-center justify-between active:bg-gray-50 cursor-pointer"
       >
          <div className="flex items-center space-x-3">
             <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 relative">
               <Bell size={24} />
               {unreadNotes > 0 && (
                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border border-white">
                    {unreadNotes}
                 </span>
               )}
             </div>
             <div>
                <div className="font-bold text-gray-900">消息通知</div>
                <div className="text-xs text-gray-500 mt-0.5">
                   {notifications.length > 0 ? notifications[0].content : '暂无新通知'}
                </div>
             </div>
          </div>
          <ChevronRight size={20} className="text-gray-300" />
       </div>

       <div className="bg-white min-h-[50vh]">
          <div className="px-4 py-2 text-xs text-gray-400 font-bold bg-gray-50">我的群聊</div>
          {chats.length === 0 ? (
             <div className="text-center py-10 text-gray-400 text-sm">暂无群聊，快去参加活动吧</div>
          ) : (
             <div>
                {chats.map(chat => (
                   <div 
                     key={chat.id} 
                     onClick={() => onChatClick(chat.id)}
                     className="flex items-center p-4 border-b border-gray-100 active:bg-gray-50 cursor-pointer"
                   >
                      <div className="relative">
                         <img src={chat.avatar} className="w-12 h-12 rounded-xl bg-gray-200 border border-gray-100" />
                         {chat.unread > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border border-white">
                               {chat.unread}
                            </span>
                         )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                         <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold text-gray-900 truncate">{chat.title}</h4>
                            <span className="text-xs text-gray-400 shrink-0">{chat.lastTime}</span>
                         </div>
                         <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                      </div>
                   </div>
                ))}
             </div>
          )}
       </div>
    </div>
  );
};

export const NotificationListView = ({ 
  notifications, 
  onBack, 
  onItemClick 
}: { 
  notifications: Notification[], 
  onBack: () => void, 
  onItemClick: (n: Notification) => void 
}) => {
  return (
    /* Changed class to className */
    <div className="min-h-screen bg-gray-50 z-[60] relative">
       <div className="bg-white sticky top-0 flex items-center p-4 border-b border-gray-100 shadow-sm z-10">
          <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <span className="font-bold text-lg ml-2">消息通知</span>
       </div>

       <div className="p-4 space-y-3">
          {notifications.length === 0 && (
             <div className="text-center py-10 text-gray-400 text-sm">暂无新消息</div>
          )}
          {notifications.map(item => (
            <div 
              key={item.id} 
              onClick={() => onItemClick(item)}
              className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform ${!item.isRead ? 'bg-blue-50/30' : ''}`}
            >
               <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${item.type === 'comment' ? 'bg-blue-400' : item.type === 'team_interaction' ? 'bg-purple-400' : 'bg-orange-400'}`}>
                       {item.type === 'comment' ? '留言' : item.type === 'team_interaction' ? '队友' : '系统'}
                    </span>
                    <span className="font-bold text-sm text-gray-800">{item.title}</span>
                    {!item.isRead && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
               </div>
               <p className="text-sm text-gray-600 line-clamp-2 pl-10">{item.content}</p>
               <div className="mt-2 pl-10 text-xs text-brand-600 flex items-center">
                  查看详情 <ChevronRight size={12}/>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

export const ChatRoomView = ({ chat, user, onBack }: { chat: ChatSession, user: UserProfile, onBack: () => void }) => {
   const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
   const [inputText, setInputText] = useState('');
   const messagesEndRef = useRef<HTMLDivElement>(null);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   const handleSend = () => {
      if (!inputText.trim()) return;

      const newMessage: ChatMessage = {
         id: Date.now().toString(),
         senderId: user.id,
         senderName: user.name,
         senderAvatar: user.avatar,
         content: inputText,
         time: '刚刚',
         isMe: true
      };

      setMessages(prev => [...prev, newMessage]);
      setInputText('');
   };

   return (
      /* Changed class to className */
      <div className="fixed inset-0 z-[70] bg-gray-100 flex flex-col animate-slide-up">
         <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
            <button onClick={onBack} className="p-2 -ml-2 text-gray-600"><ArrowLeft size={24} /></button>
            <h2 className="text-lg font-bold flex-1 text-center pr-10 truncate">{chat.title}</h2>
            <button><MoreHorizontal size={24} className="text-gray-600"/></button>
         </div>
         
         <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map(msg => (
               <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  {!msg.isMe && (
                     <img src={msg.senderAvatar} className="w-9 h-9 rounded-full bg-gray-200 mr-2 self-start" />
                  )}
                  <div className={`max-w-[70%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                     {!msg.isMe && <span className="text-[10px] text-gray-500 mb-1 ml-1">{msg.senderName}</span>}
                     <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.isMe 
                           ? 'bg-brand-500 text-white rounded-tr-none shadow-md' 
                           : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm'
                     }`}>
                        {msg.content}
                     </div>
                     <span className="text-[10px] text-gray-400 mt-1 mx-1">{msg.time}</span>
                  </div>
                  {msg.isMe && (
                     <img src={msg.senderAvatar} className="w-9 h-9 rounded-full bg-gray-200 ml-2 self-start" />
                  )}
               </div>
            ))}
            <div ref={messagesEndRef} />
         </div>

         <div className="bg-white p-3 pb-safe border-t border-gray-200 flex items-center space-x-3">
            <input 
               value={inputText}
               onInput={e => setInputText((e.target as any).value)}
               /* Fixed onkeydown to onKeyDown and handled typing */
               onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
               className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all" 
               placeholder="说点什么..." 
            />
            <button 
               onClick={handleSend}
               disabled={!inputText.trim()}
               className={`p-2.5 rounded-full transition-colors ${inputText.trim() ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-400'}`}
            >
               <Send size={18} />
            </button>
         </div>
      </div>
   );
};
