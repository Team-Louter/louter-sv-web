import { Routes, Route } from 'react-router-dom';

// 페이지 import
import SignupCheck from '@/pages/SignupCheck';
import Signup from '@/pages/Signup';
import SignupGoogle from '@/pages/SignupGoogle';
import Signin from '@/pages/Signin';
import Main from '@/pages/Main/Main';
import Profile from '@/pages/Profile';
import CommunityList from '@/pages/Community/CommunityMain/CommunityMain';
import CommunityDetail from '@/pages/Community/CommunityDetail/CommunityDetail';
import CommunityPost from '@/pages/Community/CommunityPost/CommunityPost';
import Mentoring from '@/pages/Mentoring/Mentoring';
import StudyMain from '@/pages/Study/StudyMain/StudyMain';
import StudyMentor from '@/pages/Study/StudyMentor/StudyMentor';
import StudyAdmin from '@/pages/StudyAdmin';
import Calendar from '@/pages/Calendar/Calendar';
import Layout from '@/layout/Layout/index';
import RequireAuth from '@/components/common/RequireAuth';
import RedirectIfAuth from '@/components/common/RedirectIfAuth';
import NotFound from '@/pages/NotFound/NotFound';
import GoogleOAuthCallback from '@/pages/GoogleOAuthCallback/GoogleOAuthCallback';
import { useEffect, useState } from 'react';
import { getUser } from '@/api/User';
import type { Member } from '@/types/member';
import CanceledMembership from '@/pages/CanceledMembership';

// 역할별 학습 페이지 전환
const StudyPageSelector = () => {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userData = await getUser();
        setRole((userData as unknown as Member).role);
      } catch (error) {
        console.error('역할 정보를 가져오는데 실패했습니다.', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserRole();
  }, []);

  if (isLoading) return <div>로딩 중...</div>;

  if (role === 'LEADER' || role === 'MENTOR') {
    return <StudyMentor />;
  }
  return <StudyMain />;
};

const Router = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 비로그인 전용 — 로그인 상태면 메인으로 리다이렉트 */}
        <Route element={<RedirectIfAuth />}>
          <Route path={'/auth/signup/check'} element={<SignupCheck />} />
          <Route path={'/auth/signup'} element={<Signup />} />
          <Route path={'/auth/signup/google'} element={<SignupGoogle />} />
          <Route path={'/auth/signin'} element={<Signin />} />
        </Route>

        {/* 탈퇴 완료 — state 가드로 보호 */}
        <Route path={'/canceled'} element={<CanceledMembership />} />

        {/* Google OAuth 콜백 — 신규 유저 추가정보 입력 */}
        <Route path={'/extra-signup'} element={<SignupGoogle />} />
        {/* Google OAuth 콜백 — 기존 유저 메인 이동 */}
        <Route path={'/main'} element={<GoogleOAuthCallback />} />

        {/* Private Pages — 로그인 필요 */}
        <Route element={<RequireAuth />}>
          {/* Main */}
          <Route path={'/'} element={<Main />} />
          <Route path={'/me'} element={<Profile />} />

          {/* Community */}
          <Route path={'/community'} element={<CommunityList />} />
          <Route path={'/community/:postId'} element={<CommunityDetail />} />
          <Route path={'/community/write'} element={<CommunityPost />} />

          {/* Mentoring */}
          <Route path={'/mentoring'} element={<Mentoring />} />

          {/* Study */}
          <Route path={'/study'} element={<StudyPageSelector />} />
          <Route path={'/study/admin'} element={<StudyAdmin />} />

          {/* Calendar */}
          <Route path={'/calendar'} element={<Calendar />} />
        </Route>
      </Route>

      {/* 존재하지 않는 경로 */}
      <Route path={'*'} element={<NotFound />} />
    </Routes>
  );
};

export default Router;
