
import React from 'react';
import { MapPin, Calendar, Users, Camera, MessageSquare, Heart, CheckCircle, User, ArrowLeft } from 'lucide-react';
import { TripEvent, Post, Comment } from './types';

export const TabBar = ({ current, onChange, unreadCount }: { current: string, onChange: (v: string) => void, unreadCount: number }) => {
  const tabs = [
    { id: 'square', label: '广场', icon: MapPin },
    { id: 'gallery', label: '精彩', icon: Camera },
    { id: 'messages', label: '消息', icon: MessageSquare },
    { id: 'profile', label: '我的', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 pb-safe pt-2 px-6 flex justify-between items-center z-[100] h-20 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] shrink-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = current === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center space-y-1 transition-all relative ${isActive ? 'text-brand-600 scale-110' : 'text-gray-400'}`}
          >
            <div className="relative">
              <Icon size={24} strokeWidth={isActive ? 3 : 2} />
              {tab.id === 'messages' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[10px] text-white flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-black">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const AvatarWithGender: React.FC<{ user: { avatar: string, name: string, gender: 'male' | 'female' }, size?: string }> = ({ user, size = "w-10 h-10" }) => (
  <div className={`relative ${size} shrink-0`}>
    <img src={user.avatar} className="w-full h-full rounded-full bg-gray-100 object-cover border-2 border-white shadow-sm" />
    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-black ${user.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'}`}>
      {user.gender === 'male' ? '♂' : '♀'}
    </div>
  </div>
);

export const EventCard: React.FC<{ event: TripEvent, onClick: () => void }> = ({ event, onClick }) => (
  <div onClick={onClick} className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-50 mb-6 active:scale-[0.98] transition-all cursor-pointer group">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-black text-gray-900 leading-tight flex-1 group-hover:text-brand-600 transition-colors">{event.title}</h3>
      {event.status === 'full' && <span className="text-[10px] bg-red-50 text-red-500 px-2.5 py-1 rounded-lg font-black ml-2 shrink-0 border border-red-100">满员</span>}
    </div>
    
    <div className="flex items-center text-gray-400 text-xs mb-6 space-x-4 font-bold">
      <div className="flex items-center"><Calendar size={14} className="mr-1.5 text-brand-500" />{event.date}</div>
      <div className="flex items-center"><MapPin size={14} className="mr-1.5 text-brand-500" />{event.destination}</div>
    </div>

    <div className="flex justify-between items-center pt-5 border-t border-gray-50">
      <div className="flex items-center space-x-2">
        <AvatarWithGender user={event.organizer} size="w-8 h-8" />
        <span className="text-sm font-bold text-gray-700">{event.organizer.name}</span>
      </div>
      <div className="flex items-center text-brand-600 text-sm font-black">
         <Users size={16} className="mr-1.5" />
         {event.enrolled}/{event.capacity}
      </div>
    </div>
  </div>
);

