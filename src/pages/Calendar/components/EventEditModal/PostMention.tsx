import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import * as S from "./PostMention.styled";
import * as MS from "./EventEditModal.styled";
import { getAllPost } from "@/api/Post";
import type { Post } from "@/types/post";
import { CATEGORY_REVERSED } from "@/constants/Community";

interface PostMentionFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showLetterCount?: number;
}

export default function PostMentionField({
  label,
  value,
  onChange,
  placeholder,
  showLetterCount,
}: PostMentionFieldProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mentionQuery, setMentionQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mentionStartRef = useRef<number | null>(null);

  // 게시글 목록 로드
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getAllPost();
        setPosts(data.content || []);
      } catch (err) {
        console.error("게시글 목록 로드 실패", err);
      }
    };
    loadPosts();
  }, []);

  // 멘션 쿼리로 게시글 필터링
  const filteredPosts = useMemo(() => {
    if (!showDropdown) return [];

    const query = mentionQuery.toLowerCase();
    return posts
      .filter((post) => {
        const titleMatch = post.postTitle.toLowerCase().includes(query);
        const idMatch = String(post.postId).includes(query);
        return titleMatch || idMatch;
      })
      .slice(0, 10);
  }, [mentionQuery, posts, showDropdown]);

  // # 입력 감지
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (showLetterCount && newValue.length > showLetterCount) return;

    const cursorPos = e.target.selectionStart;
    onChange(newValue);

    // 커서 앞에서 # 패턴 찾기
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const hashMatch = textBeforeCursor.match(/#([^\s#]*)$/);

    if (hashMatch) {
      mentionStartRef.current = cursorPos - hashMatch[0].length;
      setMentionQuery(hashMatch[1]);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
      mentionStartRef.current = null;
    }
  };

  // 게시글 선택
  const selectPost = useCallback(
    (post: Post) => {
      if (mentionStartRef.current === null) return;

      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = mentionStartRef.current;
      const cursorPos = textarea.selectionStart;
      const before = value.slice(0, start);
      const after = value.slice(cursorPos);
      const mention = `#${post.postId} `;

      const newValue = before + mention + after;
      if (showLetterCount && newValue.length > showLetterCount) return;

      onChange(newValue);
      setShowDropdown(false);
      mentionStartRef.current = null;

      // 커서 위치 복원
      requestAnimationFrame(() => {
        const newPos = start + mention.length;
        textarea.focus();
        textarea.setSelectionRange(newPos, newPos);
      });
    },
    [value, onChange, showLetterCount]
  );

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showDropdown || filteredPosts.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < filteredPosts.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredPosts.length - 1
      );
    } else if (e.key === "Enter" && showDropdown) {
      e.preventDefault();
      selectPost(filteredPosts[activeIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 활성 아이템 스크롤
  useEffect(() => {
    if (!dropdownRef.current) return;
    const activeItem = dropdownRef.current.children[activeIndex] as HTMLElement;
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  return (
    <MS.ForRow>
      <MS.Name>{label}</MS.Name>
      <MS.ForColumn>
        <S.MentionWrapper>
          {showDropdown && (
            <S.Dropdown ref={dropdownRef}>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <S.DropdownItem
                    key={post.postId}
                    $isActive={index === activeIndex}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectPost(post);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <S.PostId>#{post.postId}</S.PostId>
                    <S.PostTitle>{post.postTitle}</S.PostTitle>
                    <S.PostCategory>
                      {CATEGORY_REVERSED[post.category] || post.category}
                    </S.PostCategory>
                  </S.DropdownItem>
                ))
              ) : (
                <S.EmptyMessage>게시글을 찾을 수 없습니다</S.EmptyMessage>
              )}
            </S.Dropdown>
          )}
          <S.TextArea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
        </S.MentionWrapper>
        {showLetterCount && (
          <MS.LetterCount>
            {value.length}/{showLetterCount}
          </MS.LetterCount>
        )}
      </MS.ForColumn>
    </MS.ForRow>
  );
}
