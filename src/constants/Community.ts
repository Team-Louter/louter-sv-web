import { BsTypeH1, BsTypeH2, BsTypeBold, BsSlash } from "react-icons/bs";
import { FaListOl, FaListUl, FaCode, FaComment, FaRegImage } from "react-icons/fa";
import { MdHorizontalRule } from "react-icons/md";
import { GoLink, GoFileDirectoryFill } from "react-icons/go";
import type { Markdown } from "@/types/community";

export const CATEGORIES: Record<string, string> = {
    "전체": "ALL",
    "공지사항": "NOTICE",
    "자유게시판": "FREE",
    "정보 공유": "INFORMATION",
    "로드맵": "ROADMAP",
    "대회": "CONTEST",
    "Q&A": "QNA",
};

// 역방향 객체 생성
export const CATEGORY_REVERSED = Object.fromEntries(
    Object.entries(CATEGORIES).map(([label, value]) => [value, label])
);
  

export const CATEGORY_TAGS: Record<string, string[]> = {
    "공지사항": [],
    "자유게시판": [],
    "정보 공유": ["백엔드", "프론트엔드", "디자인", "AI", "기타", "학교 생활"],
    "로드맵": ["백엔드", "프론트엔드", "기타 전공"],
    "대회": ["해커톤", "아이디어 공모전", "알고리즘", "AI / 데이터 분석", "청소년 특화 대회", "기타 대회 정보", "같이 나가실 분?"],
    "Q&A": ["백엔드 질문", "프론트엔드 질문", "디자인 질문", "기획 질문", "기타"],
};

export const MARKDOWN_TOOLS: Markdown[] = [
    { label: "제목 1",   icon: BsTypeH1,           before: "# ",        after: "",        block: true  },
    { label: "제목 2",   icon: BsTypeH2,           before: "## ",       after: "",        block: true  },
    { label: "굵게",     icon: BsTypeBold,          before: "**",        after: "**",      block: false },
    { label: "기울이기", icon: BsSlash, size: 25,   before: "*",         after: "*",       block: false },
    { label: "리스트",   icon: FaListOl,            before: "1. ",       after: "",        block: true  },
    { label: "리스트",   icon: FaListUl,            before: "- ",        after: "",        block: true  },
    { label: "코드블록", icon: FaCode,              before: "```\n",     after: "\n```",   block: false },
    { label: "인용",     icon: FaComment,           before: "> ",        after: "",        block: true  },
    { label: "구분선",   icon: MdHorizontalRule,    before: "\n---\n",   after: "",        block: false },
    { label: "링크",     icon: GoLink,              before: "[",         after: "](url)",  block: false },
    { label: "사진",     icon: FaRegImage,          before: "![](",      after: ")",       block: false },
    { label: "파일",     icon: GoFileDirectoryFill, before: "[파일명](", after: ")",       block: false },
];