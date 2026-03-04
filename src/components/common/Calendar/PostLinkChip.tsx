import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPostDetail } from '@/api/Post';
import type { Post } from '@/types/post';
import { CATEGORY_REVERSED } from '@/constants/Community';
import { HiOutlineDocumentText } from 'react-icons/hi2';
import styled from 'styled-components';
import * as token from '@/styles/values/token';

// --- Styled Components ---

const ChipWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${token.colors.background.lightGray};
  border: 1px solid ${token.colors.line.light};
  border-radius: 6px;
  padding: 3px 10px;
  cursor: pointer;
  transition: background 0.15s;
  vertical-align: middle;
  margin: 0 2px;

  &:hover {
    background: ${token.colors.accent.assistive4};
    border-color: ${token.colors.accent.secondary3};
  }
`

const ChipIcon = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${token.colors.text.gold};
  flex-shrink: 0;
`

const ChipTitle = styled.span`
  ${token.typography('caption', 'lg', 'semibold')};
  color: ${token.colors.text.strong};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
`

const ChipCategory = styled.span`
  ${token.typography('caption', 'md', 'medium')};
  color: ${token.colors.text.neutral};
  flex-shrink: 0;
`

const ChipLoading = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: ${token.colors.background.lightGray};
  border: 1px solid ${token.colors.line.light};
  border-radius: 6px;
  padding: 3px 10px;
  vertical-align: middle;
  margin: 0 2px;
  ${token.typography('caption', 'lg', 'medium')};
  color: ${token.colors.text.disabled};
`

// --- PostLinkChip Component ---

interface PostLinkChipProps {
  postId: string;
}

export default function PostLinkChip({ postId }: PostLinkChipProps) {
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostDetail(Number(postId));
        setPost(data);
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/community/${postId}`);
  };

  if (loading) {
    return <ChipLoading>불러오는 중...</ChipLoading>;
  }

  if (!post) {
    return <ChipLoading>삭제된 게시글</ChipLoading>;
  }

  return (
    <ChipWrapper onClick={handleClick}>
      <ChipIcon><HiOutlineDocumentText size={15} /></ChipIcon>
      <ChipTitle>{post.postTitle}</ChipTitle>
      <ChipCategory>{CATEGORY_REVERSED[post.category] || post.category}</ChipCategory>
    </ChipWrapper>
  );
}
