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
  

export const CATEGORY_TAGS: Record<string, Record<string, string>> = {
    NOTICE: {},
    FREE: {},
    INFORMATION: {
      "백엔드": "INFO_BACKEND",
      "프론트엔드": "INFO_FRONTEND",
      "디자인": "INFO_DESIGN",
      "AI": "INFO_AI",
      "기타": "INFO_ETC",
      "학교 생활": "INFO_SCHOOL",
    },
    ROADMAP: {
      "백엔드": "ROADMAP_BACKEND",
      "프론트엔드": "ROADMAP_FRONTEND",
      "기타 전공": "ROADMAP_ETC",
    },
    CONTEST: {
      "해커톤": "HACKATHON",
      "아이디어 공모전": "IDEA_CONTEST",
      "알고리즘": "ALGORITHM",
      "AI / 데이터 분석": "AI_DATA",
      "청소년 특화 대회": "YOUTH_CONTEST",
      "기타 대회 정보": "CONTEST_ETC",
      "같이 나가실 분?": "RECRUITMENT",
    },
    QNA: {
      "백엔드 질문": "Q_BACKEND",
      "프론트엔드 질문": "Q_FRONTEND",
      "디자인 질문": "Q_DESIGN",
      "기획 질문": "Q_PLANNING",
      "기타": "Q_ETC",
    },
};

// 역방향 객체 생성
export const CATEGORY_TAGS_REVERSED: Record<string, Record<string, string>> = Object.fromEntries(
    Object.entries(CATEGORY_TAGS).map(([category, tags]) => [
        category,
        Object.fromEntries(Object.entries(tags).map(([label, value]) => [value, label]))
    ])
);

// 마크다운 관련 설정
export const MARKDOWN_TOOLS: Markdown[] = [
    { label: "제목 1",   icon: BsTypeH1,           before: "# ",        after: "",        block: true,  type: "default" },
    { label: "제목 2",   icon: BsTypeH2,            before: "## ",       after: "",        block: true,  type: "default" },
    { label: "굵게",     icon: BsTypeBold,          before: "**",        after: "**",      block: false, type: "default" },
    { label: "기울이기", icon: BsSlash, size: 25,   before: "*",         after: "*",       block: false, type: "default" },
    { label: "리스트",   icon: FaListOl,            before: "1. ",       after: "",        block: true,  type: "default" },
    { label: "리스트",   icon: FaListUl,            before: "- ",        after: "",        block: true,  type: "default" },
    { label: "코드블록", icon: FaCode,              before: "```\n",     after: "\n```",   block: false, type: "default" },
    { label: "인용",     icon: FaComment,           before: "> ",        after: "",        block: true,  type: "default" },
    { label: "구분선",   icon: MdHorizontalRule,    before: "\n---\n",   after: "",        block: false, type: "default" },
    { label: "링크",     icon: GoLink,              before: "[",         after: "](url)",  block: false, type: "default" },
    { label: "사진",     icon: FaRegImage,          before: "",          after: "",        block: false, type: "image"   },
    { label: "파일",     icon: GoFileDirectoryFill, before: "",          after: "",        block: false, type: "file"    },
];