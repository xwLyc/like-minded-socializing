
import { UserProfile, Comment, TripEvent, Post, ChatSession, ChatMessage, HistoryChampion } from './types';

export const ACTIVITY_TYPES = ['旅行', '棋牌', '运动', '读书', '聚餐', '其他'];
export const AGE_RANGES = ['不限', '50后', '60后', '70后', '退休人员', '中青年'];
export const GENDER_REQS = ['不限', '仅限女性', '仅限男性', '男女比例1:1'];

export const MOCK_USER: UserProfile = {
  id: 'u1',
  name: '老张',
  gender: 'male',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
};

// Simplified mock helper
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
    userId: 'o3', // Organizer (Chen Jie) replying to o2 (Li Ge)
    userName: '陈姐', 
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cathy', 
    content: '下午两点准时开始。', 
    timestamp: '8分钟前',
    replyToUserId: 'o2'
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
    content: '门口就有免费停车位，车位很足，放心来。', 
    timestamp: '3分钟前',
    replyToUserId: 'o2'
  },
  { 
    id: 'c2', 
    userId: 'u88', 
    userName: '赵四', 
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zack', 
    content: '需要带什么装备吗？', 
    timestamp: '1小时前' 
  },
].slice(0, count === 1 ? 1 : count === 2 ? 2 : 5); // Simple slicer for demo

export const MOCK_EVENTS: TripEvent[] = [
  {
    id: 'e1',
    title: '周三下午麻将局，三缺一！',
    description: '小区老年活动中心，带彩头的别来，纯娱乐。最好是打得快的，我们都比较熟练。',
    destination: '烟台·阳光花园活动中心',
    date: '本周三 14:00',
    tags: ['棋牌'],
    ageRange: '退休人员',
    genderReq: '不限',
    organizer: { id: 'o1', name: '王姨', gender: 'female', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
    capacity: 4,
    enrolled: 3,
    status: 'recruiting',
    comments: [], // Clear for clean slate
    applicants: []
  },
  {
    id: 'e2',
    title: '周末百望山爬山，锻炼身体',
    description: '不用走太远，带点水果干粮，中午野餐。欢迎喜欢摄影的朋友，我也带相机。',
    destination: '北京·百望山森林公园',
    date: '周六 09:00',
    tags: ['运动'],
    ageRange: '不限',
    genderReq: '不限',
    organizer: { id: 'o3', name: '陈姐', gender: 'female', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cathy' },
    capacity: 6,
    enrolled: 6,
    status: 'full',
    comments: mockComments(5), // Use the threaded comments example
    applicants: [{ userId: 'u1', userName: '老张', userAvatar: MOCK_USER.avatar, userGender: 'male', status: 'approved', applyTime: '昨天', intro: '我体力还行，经常爬香山。' }],
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
      { userId: 'u88', userName: '赵四', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zack', userGender: 'male', status: 'pending', applyTime: '10分钟前', intro: '老钓友了，装备齐全，性格随和。' },
      { userId: 'u89', userName: '刘能', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liu', userGender: 'male', status: 'approved', applyTime: '1小时前', intro: '没怎么钓过，想去学学，负责拎包。' }
    ]
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: { id: 'm1', name: '快乐外婆', gender: 'female', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Granny' },
    images: [
      'https://images.unsplash.com/photo-1527668752968-14a708d18486?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&auto=format&fit=crop&q=60'
    ],
    content: '上次跟王老师他们去的苏州太好了！虽然下雨，但是喝茶听曲儿别有一番风味。大家看看这环境，是不是很有感觉？',
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
    images: ['https://images.unsplash.com/photo-1623696144896-1c7c91728131?w=800&auto=format&fit=crop&q=60'],
    content: '今天的麻将局打得太开心了，虽然没赢，但是认识了几个新邻居。下次争取自摸！',
    likes: 89,
    comments: 5,
    postComments: [],
    relatedEventTitle: '周五社区麻将',
    relatedEventId: 'e98',
    isChallengeActive: true
  },
  {
    id: 'p3',
    author: { id: 'm3', name: '刘摄', gender: 'male', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
    images: [
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=60'
    ],
    content: '密云水库的早晨，空气太好了。感谢队长组织，这次拍到了满意的日出。',
    likes: 42,
    comments: 8,
    postComments: [],
    relatedEventTitle: '密云水库摄影团',
    relatedEventId: 'e6',
    isChallengeActive: true
  },
  {
    id: 'p4',
    author: { id: 'm4', name: '赵姐', gender: 'female', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara' },
    images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop&q=60'],
    content: '爬完山大家一起聚餐，AA制很划算，味道也不错。推荐这家的鱼头泡饼。',
    likes: 35,
    comments: 2,
    postComments: [],
    relatedEventTitle: '百望山登山小队',
    relatedEventId: 'e2',
    isChallengeActive: true
  },
  {
    id: 'p5',
    author: { id: 'm5', name: '王叔', gender: 'male', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
    images: ['https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=60'],
    content: '老哥几个好久没聚了，今天喝得有点多，哈哈。',
    likes: 12,
    comments: 0,
    postComments: [],
    relatedEventTitle: '老战友聚会',
    relatedEventId: 'e100',
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
  { id: 'm2', senderId: 'o3', senderName: '陈姐', senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cathy', content: '大家都记得带水啊！', time: '10:30', isMe: false },
];

export const MOCK_HISTORY_CHAMPIONS: HistoryChampion[] = [
  {
     id: 'h1',
     month: '2023年9月',
     winner: { id: 'w1', name: '摄影小刘', gender: 'male', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
     likes: 128,
     postImages: ['https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop&q=60'],
     postContent: '密云水库的日出，真的太美了！感谢大家的支持！'
  },
  {
     id: 'h2',
     month: '2023年8月',
     winner: { id: 'w2', name: '赵阿姨', gender: 'female', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara' },
     likes: 105,
     postImages: ['https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&auto=format&fit=crop&q=60'],
     postContent: '带着孙子去草原天路，一路欢声笑语。'
  }
];
