import { useNavigate } from 'react-router-dom';
import { createPostInfo, editPostInfo } from '@/api/Post';
import type { Post, ServerFile } from '@/types/post';
import { CATEGORY_TAGS } from '@/constants/Community';

interface UsePostEditorParams {
  editPost?: Post;
  title: string;
  content: string;
  isAnonymous: boolean;
  selectedCategory: string;
  selectedTag: string;
  attachedFiles: ServerFile[];
}

export const usePostEditor = ({
  editPost, title, content, isAnonymous, selectedCategory, selectedTag, attachedFiles,
}: UsePostEditorParams) => {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const usedFiles = attachedFiles.filter((file) => content.includes(file.fileUrl));
    const tag = selectedTag ? CATEGORY_TAGS[selectedCategory]?.[selectedTag] ?? null : null;

    try {
      if (editPost) {
        await editPostInfo(editPost.postId, { title, content, isAnonymous, category: selectedCategory, tag, files: usedFiles });
      } else {
        await createPostInfo({ title, content, isAnonymous, category: selectedCategory, tag, files: usedFiles });
      }
      navigate(-1);
    } catch (err) {
      console.error(editPost ? '수정 실패' : '생성 실패', err);
    }
  };

  return { handleSubmit };
};