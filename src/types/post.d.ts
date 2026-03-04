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
  commentContent?: string; // /me/comments 에서만 반환
  commentCreatedAt?: string; // /me/comments 에서만 반환
  commentId?: number; // /me/comments 에서만 반환
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
  title: string;
  viewCount: number;
  id: number | undefined;
};

export type postProps = {
  post: Post;
  selectedCategory: string;
};

export interface commentProps {
  comment: Comment;
  postId: number;
  onSuccess?: () => void;
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
  userId: number;
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
  title: string;
  content: string;
  isAnonymous: boolean;
  category: string;
  tag: string | null;
  files: ServerFile[];
};

export type ServerFile = {
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
};

export type Comment = {
  commentId: number;
  userId: number;
  userName: string;
  userProfileImageUrl: string;
  content: string;
  depth: number;
  replyCount: number;
  createdAt: string;
  isAnonymous: boolean;
  deleted: boolean;
};

export type ServerComment = {
  content: string;
  isAnonymous: boolean;
  parentId: number | null;
};

export type ServerPage = {
  "page": number,
  "size": number,
  "sort": string[]
}