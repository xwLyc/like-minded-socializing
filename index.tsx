
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Zap } from 'lucide-react';
import { UserProfile, TripEvent, Post, ChatSession, Notification } from './types';
import { MOCK_USER, MOCK_EVENTS, MOCK_POSTS, MOCK_CHATS } from './mockData';
import { TabBar } from './components';
import { CreateView, SquareView } from './views/EventViews';
import { EventDetailView } from './views/EventDetailView';
import { GalleryView } from './views/GalleryView';
import { LeaderboardView } from './views/LeaderboardView';
import { PostDetailView } from './views/PostDetailView'; // New Import
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
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Selection State
  const [selectedEvent, setSelectedEvent] = useState<TripEvent | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null); // New State
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
        images: [postData.image], // Mock single image for now
        content: postData.content,
        likes: 0,
        comments: 0,
        relatedEventTitle: postData.eventTitle,
        relatedEventId: postData.eventId,
        isChallengeActive: true, 
     };
     setPosts([newPost, ...posts]);
     setShowCreatePost(false);
     alert("发布成功！您的免单挑战已开启，快去邀请好友点赞吧！");
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const simulateIncomingNotification = () => {
    const types: Notification['type'][] = ['comment', 'application_received', 'team_interaction'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    let title = '';
    let content = '';

    if (randomType === 'comment') {
       title = '收到新留言';
       content = '“请问这个活动需要自己带水吗？”';
    } else if (randomType === 'application_received') {
       title = '收到新报名申请';
       content = '“用户小王申请加入您的活动”';
    } else {
       title = '队友互动';
       content = '您的队友回复了您所在小队的精彩瞬间，快去围观！';
    }
    
    const newNote: Notification = {
      id: Date.now().toString(),
      type: randomType,
      title: title,
      content: content,
      time: '刚刚',
      isRead: false,
      relatedEventId: 'e6', 
      fromUser: {
         name: randomType === 'comment' ? '小李' : '小王',
         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo'
      }
    };
    
    setNotifications(prev => [newNote, ...prev]);
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
       } else {
          alert("活动似乎已结束或不存在");
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
           requirePhoneBinding={() => {}} // No-op as functionality removed
           user={user}
           onUpdateEvent={handleUpdateEvent}
           onCreateChat={handleCreateChat}
        />
      </div>
    );
  }

  // New Post Detail Overlay
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

  if (showLeaderboard) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-gray-100 relative shadow-2xl overflow-hidden">
        <LeaderboardView 
           currentMonthPosts={posts} 
           onBack={() => setShowLeaderboard(false)}
           onPostClick={(post) => {
              setSelectedPost(post);
           }}
        />
      </div>
    );
  }

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
             onBindPhone={() => {}} // No-op
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
    
      <button 
        onClick={simulateIncomingNotification}
        className="fixed bottom-24 left-4 bg-gray-800/80 text-white p-3 rounded-full shadow-lg z-50 hover:bg-gray-900 transition-colors"
        title="模拟收到消息"
      >
        <Zap size={20} />
      </button>

    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
