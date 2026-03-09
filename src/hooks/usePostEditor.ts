import { useNavigate } from 'react-router-dom';
import { createPostInfo, editPostInfo } from '@/api/Post';
import type { Post, ServerFile } from '@/types/post';
import { CATEGORY_TAGS } from '@/constants/Community';
import { toast } from '@/store/toastStore';

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
        toast.success('게시글이 수정되었습니다.');
      } else {
        await createPostInfo({ title, content, isAnonymous, category: selectedCategory, tag, files: usedFiles });
        toast.success('게시글이 게시되었습니다.');
      }
      navigate(-1);
    } catch (err) {
      toast.error(editPost ? '수정이 실패하였습니다.' : '생성이 실패하였습니다.');
    }
  };

  return { handleSubmit };
};