export const ConsultationThread = ({ 
  comments, 
  organizerId,
  onReply 
}: { 
  comments: Comment[], 
  organizerId: string,
  onReply?: (target: { id: string, name: string }) => void 
}) => {
  const groupMap = new Map<string, { user: { name: string, avatar: string }, messages: Comment[] }>();

  comments.forEach(c => {
    let threadOwnerId = c.userId === organizerId ? c.replyToUserId : c.userId;
    if (!threadOwnerId) return;

    if (!groupMap.has(threadOwnerId)) {
      groupMap.set(threadOwnerId, {
        user: { 
          name: c.userId === organizerId ? (c.replyToUserName || '咨询者') : c.userName, 
          avatar: c.userId === organizerId ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder' : c.userAvatar 
        },
        messages: []
      });
    }
    groupMap.get(threadOwnerId)!.messages.push(c);
  });

  const threads = Array.from(groupMap.entries());

  return (
    <div className="space-y-6">
      {threads.map(([ownerId, data]) => (
        <div 
          key={ownerId} 
          className={`flex space-x-3 items-start p-2 rounded-2xl transition-colors ${onReply ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
          onClick={() => onReply && onReply({ id: ownerId, name: data.user.name })}
        >
          <img src={data.user.avatar} className="w-10 h-10 rounded-full bg-gray-100 border border-gray-100 shrink-0" />
          <div className="flex-1 min-w-0">
             <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-black text-gray-400">{data.user.name}</span>
                {onReply && <span className="text-[9px] text-brand-600 font-bold bg-brand-50 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100">回复</span>}
             </div>
             <div className="space-y-2">
                {data.messages.map(msg => {
                  const isOrganizer = msg.userId === organizerId;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isOrganizer ? 'items-end' : 'items-start'}`}>
                       <div className={`text-sm font-bold leading-relaxed break-all ${isOrganizer ? 'text-brand-600 text-right' : 'text-gray-700'}`}>
                          {isOrganizer ? (
                             <span className="flex items-start">
                                <span className="shrink-0 mr-1">[回复]:</span>
                                <span>{msg.content}</span>
                             </span>
                          ) : msg.content}
                       </div>
                       <span className="text-[8px] text-gray-300 mt-0.5 font-bold">{msg.timestamp}</span>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
      ))}
      {comments.length === 0 && (
        <div className="text-center py-10 text-gray-300 text-xs font-bold italic">
           暂无咨询留言
        </div>
      )}
    </div>
  );
};

export const GalleryCard: React.FC<{ post: Post, onClick: () => void }> = ({ post, onClick }) => (
  <div onClick={onClick} className="bg-white mb-4 overflow-hidden border-b border-gray-100 last:border-0 cursor-pointer active:opacity-90 transition-opacity">
    <div className="p-4 flex items-center space-x-3">
      <AvatarWithGender user={post.author} size="w-8 h-8" />
      <span className="font-bold text-sm text-gray-900">{post.author.name}</span>
    </div>
    <div className="aspect-square bg-gray-100">
      <img src={post.images[0]} className="w-full h-full object-cover" />
    </div>
    <div className="p-4">
      <div className="flex items-center space-x-4 mb-2">
        <div className="flex items-center space-x-1.5 text-gray-600">
          <Heart size={20} />
          <span className="text-xs font-medium">{post.likes}</span>
        </div>
        <div className="flex items-center space-x-1.5 text-gray-600">
          <MessageSquare size={20} />
          <span className="text-xs font-medium">{post.comments}</span>
        </div>
      </div>
      <p className="text-sm text-gray-800 line-clamp-2 leading-relaxed font-medium">{post.content}</p>
      {post.relatedEventTitle && (
        <div className="mt-3 flex items-center text-[10px] text-brand-600 font-bold bg-brand-50 w-fit px-2 py-0.5 rounded">
          # {post.relatedEventTitle}
        </div>
      )}
    </div>
  </div>
);

export const FloatingActionButton = ({ onClick, icon: Icon, label }: { onClick: () => void, icon: any, label: string }) => (
  <button 
    onClick={onClick}
    className="fixed bottom-24 right-6 bg-brand-600 text-white flex items-center space-x-2 px-6 py-3 rounded-2xl shadow-xl shadow-brand-200 active:scale-95 transition-all z-40 font-black"
  >
    <Icon size={20} strokeWidth={3} />
    <span>{label}</span>
  </button>
);

export const SocialCommentRow = ({ comment, replyToName, onClick }: { comment: any, replyToName?: string, onClick?: () => void }) => (
  <div className="py-1 text-sm leading-relaxed" onClick={onClick}>
     <span className="font-bold text-blue-600">{comment.userName}</span>
     {replyToName && (
       <>
         <span className="mx-1 text-gray-400">回复</span>
         <span className="font-bold text-blue-600">{replyToName}</span>
       </>
     )}
     <span className="text-gray-900 font-medium">：{comment.content}</span>
  </div>
);
