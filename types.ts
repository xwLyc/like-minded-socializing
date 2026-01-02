
export interface UserProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  avatar: string;
  // Added isPhoneVerified property to support display of verification badges in UI components
  isPhoneVerified?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  replyToUserId?: string; // ID of the user being replied to (links organizer msg to inquirer)
}

export interface Applicant {
  userId: string;
  userName: string;
  userAvatar: string;
  userGender: 'male' | 'female';
  status: 'pending' | 'approved' | 'rejected';
  applyTime: string;
  intro: string;
}

export interface TripEvent {
  id: string;
  title: string;
  description: string;
  destination: string;
  date: string;
  tags: string[];
  ageRange: string;
  genderReq: string;
  organizer: UserProfile;
  capacity: number;
  enrolled: number;
  status: 'recruiting' | 'full' | 'completed';
  comments: Comment[]; 
  applicants: Applicant[]; 
  groupChatId?: string;
}

export interface Post {
  id: string;
  author: UserProfile;
  images: string[];
  content: string;
  likes: number;
  comments: number;
  postComments?: Comment[];
  relatedEventTitle?: string;
  relatedEventId?: string;
  isChallengeActive?: boolean;
}

export interface Notification {
  id: string;
  type: 'comment' | 'reply' | 'application_received' | 'application_result' | 'team_interaction';
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  relatedEventId?: string;
  relatedPostId?: string;
  fromUser?: {
    name: string;
    avatar: string;
  };
}

export interface ChatSession {
  id: string;
  eventId: string;
  title: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  time: string;
  isMe: boolean;
}

export interface HistoryChampion {
  id: string;
  month: string;
  winner: UserProfile;
  likes: number;
  postImages: string[];
  postContent: string;
}
