
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { UserProfile, TripEvent, Post, ChatSession, Notification } from './types';
import { MOCK_USER, MOCK_EVENTS, MOCK_POSTS, MOCK_CHATS, MOCK_NOTIFICATIONS } from './mockData';
import { TabBar } from './components';
import { SquareView, CreateView } from './views/EventViews';
import { EventDetailView } from './views/EventDetailView';
import { GalleryView } from './views/GalleryView';
import { LeaderboardView } from './views/LeaderboardView';
import { PostDetailView } from './views/PostDetailView';
import { MessagesTab, NotificationListView, ChatRoomView } from './views/MessagesView';
import { LoginView, ProfileView, EditProfileView } from './views/UserViews';
import { CreatePostModal } from './modals';

const App = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentTab, setCurrentTab] = useState('square');
  
  const [events, setEvents] = useState<TripEvent[]>(MOCK_EVENTS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [chats, setChats] = useState<ChatSession[]>(MOCK_CHATS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const [selectedEvent, setSelectedEvent] = useState<TripEvent | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showNotificationList, setShowNotificationList] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('travel_user_v3');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = () => {
    const defaultUser = { ...MOCK_USER };
    setUser(defaultUser);
    localStorage.setItem('travel_user_v3', JSON.stringify(defaultUser));
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('travel_user_v3', JSON.stringify(updatedUser));
  };

  if (!user) return <LoginView onLogin={handleLogin} />;

  const renderContent = () => {
    if (showEditProfile) {
       return <EditProfileView user={user} onBack={() => setShowEditProfile(false)} onSave={handleUpdateUser} />;
    }
    if (activeChatId) {
      const chat = chats.find(c => c.id === activeChatId);
      return chat ? <ChatRoomView chat={chat} user={user} onBack={() => setActiveChatId(null)} /> : null;
    }
    if (showNotificationList) {
      return <NotificationListView notifications={notifications} onBack={() => setShowNotificationList(false)} onItemClick={(note) => {
        setNotifications(notifications.map(n => n.id === note.id ? { ...n, isRead: true } : n));
        setShowNotificationList(false);
      }} />;
    }
    if (selectedEvent) {
      return <EventDetailView 
        event={selectedEvent} 
        user={user} 
        onBack={() => setSelectedEvent(null)}
        onUpdateEvent={(e: TripEvent) => {
          setEvents(events.map(ev => ev.id === e.id ? e : ev));
          setSelectedEvent(e);
        }}
        onCreateChat={(e: TripEvent) => {
          const newChat: ChatSession = { id: `chat_${e.id}`, eventId: e.id, title: e.title, avatar: e.organizer.avatar, lastMessage: '系统: 队伍已集结完毕！', lastTime: '刚刚', unread: 1 };
          setChats([newChat, ...chats]);
        }}
      />;
    }
    if (selectedPost) {
      return <PostDetailView post={selectedPost} user={user} onBack={() => setSelectedPost(null)} />;
    }
    if (showLeaderboard) {
      return <LeaderboardView currentMonthPosts={posts} onBack={() => setShowLeaderboard(false)} onPostClick={setSelectedPost} />;
    }
    if (showCreateEvent) {
      return <CreateView user={user} onBack={() => setShowCreateEvent(false)} />;
    }

    switch (currentTab) {
      case 'square': 
        return <SquareView events={events} onEventClick={setSelectedEvent} onCreateClick={() => setShowCreateEvent(true)} />;
      case 'gallery': 
        return (
           <>
              <GalleryView posts={posts} onPostClick={setSelectedPost} onLeaderboardClick={() => setShowLeaderboard(true)} onCreateClick={() => setShowCreatePost(true)} />
              {showCreatePost && (
                 <CreatePostModal 
                    user={user} 
                    allEvents={events} 
                    existingPosts={posts} 
                    onClose={() => setShowCreatePost(false)} 
                    onSubmit={(data) => {
                       const newPost: Post = {
                          id: `p_${Date.now()}`,
                          author: user,
                          images: [data.image],
                          content: data.content,
                          likes: 0,
                          comments: 0,
                          relatedEventTitle: data.eventTitle,
                          relatedEventId: data.eventId
                       };
                       setPosts([newPost, ...posts]);
                       setShowCreatePost(false);
                    }}
                 />
              )}
           </>
        );
      case 'messages': 
        return <MessagesTab chats={chats} notifications={notifications} onChatClick={setActiveChatId} onNotificationClick={() => setShowNotificationList(true)} />;
      case 'profile': 
        return <ProfileView user={user} onEditProfile={() => setShowEditProfile(true)} />;
      default: 
        return <SquareView events={events} onEventClick={setSelectedEvent} onCreateClick={() => setShowCreateEvent(true)} />;
    }
  };

  const totalUnread = chats.reduce((acc, c) => acc + c.unread, 0) + notifications.filter(n => !n.isRead).length;

  return (
    /* Changed class to className */
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] relative shadow-2xl overflow-hidden flex flex-col font-sans">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {renderContent()}
      </div>

      {!selectedEvent && !selectedPost && !activeChatId && !showNotificationList && !showLeaderboard && !showCreateEvent && !showEditProfile && (
        <TabBar 
          current={currentTab} 
          onChange={setCurrentTab} 
          unreadCount={totalUnread} 
        />
      )}
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
