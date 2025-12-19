
import { UserProfile, Comment, TripEvent, Post, ChatSession, ChatMessage, HistoryChampion, Notification } from './types';

export const ACTIVITY_TYPES = ['旅行', '棋牌', '运动', '读书', '聚餐', '其他'];
export const AGE_RANGES = ['不限', '50后', '60后', '70后', '退休人员', '中青年'];
export const GENDER_REQS = ['不限', '仅限女性', '仅限男性', '男女比例1:1'];

export const MOCK_USER: UserProfile = {
  id: 'u1',
  name: '老张',
  gender: 'male',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  ageGroup: '60后'
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'application_result',
    title: '申请通过',
    content: '陈姐已批准你加入“周末百望山爬山”活动，快去群聊打个招呼吧！',
    time: '2分钟前',
    isRead: false,
    relatedEventId: 'e2'
  },
  {
    id: 'n2',
    type: 'comment',
    title: '收到提问',
    content: '小李在你的“周末钓鱼局”中留言咨询：能蹭车吗？',
    time: '1小时前',
    isRead: false,
    relatedEventId: 'e6',
    fromUser: { name: '小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo' }
  },
  {
    id: 'n3',
    type: 'team_interaction',
    title: '群内新动态',
    content: '王姨在群聊中发了一张集合位置的图片，请注意查看。',
    time: '昨天',
    isRead: true,
    relatedEventId: 'e1'
  }
];

export const mockComments = (count: number): Comment[] => [
  { 
    id: 'c1', 
    userId: 'o2', 
    userName: '李哥', 
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack', 
    content: '请问具体几点集合？我们这边离得有点远。', 
    timestamp: '10分钟前',
  },
  { 
    id: 'c1_reply', 
    userId: 'o3', 
    userName: '陈姐', 
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cathy', 
    content: '下午两点准时开始。', 
    timestamp: '8分钟前',
    replyToUserId: 'o2',
    replyToUserName: '李哥'
  },
  { 
    id: 'c1_2', 
    userId: 'o2', 
    userName: '李哥', 
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack', 
    content: '另外，那边好停车吗？', 
    timestamp: '5分钟前',
  },
  { 
    id: 'c1_reply2', 
    userId: 'o3', 
    userName: '陈姐', 
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cathy', 
    content: '门口就有免费停车位，车位很足。', 
    timestamp: '3分钟前',
    replyToUserId: 'o2',
    replyToUserName: '李哥'
  },
].slice(0, count);

export const MOCK_EVENTS: TripEvent[] = [
  {
    id: 'e1',
    title: '周三下午麻将局，三缺一！',
    description: '小区老年活动中心，带彩头的别来，纯娱乐。',
    destination: '烟台·阳光花园活动中心',
    date: '本周三 14:00',
    tags: ['棋牌'],
    ageRange: '退休人员',
    genderReq: '不限',
    organizer: { id: 'o1', name: '王姨', gender: 'female', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
    capacity: 4,
    enrolled: 3,
    status: 'recruiting',
    comments: [],
    applicants: []
  },
  {
    id: 'e2',
    title: '周末百望山爬山，锻炼身体',
    description: '不用走太远，带点水果干粮，中午野餐。欢迎喜欢摄影的朋友。',
    destination: '北京·百望山森林公园',
    date: '周六 09:00',
    tags: ['运动'],
    ageRange: '不限',
    genderReq: '不限',
    organizer: { id: 'o3', name: '陈姐', gender: 'female', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cathy' },
    capacity: 6,
    enrolled: 6,
    status: 'full',
    comments: mockComments(4),
    applicants: [{ userId: 'u1', userName: '老张', userAvatar: MOCK_USER.avatar, userGender: 'male', status: 'approved', applyTime: '昨天', intro: '我体力还行。' }],
    groupChatId: 'chat_e2' 
  },
  {
    id: 'e6',
    title: '【发起人视角】周末钓鱼局',
    description: '我开车，去密云水库。现有2人，再找2个。费用AA。',
    destination: '北京·密云水库',
    date: '周六 05:00',
    tags: ['运动', '其他'],
    ageRange: '不限',
    genderReq: '限男性',
    organizer: { ...MOCK_USER },
    capacity: 4,
    enrolled: 2,
    status: 'recruiting',
    comments: [
      { id: 'c10', userId: 'u99', userName: '小李', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo', content: '能蹭车吗？我可以分摊油费。', timestamp: '5分钟前' },
    ],
    applicants: [
      { userId: 'u88', userName: '赵四', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zack', userGender: 'male', status: 'pending', applyTime: '10分钟前', intro: '老钓友了，装备齐全。' }
    ]
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: { id: 'm1', name: '快乐外婆', gender: 'female', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Granny' },
    images: ['https://images.unsplash.com/photo-1599595807325-309322da5412?w=800&q=80'],
    content: '上次跟王老师他们去的苏州太好了！评弹很有感觉。',
    likes: 156,
    comments: 12,
    postComments: [],
    relatedEventTitle: '苏州评弹文化之旅',
    relatedEventId: 'e99',
    isChallengeActive: true
  },
  {
    id: 'p2',
    author: { id: 'm2', name: '强哥', gender: 'male', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    images: ['https://images.unsplash.com/photo-1591189863430-ab87e120f312?w=800&q=80'],
    content: '今天的麻将局打得太开心了，认识了几个新邻居。',
    likes: 89,
    comments: 5,
    postComments: [],
    relatedEventTitle: '周五社区麻将',
    relatedEventId: 'e98',
    isChallengeActive: true
  }
];

export const MOCK_CHATS: ChatSession[] = [
  {
    id: 'chat_e2',
    eventId: 'e2',
    title: '周末百望山爬山小分队',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cathy',
    lastMessage: '陈姐: 大家都记得带水啊！',
    lastTime: '10:30',
    unread: 2
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 'm1', senderId: 'o3', senderName: '陈姐', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cathy', content: '欢迎大家加入！', time: '10:00', isMe: false },
];

export const MOCK_HISTORY_CHAMPIONS: HistoryChampion[] = [
  {
     id: 'h1',
     month: '2023年9月',
     winner: { id: 'w1', name: '摄影小刘', gender: 'male', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
     likes: 128,
     postImages: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'],
     postContent: '密云水库的日出，真的太美了！'
  }
];
