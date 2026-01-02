
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { UserProfile, TripEvent, Post, ChatSession, Notification } from './types';
import { MOCK_USER, MOCK_EVENTS, MOCK_POSTS, MOCK_CHATS } from './mockData';
import { TabBar } from './components';
import { CreateView, SquareView } from './views/EventViews';
import { EventDetailView } from './views/EventDetailView';
import { GalleryView } from './views/GalleryView';
import { LeaderboardView } from './views/LeaderboardView';
import { PostDetailView } from './views/PostDetailView';
import { MessagesTab, NotificationListView, ChatRoomView } from './views/MessagesView';
import { LoginView, ProfileView } from './views/UserViews';
import { CreatePostModal } from './modals';

const App = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentTab, setCurrentTab] = useState('square');
  
  // Data State
  const [events, setEvents] = useState<TripEvent[]>(MOCK_EVENTS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [chats, setChats] = useState<ChatSession[]>(MOCK_CHATS);
  
  // Pre-populate with all notification scenarios
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      type: 'comment',
      title: '收到新留言',
      content: '“请问钓鱼这个活动需要自己准备鱼竿吗？”',
      time: '10分钟前',
      isRead: false,
      relatedEventId: 'e6',
      fromUser: { name: '小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo' }
    },
    {
      id: 'n2',
      type: 'application_received',
      title: '收到报名申请',
      content: '“王大伯申请加入您的‘周三下午麻将局’”',
      time: '1小时前',
      isRead: false,
      relatedEventId: 'e1',
      fromUser: { name: '王大伯', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack' }
    },
    {
      id: 'n3',
      type: 'application_result',
      title: '申请结果通知',
      content: '“恭喜！您申请加入‘周末百望山爬山’已通过。”',
      time: '2小时前',
      isRead: true,
      relatedEventId: 'e2'
    },
    {
      id: 'n4',
      type: 'team_interaction',
      title: '队友互动',
      content: '“您的队友点赞了您的精彩瞬间，快去看看吧！”',
      time: '昨天',
      isRead: false,
      relatedPostId: 'p3'
    }
  ]);

  // Selection State
  const [selectedEvent, setSelectedEvent] = useState<TripEvent | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showNotificationList, setShowNotificationList] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('mock_user_v2');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = () => {
    const newUser = { ...MOCK_USER };
    setUser(newUser);
    localStorage.setItem('mock_user_v2', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mock_user_v2');
    setCurrentTab('square');
    setSelectedEvent(null);
    setSelectedPost(null);
    setActiveChatId(null);
  };

  const handleCreatePost = (postData: { eventId: string, eventTitle: string, content: string, image: string }) => {
     if (!user) return;
     const newPost: Post = {
        id: Date.now().toString(),
        author: user,
        images: [postData.image],
        content: postData.content,
        likes: 0,
        comments: 0,
        relatedEventTitle: postData.eventTitle,
        relatedEventId: postData.eventId,
        isChallengeActive: true, 
     };
     setPosts([newPost, ...posts]);
     setShowCreatePost(false);
     alert("发布成功！");
  };

  const handleUpdateEvent = (updatedEvent: TripEvent) => {
     setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
     if (selectedEvent && selectedEvent.id === updatedEvent.id) {
        setSelectedEvent(updatedEvent);
     }
  };

  const handleCreateChat = (event: TripEvent) => {
     const newChat: ChatSession = {
        id: `chat_${event.id}`,
        eventId: event.id,
        title: event.title,
        avatar: event.organizer.avatar,
        lastMessage: '群聊已创建，快来打招呼吧！',
        lastTime: '刚刚',
        unread: 0
     };
     setChats(prev => [newChat, ...prev]);
  };

  const handleNotificationClick = (note: Notification) => {
    setNotifications(prev => prev.map(n => n.id === note.id ? { ...n, isRead: true } : n));
    
    if (note.type === 'team_interaction') {
       setCurrentTab('gallery');
       setShowNotificationList(false);
    } else {
       const targetEvent = events.find(e => e.id === note.relatedEventId);
       if (targetEvent) {
          setSelectedEvent(targetEvent);
          setShowNotificationList(false);
       }
    }
  };

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  // --- Overlays ---

  if (activeChatId) {
     const chat = chats.find(c => c.id === activeChatId);
     if (chat) {
        return (
           <div className="max-w-md mx-auto min-h-screen bg-gray-100 relative shadow-2xl overflow-hidden">
              <ChatRoomView chat={chat} user={user} onBack={() => setActiveChatId(null)} />
           </div>
        )
     }
  }

  if (showNotificationList) {
     return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-100 relative shadow-2xl overflow-hidden">
           <NotificationListView 
              notifications={notifications} 
              onBack={() => setShowNotificationList(false)}
              onItemClick={handleNotificationClick}
           />
        </div>
     );
  }

  if (selectedEvent) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-100 relative shadow-2xl overflow-hidden">
        <EventDetailView 
           event={selectedEvent} 
           onBack={() => setSelectedEvent(null)} 
           requirePhoneBinding={() => {}} 
           user={user}
           onUpdateEvent={handleUpdateEvent}
           onCreateChat={handleCreateChat}
        />
      </div>
    );
  }

  if (selectedPost) {
     return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-100 relative shadow-2xl overflow-hidden">
           <PostDetailView 
              post={selectedPost}
              user={user}
              onBack={() => setSelectedPost(null)}
           />
        </div>
     )
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100 relative shadow-2xl overflow-hidden">
      
      <div className="h-full">
        {currentTab === 'square' && (
           <SquareView 
             events={events} 
             onEventClick={setSelectedEvent} 
             onCreateClick={() => setShowCreateEvent(true)}
           />
        )}
        {currentTab === 'gallery' && (
           <GalleryView 
             posts={posts} 
             onCreateClick={() => setShowCreatePost(true)} 
             onLeaderboardClick={() => setShowLeaderboard(true)}
             onPostClick={setSelectedPost}
           />
        )}
        {currentTab === 'messages' && (
           <MessagesTab 
              chats={chats}
              notifications={notifications}
              onNotificationClick={() => setShowNotificationList(true)}
              onChatClick={setActiveChatId}
           />
        )}
        {currentTab === 'profile' && (
           <ProfileView 
             user={user} 
             onLogout={handleLogout} 
             onBindPhone={() => {}} 
           />
        )}
      </div>

      <TabBar current={currentTab} onChange={setCurrentTab} unreadCount={unreadCount} />

      {showCreateEvent && (
         <CreateView 
           user={user} 
           onBack={() => setShowCreateEvent(false)} 
         />
      )}
      {showCreatePost && (
         <CreatePostModal 
            user={user}
            existingPosts={posts}
            allEvents={events} 
            onClose={() => setShowCreatePost(false)}
            onSubmit={handleCreatePost}
         />
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
