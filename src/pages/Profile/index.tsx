import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import * as S from './Profile.styled';
import { useAuthStore } from '@/store/authStore';
import { logout } from '@/api/Auth';
import { getUser, getMyPost, getCommentedPost, getLikedPost } from '@/api/User';
import { toast } from '@/store/toastStore';
import type { User } from '@/types/user';
import type { MainPost } from '@/types/post';
import { CATEGORY_REVERSED } from '@/constants/Community';
import { formatDateTime } from '@/utils/FormatDate';
import {
  PROFILE_TABS,
  PROFILE_PAGE_SIZE,
  TAB_EMPTY_MESSAGES,
} from '@/constants/Profile';
import ViewIcon from '@/assets/Mypage/View.svg';
import GoodIcon from '@/assets/Mypage/Good.svg';
import GoodEmptyIcon from '@/assets/Mypage/GoodEmpty.svg';
import ChatIcon from '@/assets/Mypage/Chat.svg';
import GithubImg from '@/assets/Mypage/github.svg';
import LinkedinImg from '@/assets/Mypage/linkedin.svg';
import WithdrawModal from './components/WithdrawModal/WithdrawModal';
import EditProfileModal from './components/EditProfileModal/EditProfileModal';
import MemberManageModal from './components/MemberManageModal/MemberManageModal';

const PAGE_SIZE = PROFILE_PAGE_SIZE;

type TabMeta = { nextPage: number; hasMore: boolean; fetching: boolean };

