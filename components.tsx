
import React, { useState } from 'react';
import { MapPin, Calendar, Users, Camera, MessageSquare, Heart, CheckCircle, User, Send, Trash2 } from 'lucide-react';
import { TripEvent, Post, Comment } from './types';

// --- UI Components ---

export const TabBar = ({ current, onChange, unreadCount }: { current: string, onChange: (v: string) => void, unreadCount: number }) => {
  const tabs = [
    { id: 'square', label: '广场', icon: MapPin },
    { id: 'gallery', label: '精彩', icon: Camera },
    { id: 'messages', label: '消息', icon: MessageSquare }, 
    { id: 'profile', label: '我的', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe pt-2 px-6 flex justify-between items-center z-50 h-16 shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = current === tab.id;
        const showBadge = tab.id === 'messages' && unreadCount > 0;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center space-y-1 relative ${isActive ? 'text-brand-600' : 'text-gray-400'}`}
          >
            <div className="relative">
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {showBadge && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
              )}
            </div>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const Tag: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
      active 
        ? 'bg-brand-500 text-white shadow-md' 
        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
    }`}
  >
    {label}
  </button>
);

export const FloatingActionButton: React.FC<{ onClick: () => void, icon: React.ElementType, label?: string }> = ({ onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className="fixed bottom-20 right-4 bg-brand-600 text-white p-4 rounded-full shadow-xl shadow-brand-200 hover:bg-brand-700 active:scale-95 transition-all z-40 flex items-center justify-center"
  >
    <Icon size={24} />
    {label && <span className="ml-2 font-bold text-sm">{label}</span>}
  </button>
);

export const AvatarWithGender: React.FC<{ user: { avatar: string, name: string, gender: 'male' | 'female' }, size?: string }> = ({ user, size = "w-8 h-8" }) => (
  <div className={`relative ${size} shrink-0`}>
    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full bg-gray-200 object-cover border border-gray-100" />
    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center text-[8px] text-white ${user.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'}`}>
      {user.gender === 'male' ? '♂' : '♀'}
    </div>
  </div>
);

// --- Cards ---

export const EventCard: React.FC<{ event: TripEvent, onClick: () => void }> = ({ event, onClick }) => (
  <div onClick={onClick} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 active:scale-[0.98] transition-transform cursor-pointer">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-bold text-gray-900 leading-tight flex-1">{event.title}</h3>
      {event.status === 'full' && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-md ml-2 shrink-0">已满员</span>}
    </div>
    
    <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
      {event.tags.map(tag => (
        <span key={tag} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded border border-brand-100">{tag}</span>
      ))}
      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">{event.ageRange}</span>
    </div>

    <div className="flex items-center text-gray-500 text-sm mb-3 space-x-4">
      <div className="flex items-center">
        <Calendar size={14} className="mr-1" />
        {event.date}
      </div>
      <div className="flex items-center">
        <MapPin size={14} className="mr-1" />
        {event.destination}
      </div>
    </div>

    <p className="text-gray-600 text-sm line-clamp-2 mb-4 bg-gray-50 p-2 rounded-lg italic">
      "{event.description}"
    </p>

    <div className="flex justify-between items-center pt-2 border-t border-gray-50">
      <div className="flex items-center space-x-2">
        <AvatarWithGender user={event.organizer} />
        <span className="text-sm font-medium text-gray-700">{event.organizer.name}</span>
        {event.organizer.isPhoneVerified && <CheckCircle size={14} className="text-blue-500" fill="currentColor" color="white"/>}
      </div>
      <div className="flex items-center text-gray-500 text-xs">
         <Users size={14} className="mr-1" />
         {event.enrolled}/{event.capacity} 人
         <button className="ml-3 bg-brand-600 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-brand-700">
            详情
         </button>
      </div>
    </div>
  </div>
);

export const GalleryCard: React.FC<{ post: Post, onClick?: () => void }> = ({ post, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white mb-4 shadow-sm border-b border-gray-100 pb-4 active:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between p-4 pb-2">
         <div className="flex items-center space-x-3">
            <AvatarWithGender user={post.author} size="w-10 h-10" />
            <div>
              <div className="text-sm font-bold text-gray-900 flex items-center">
                 {post.author.name}
                 <span className="ml-2 text-[10px] bg-brand-100 text-brand-600 px-1.5 py-0.5 rounded border border-brand-200">领队发布</span>
              </div>
              <div className="text-xs text-gray-500">2小时前</div>
            </div>
         </div>
      </div>
  
      <div className="aspect-[2/1] w-full bg-gray-100 overflow-hidden relative">
        <img src={post.images[0]} className="w-full h-full object-cover" />
        {post.images.length > 1 && (
           <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
              <Camera size={12} className="mr-1"/>
              {post.images.length}
           </div>
        )}
      </div>

      <div className="p-4">
        {post.relatedEventTitle && (
          <div className="inline-block bg-accent-50 text-accent-600 text-xs px-2 py-1 rounded mb-2">
            来自于: {post.relatedEventTitle} 小队
          </div>
        )}
        <p className="text-gray-800 text-sm leading-relaxed line-clamp-2">{post.content}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-6 text-gray-500">
            <div className="flex items-center space-x-1 hover:text-red-500">
              <Heart size={20} fill="currentColor" className="text-red-500" />
              <span className="text-sm font-bold">{post.likes}</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-blue-500">
              <MessageSquare size={20} />
              <span className="text-sm">{post.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Consultation Component (Chat Style) ---

export const ConsultationThread: React.FC<{ 
  inquirer: { userId: string, userName: string, userAvatar: string, gender: 'male' | 'female' },
  organizerId: string,
  comments: Comment[], 
  onReply: (text: string) => void,
  canReply: boolean 
}> = ({ inquirer, organizerId, comments, onReply, canReply }) => {
  const [replyText, setReplyText] = useState('');

  const handleSend = () => {
    if (replyText.trim()) {
      onReply(replyText);
      setReplyText('');
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl mb-4 overflow-hidden shadow-sm">
      {/* Thread Header */}
      <div className="bg-white p-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-2">
           <AvatarWithGender user={{ name: inquirer.userName, avatar: inquirer.userAvatar, gender: inquirer.gender }} size="w-6 h-6" />
           <span className="text-xs font-bold text-gray-700">{inquirer.userName} 的咨询</span>
        </div>
      </div>
      
      {/* Chat Area - Messages flow from top (old) to bottom (new) */}
      <div className="p-4 space-y-1 bg-gray-50/50">
        {comments.map((comment, index) => {
           const isOrganizerMsg = comment.userId === organizerId;
           // Check if previous message was from same sender to group bubbles
           const prevMsg = comments[index - 1];
           const isSameSender = prevMsg && prevMsg.userId === comment.userId;

           return (
              <div key={comment.id} className={`flex ${isOrganizerMsg ? 'justify-end' : 'justify-start'} ${isSameSender ? 'mt-1' : 'mt-3'}`}>
                 <div className={`max-w-[85%] px-3.5 py-2 text-sm shadow-sm leading-relaxed whitespace-pre-wrap ${
                    isOrganizerMsg 
                       ? 'bg-brand-500 text-white rounded-2xl rounded-tr-sm' 
                       : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-sm'
                 }`}>
                    {comment.content}
                 </div>
              </div>
           )
        })}
      </div>

      {/* Reply Area */}
      {canReply && (
         <div className="p-2 border-t border-gray-200 bg-white flex items-center space-x-2">
            <input 
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="回复..." 
              className="flex-1 bg-gray-50 text-xs rounded-full px-3 py-2 outline-none focus:ring-1 focus:ring-brand-500"
            />
            <button 
              onClick={handleSend}
              disabled={!replyText.trim()}
              className={`p-1.5 rounded-full ${replyText.trim() ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-400'}`}
            >
               <Send size={14} />
            </button>
         </div>
      )}
    </div>
  );
};

// --- Social Comment Component (Moments/Instagram Style) ---

export const SocialCommentRow: React.FC<{ 
  comment: Comment,
  replyToName?: string, 
  onClick: () => void 
}> = ({ comment, replyToName, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="mb-1 text-sm leading-relaxed cursor-pointer active:bg-gray-200/50 rounded-sm px-1 -mx-1"
    >
       <span className="font-bold text-blue-900">
         {comment.userName}
       </span>
       {replyToName && (
         <>
           <span className="text-gray-500 mx-1">回复</span>
           <span className="font-bold text-blue-900">
             {replyToName}
           </span>
         </>
       )}
       <span className="text-gray-800">
         ：{comment.content}
       </span>
    </div>
  );
};
