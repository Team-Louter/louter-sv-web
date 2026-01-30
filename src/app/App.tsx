// 스타일
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/Theme';
import { GlobalStyle } from '@/styles/GlobalStyle';

// 라우팅
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './routes';

// 페이지 import
import Signup1 from '@/pages/Signup1';
import Signin from '@/pages/Signin';
import Main from '@/pages/Main';
import MyPage from '@/pages/MyPage';
import CommunityList from '@/pages/Community';
import CommunityDetail from '@/pages/CommunityDetail';
import CommunityPost from '@/pages/CommunityPost';
import Mentoring from '@/pages/Mentoring/Mentoring';
import Study from '@/pages/Study';
import StudyAdmin from '@/pages/StudyAdmin';
import Calendar from '@/pages/Calendar';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Routes>
        {/* Auth / Public Pages */}
        <Route path={ROUTES.AUTH.SIGNUP} element={<Signup1 />} />
        <Route path={ROUTES.AUTH.SIGNIN} element={<Signin />} />

        {/* Main / Private Pages */}
        <Route path={ROUTES.MAIN} element={<Main />} />
        <Route path={ROUTES.MYPAGE.DETAIL} element={<MyPage />} />

        {/* Community */}
        <Route path={ROUTES.COMMUNITY.LIST} element={<CommunityList />} />
        <Route path={ROUTES.COMMUNITY.DETAIL} element={<CommunityDetail />} />
        <Route path={ROUTES.COMMUNITY.CREATE} element={<CommunityPost />} />

        {/* Mentoring */}
        <Route path={ROUTES.MENTORING} element={<Mentoring />} />

        {/* Study */}
        <Route path={ROUTES.STUDY.LIST} element={<Study />} />
        <Route path={ROUTES.STUDY.ADMIN} element={<StudyAdmin />} />

        {/* Calendar */}
        <Route path={ROUTES.CALENDAR} element={<Calendar />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