/** 중복 prefix 제거: https://github.com/https://github.com/user → https://github.com/user */
const normalizeGithubUrl = (url: string) => {
  const parts = url.split('github.com/').filter(Boolean);
  return parts.length > 0
    ? `https://github.com/${parts[parts.length - 1].split('/')[0]}`
    : url;
};
const normalizeLinkedinUrl = (url: string) => {
  const parts = url.split(/linkedin\.com\/in\//i).filter(Boolean);
  return parts.length > 0
    ? `https://www.linkedin.com/in/${parts[parts.length - 1].split('/')[0]}`
    : url;
};

export default function Profile() {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();

  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [tabCache, setTabCache] = useState<Record<number, MainPost[]>>({});
  const [tabMeta, setTabMeta] = useState<Record<number, TabMeta>>({});
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const tabContentRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const FETCH_FNS = [getMyPost, getCommentedPost, getLikedPost] as const;

  const dedup = useCallback((tab: number, items: MainPost[]): MainPost[] => {
    const seen = new Set<string>();
    return items.filter((post) => {
      const uid =
        tab === 1
          ? `${post.postId}-${post.commentId ?? post.postId}`
          : String(post.postId);
      if (seen.has(uid)) return false;
      seen.add(uid);
      return true;
    });
  }, []);

  const fetchPage = useCallback(
    async (tab: number, page: number, signal?: AbortSignal) => {
      setTabMeta((prev) => ({
        ...prev,
        [tab]: {
          ...(prev[tab] ?? { nextPage: 0, hasMore: true }),
          fetching: true,
        },
      }));
      try {
        const data = await FETCH_FNS[tab](page, PAGE_SIZE, signal);
        const incoming = dedup(tab, data.content);
        setTabCache((prev) => {
          const existing = prev[tab] ?? [];
          const merged = dedup(tab, [...existing, ...incoming]);
          return { ...prev, [tab]: merged };
        });
        setTabMeta((prev) => ({
          ...prev,
          [tab]: {
            nextPage: page + 1,
            hasMore: !data.last,
            fetching: false,
          },
        }));
      } catch (err: unknown) {
        const e = err as { code?: string; name?: string };
        if (e?.code === 'ERR_CANCELED' || e?.name === 'CanceledError') return;
        setTabCache((prev) => ({ ...prev, [tab]: prev[tab] ?? [] }));
        setTabMeta((prev) => ({
          ...prev,
          [tab]: { nextPage: page, hasMore: false, fetching: false },
        }));
      }
    },
    [dedup], // eslint-disable-line react-hooks/exhaustive-deps
  );

  /* 탭 전환 시 첫 페이지 로드 */
  useEffect(() => {
    if (tabCache[activeTab] !== undefined) return;
    const controller = new AbortController();
    fetchPage(activeTab, 0, controller.signal);
    return () => controller.abort();
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  /* IntersectionObserver — sentinel이 보이면 다음 페이지 로드 */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = tabContentRef.current;
    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        setTabMeta((prev) => {
          const meta = prev[activeTab];
          if (!meta || !meta.hasMore || meta.fetching) return prev;
          fetchPage(activeTab, meta.nextPage);
          return prev;
        });
      },
      { root: container, threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [activeTab, tabMeta]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getUser()
      .then(setUser)
      .catch(() => toast.error('사용자 정보를 불러오지 못했습니다.'));
  }, []);

  const posts: MainPost[] = tabCache[activeTab] ?? [];
  const loading = tabCache[activeTab] === undefined;
  const isFetchingMore = tabMeta[activeTab]?.fetching && posts.length > 0;

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
    <S.Container>
      <S.PageWrapper>
        <SkeletonTheme baseColor="#F3F4F6" highlightColor="#e8e8e8">
          <S.Inner>
            {/* 페이지 제목 */}
            {/* <S.PageTitle>마이페이지</S.PageTitle> */}

            {/* 단일 카드 */}
            <S.Card>
              {/* 상단: 프로필 + 통계 + 버튼 */}
              {user === null ? (
                /* ── 프로필 스켈레톤 ── */
                <>
                  <S.CardTop>
                    <S.ProfileGroup>
                      <Skeleton circle width={116} height={116} />
                      <S.ProfileInfo>
                        <Skeleton width={120} height={22} />
                        <Skeleton width={160} height={16} />
                        <Skeleton width={80} height={28} borderRadius={4} />
                      </S.ProfileInfo>
                    </S.ProfileGroup>
                    <S.StatsGroup>
                      {[0, 1, 2].map((i) => (
                        <S.StatItem key={i}>
                          <Skeleton width={40} height={24} />
                          <Skeleton
                            width={72}
                            height={14}
                            style={{ marginTop: 8 }}
                          />
                        </S.StatItem>
                      ))}
                    </S.StatsGroup>
                    <S.ActionGroup>
                      <Skeleton width={80} height={34} borderRadius={4} />
                      <Skeleton width={80} height={34} borderRadius={4} />
                    </S.ActionGroup>
                  </S.CardTop>
                  <S.Divider />
                  <S.InfoSection>
                    <S.InfoRow>
                      <Skeleton
                        width={120}
                        height={18}
                        style={{ marginRight: 16 }}
                      />
                      <Skeleton width={200} height={18} />
                    </S.InfoRow>
                    <S.InfoRow>
                      <Skeleton
                        width={120}
                        height={18}
                        style={{ marginRight: 16 }}
                      />
                      <Skeleton width={60} height={18} />
                    </S.InfoRow>
                  </S.InfoSection>
                </>
              ) : (
                /* ── 실제 프로필 ── */
                <>
                  <S.CardTop>
                    <S.ProfileGroup>
                      <S.ProfileImageWrapper>
                        {user.profileImageUrl ? (
                          <S.ProfileImage
                            src={user.profileImageUrl}
                            alt="프로필 이미지"
                          />
                        ) : (
                          <S.ProfileImageFallback>
                            {user.userName.charAt(0)}
                          </S.ProfileImageFallback>
                        )}
                      </S.ProfileImageWrapper>
                      <S.ProfileInfo>
                        <S.ProfileName>{user.userName}</S.ProfileName>
                        <S.ProfileSubInfo>
                          {`${user.grade}학년 ${user.classRoom}반 ${user.number}번`}
                        </S.ProfileSubInfo>
                        <S.EditButton onClick={() => setShowEditModal(true)}>
                          프로필 수정
                        </S.EditButton>
                      </S.ProfileInfo>
                    </S.ProfileGroup>

                    <S.StatsGroup>
                      <S.StatItem>
                        <S.StatValue>{user.postCount}</S.StatValue>
                        <S.StatLabel>작성한 글</S.StatLabel>
                      </S.StatItem>
                      <S.StatItem>
                        <S.StatValue>{user.commentCount}</S.StatValue>
                        <S.StatLabel>작성한 댓글</S.StatLabel>
                      </S.StatItem>
                      <S.StatItem>
                        <S.StatValue>{user.likedPostCount}</S.StatValue>
                        <S.StatLabel>좋아요한 글</S.StatLabel>
                      </S.StatItem>
                    </S.StatsGroup>

                    <S.ActionGroup>
                      {(user.githubUrl || user.linkedinUrl) && (
                        <S.SocialRow>
                          {user.githubUrl && (
                            <S.SocialLink
                              href={normalizeGithubUrl(user.githubUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={GithubImg}
                                alt="GitHub"
                                width={18}
                                height={18}
                              />
                              {(() => {
                                const parts = user.githubUrl
                                  .split('github.com/')
                                  .filter(Boolean);
                                return parts.length > 0
                                  ? parts[parts.length - 1].split('/')[0]
                                  : '';
                              })()}
                            </S.SocialLink>
                          )}
                          {user.linkedinUrl && (
                            <S.SocialLink
                              href={normalizeLinkedinUrl(user.linkedinUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={LinkedinImg}
                                alt="LinkedIn"
                                width={18}
                                height={18}
                              />
                              {(() => {
                                const parts = user.linkedinUrl
                                  .split(/linkedin\.com\/in\//i)
                                  .filter(Boolean);
                                return parts.length > 0
                                  ? parts[parts.length - 1].split('/')[0]
                                  : '';
                              })()}
                            </S.SocialLink>
                          )}
                        </S.SocialRow>
                      )}
                      <S.ButtonRow>
                        {user.role === 'LEADER' && (
                          <S.ActionButton
                            $variant="admin"
                            onClick={() => setShowMemberModal(true)}
                          >
                            멤버 관리
                          </S.ActionButton>
                        )}
                        <S.ActionButton onClick={handleLogout}>
                          로그아웃
                        </S.ActionButton>
                        <S.ActionButton $danger onClick={handleWithdraw}>
                          회원 탈퇴
                        </S.ActionButton>
                      </S.ButtonRow>
                    </S.ActionGroup>
                  </S.CardTop>

                  <S.Divider />

                  <S.InfoSection>
                    <S.InfoRow>
                      <S.InfoLabel>이메일(Email)</S.InfoLabel>
                      <S.InfoValue>{user.userEmail}</S.InfoValue>
                    </S.InfoRow>
                    <S.InfoRow>
                      <S.InfoLabel>받은 좋아요 개수</S.InfoLabel>
                      <S.InfoValue $accent>
                        {user.receivedLikeCount.toLocaleString()}
                      </S.InfoValue>
                    </S.InfoRow>
                  </S.InfoSection>
                </>
              )}

              {/* 탭 */}
              <S.TabBar>
                {PROFILE_TABS.map((tab, idx) => (
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
              <S.TabContent ref={tabContentRef}>
                {loading ? (
                  <S.PostList>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <S.PostItem key={i} style={{ cursor: 'default' }}>
                        <S.PostLeft>
                          <Skeleton width={56} height={22} borderRadius={50} />
                          <Skeleton width={260} height={16} />
                        </S.PostLeft>
                        <S.PostMeta>
                          <Skeleton width={40} height={14} />
                          <Skeleton width={40} height={14} />
                          <Skeleton width={40} height={14} />
                          <Skeleton width={80} height={14} />
                        </S.PostMeta>
                      </S.PostItem>
                    ))}
                  </S.PostList>
                ) : posts.length === 0 ? (
                  <S.EmptyMessage>
                    {TAB_EMPTY_MESSAGES[activeTab]}
                  </S.EmptyMessage>
                ) : (
                  <S.PostList>
                    {posts.map((post) => (
                      <S.PostItem
                        key={
                          activeTab === 1
                            ? `${post.postId}-${post.commentId ?? post.postId}`
                            : post.postId
                        }
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
                            <img
                              src={
                                (post.isHearted ?? activeTab === 2)
                                  ? GoodIcon
                                  : GoodEmptyIcon
                              }
                              alt="likes"
                            />
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
                    {/* 무한 스크롤 sentinel */}
                    <div ref={sentinelRef} style={{ height: 1 }} />
                    {isFetchingMore &&
                      Array.from({ length: 3 }).map((_, i) => (
                        <S.PostItem
                          key={`skeleton-more-${i}`}
                          style={{ cursor: 'default' }}
                        >
                          <S.PostLeft>
                            <Skeleton
                              width={56}
                              height={22}
                              borderRadius={50}
                            />
                            <Skeleton width={260} height={16} />
                          </S.PostLeft>
                          <S.PostMeta>
                            <Skeleton width={40} height={14} />
                            <Skeleton width={40} height={14} />
                            <Skeleton width={40} height={14} />
                            <Skeleton width={80} height={14} />
                          </S.PostMeta>
                        </S.PostItem>
                      ))}
                  </S.PostList>
                )}
              </S.TabContent>
            </S.Card>
          </S.Inner>
        </SkeletonTheme>
        {showWithdrawModal && (
          <WithdrawModal onClose={() => setShowWithdrawModal(false)} />
        )}
        {showEditModal && user && (
          <EditProfileModal
            user={user}
            onClose={() => setShowEditModal(false)}
            onUpdated={(updated) => setUser(updated)}
          />
        )}
        {showMemberModal && (
          <MemberManageModal onClose={() => setShowMemberModal(false)} />
        )}
      </S.PageWrapper>
    </S.Container>
  );
}
