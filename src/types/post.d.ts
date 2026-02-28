// 메인 타입
// 게시글 하나 타입
export interface MainPost {
  commentCount: number;
  createdAt: string;
  likeCount: number;
  postCategory: string;
  postId: number;
  postTitle: string;
  viewers: number;
}

// 정렬 타입
export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

// 페이지 정보
export interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: Sort;
  unpaged: boolean;
}

// 전체 응답 타입
export interface MyPost {
  content: MainPost[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: Sort;
  totalElements: number;
  totalPages: number;
}

export interface PostFile {
  fileId: number;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface HotPost {
  postId: number;
  userName: string;
  userProfileImageUrl: string;
  postTitle: string;
  postContent: string;
  category: string;
  createdAt: string;
  isAnonymous: boolean;
  viewers: number;
  likeCount: number;
  commentCount: number;
  isHearted: boolean;
  pinned: boolean;
  tag: string;
  files: PostFile[];
}

export type mainProps = {
  title: string,
  viewCount: number,
  id: number|undefined
}

export type postProps = {
  post: Post,
  selectedCategory: string
}

// 더미 타입
export type dPost = {
  id: number;
  category: string;
  tag: string;
  title: string;
  content: string;
  views: number;
  likes: number;
  comments: number;
  author: string;
  createdAt: string;
  isPinned: boolean;
  isHearted: boolean;
}

export interface Comment {
  id: number;
  postId: number;
  author: string; 
  content: string;
  createdAt: string;
}

// 게시글 타입
export type Post = {
  postId: number;
  userName: string;
  userProfileImageUrl: string;
  postTitle: string;
  postContent: string;
  category: string;
  createdAt: string;
  isAnonymous: boolean;
  viewers: number;
  likeCount: number;
  commentCount: number;
  isHearted: boolean;
  pinned: boolean;
  tag: string;
  files: PostFile[];
};

export type PostList = {
  totalElements: number;
  totalPages: number;
  pageable: Pageable;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: Post[];
  number: number;
  sort: Sort;
  empty: boolean;
};

export type ServerPost = {
  "title": string,
  "content": string,
  "isAnonymous": true,
  "category": string,
  "tag": string,
  "files": PostFile[]
}