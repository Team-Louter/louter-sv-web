import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './Profile.styled';
import { useAuthStore } from '@/store/authStore';
import { logout } from '@/api/Auth';
import { getUser, getMyPost, getCommentedPost, getLikedPost } from '@/api/User';
import { toast } from '@/store/toastStore';
import type { User } from '@/types/user';
import type { MainPost } from '@/types/post';
import { CATEGORY_REVERSED } from '@/constants/Community';
import { formatDateTime } from '@/utils/FormatDate';
import ViewIcon from '@/assets/Mypage/View.svg';
import GoodIcon from '@/assets/Mypage/Good.svg';
import ChatIcon from '@/assets/Mypage/Chat.svg';
import WithdrawModal from './components/WithdrawModal/WithdrawModal';

const TABS = ['내가 쓴 글', '댓글 단 글', '좋아요한 글'] as const;

export default function Profile() {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [posts, setPosts] = useState<MainPost[]>([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    getUser()
      .then(setUser)
      .catch(() => toast.error('사용자 정보를 불러오지 못했습니다.'));
  }, []);

  useEffect(() => {
    const fetchFn = [getMyPost, getCommentedPost, getLikedPost][activeTab];
    fetchFn()
      .then((data) => setPosts(data.content))
      .catch(() => setPosts([]));
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    } finally {
      clearAuth();
      toast.success('로그아웃 되었습니다.');
      navigate('/auth/signin');
    }
  };

  const handleWithdraw = () => {
    setShowWithdrawModal(true);
  };

  return (
    <S.PageWrapper>
      <S.Inner>
        {/* 페이지 제목 */}
        <S.PageTitle>마이페이지</S.PageTitle>

        {/* 단일 카드 */}
        <S.Card>
          {/* 상단: 프로필 + 통계 + 버튼 */}
          <S.CardTop>
            {/* 프로필 이미지 + 정보 */}
            <S.ProfileGroup>
              <S.ProfileImageWrapper>
                {user?.profileImageUrl ? (
                  <S.ProfileImage
                    src={user.profileImageUrl}
                    alt="프로필 이미지"
                  />
                ) : (
                  <S.ProfileImageFallback>
                    {user?.userName?.charAt(0) ?? '?'}
                  </S.ProfileImageFallback>
                )}
              </S.ProfileImageWrapper>
              <S.ProfileInfo>
                <S.ProfileName>{user?.userName ?? '-'}</S.ProfileName>
                <S.ProfileSubInfo>
                  {user
                    ? `${user.grade}학년 ${user.classRoom}반 ${user.number}번`
                    : '-'}
                </S.ProfileSubInfo>
                <S.EditButton
                  onClick={() => toast.error('아직 준비 중인 기능입니다.')}
                >
                  프로필 수정
                </S.EditButton>
              </S.ProfileInfo>
            </S.ProfileGroup>

            {/* 통계 */}
            <S.StatsGroup>
              <S.StatItem>
                <S.StatValue>{user?.postCount ?? 0}</S.StatValue>
                <S.StatLabel>작성한 글</S.StatLabel>
              </S.StatItem>
              <S.StatItem>
                <S.StatValue>{user?.commentCount ?? 0}</S.StatValue>
                <S.StatLabel>작성한 댓글</S.StatLabel>
              </S.StatItem>
              <S.StatItem>
                <S.StatValue>{user?.likedPostCount ?? 0}</S.StatValue>
                <S.StatLabel>좋아요한 글</S.StatLabel>
              </S.StatItem>
            </S.StatsGroup>

            {/* 로그아웃 / 회원 탈퇴 */}
            <S.ActionGroup>
              <S.ActionButton onClick={handleLogout}>로그아웃</S.ActionButton>
              <S.ActionButton $danger onClick={handleWithdraw}>
                회원 탈퇴
              </S.ActionButton>
            </S.ActionGroup>
          </S.CardTop>

          <S.Divider />

          {/* 이메일 / 받은 좋아요 */}
          <S.InfoSection>
            <S.InfoRow>
              <S.InfoLabel>이메일(Email)</S.InfoLabel>
              <S.InfoValue>{user?.userEmail ?? '-'}</S.InfoValue>
            </S.InfoRow>
            <S.InfoRow>
              <S.InfoLabel>받은 좋아요 개수</S.InfoLabel>
              <S.InfoValue $accent>
                {(user?.receivedLikeCount ?? 0).toLocaleString()}
              </S.InfoValue>
            </S.InfoRow>
          </S.InfoSection>

          {/* 탭 */}
          <S.TabBar>
            {TABS.map((tab, idx) => (
              <S.TabItem
                key={tab}
                $active={activeTab === idx}
                onClick={() => setActiveTab(idx)}
              >
                {tab}
                <S.TabIndicator $active={activeTab === idx} />
              </S.TabItem>
            ))}
          </S.TabBar>

          {/* 글 목록 */}
          <S.TabContent>
            {posts.length === 0 ? (
              <S.EmptyMessage>
                {activeTab === 0
                  ? '작성한 게시글이 없습니다'
                  : activeTab === 1
                    ? '작성한 댓글이 없습니다'
                    : '좋아요한 게시글이 없습니다'}
              </S.EmptyMessage>
            ) : (
              <S.PostList>
                {posts.map((post) => (
                  <S.PostItem
                    key={post.postId}
                    onClick={() => navigate(`/community/${post.postId}`)}
                  >
                    <S.PostLeft>
                      <S.CategoryBadge>
                        {CATEGORY_REVERSED[post.postCategory] ??
                          post.postCategory}
                      </S.CategoryBadge>
                      <div style={{ overflow: 'hidden' }}>
                        <S.PostTitle>{post.postTitle}</S.PostTitle>
                        {activeTab === 1 && post.commentContent && (
                          <S.CommentContent>
                            └ {post.commentContent}
                          </S.CommentContent>
                        )}
                      </div>
                    </S.PostLeft>
                    <S.PostMeta>
                      <S.MetaItem>
                        <img src={ViewIcon} alt="views" />
                        {post.viewers.toLocaleString()}
                      </S.MetaItem>
                      <S.MetaItem $red>
                        <img src={GoodIcon} alt="likes" />
                        {post.likeCount.toLocaleString()}
                      </S.MetaItem>
                      <S.MetaItem $yellow>
                        <img src={ChatIcon} alt="comments" />
                        {post.commentCount.toLocaleString()}
                      </S.MetaItem>
                      <S.MetaItem>
                        {formatDateTime(
                          post.commentCreatedAt ?? post.createdAt,
                        )}
                      </S.MetaItem>
                    </S.PostMeta>
                  </S.PostItem>
                ))}
              </S.PostList>
            )}
          </S.TabContent>
        </S.Card>
      </S.Inner>
      {showWithdrawModal && (
        <WithdrawModal onClose={() => setShowWithdrawModal(false)} />
      )}
    </S.PageWrapper>
  );
}
