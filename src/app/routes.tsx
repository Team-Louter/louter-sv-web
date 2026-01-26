import { Routes, Route } from 'react-router-dom';

// 페이지 import
import SignupCheck from '@/pages/SignupCheck';
import Signup from '@/pages/Signup';
import SignupGoogle from '@/pages/SignupGoogle';
import Signin from '@/pages/Signin';
import Main from '@/pages/Main';
import Profile from '@/pages/Profile';
import CommunityList from '@/pages/Community';
import CommunityDetail from '@/pages/CommunityDetail';
import CommunityPost from '@/pages/CommunityPost';
import Mentoring from '@/pages/Mentoring/Mentoring';
import Study from '@/pages/Study';
import StudyAdmin from '@/pages/StudyAdmin';
import Calendar from '@/pages/Calendar';
import Layout from '@/layout/Layout/index';

const Router = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Auth / Public Pages */}
        <Route path={'/auth/signup/check'} element={<SignupCheck />} />
        <Route path={'/auth/signup/signup'} element={<Signup />} />
        <Route path={'/auth/signup/google'} element={<SignupGoogle />} />
        <Route path={'/auth/signin'} element={<Signin />} />

        {/* Main / Private Pages */}
        <Route path={'/'} element={<Main />} />
        <Route path={'/profile/:userId'} element={<Profile />} />

        {/* Community */}
        <Route path={'/community'} element={<CommunityList />} />
        <Route path={'/community/:postId'} element={<CommunityDetail />} />
        <Route path={'/community/write'} element={<CommunityPost />} />

        {/* Mentoring */}
        <Route path={'/mentoring'} element={<Mentoring />} />
        {/* Study */}
        <Route path={'/study'} element={<Study />} />
        <Route path={'/study/admin'} element={<StudyAdmin />} />

        {/* Calendar */}
        <Route path={'/calendar'} element={<Calendar />} />
      </Route>
    </Routes>
  );
};

export default Router;
