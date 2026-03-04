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
import Study from '@/pages/Study';
import StudyAdmin from '@/pages/StudyAdmin';
import Calendar from '@/pages/Calendar/Calendar';
import Layout from '@/layout/Layout/index';
import RequireAuth from '@/components/common/RequireAuth';
import NotFound from '@/pages/NotFound/NotFound';
import GoogleOAuthCallback from '@/pages/GoogleOAuthCallback/GoogleOAuthCallback';

// Project 페이지 import
import ProjectList from '@/pages/Project/ProjectList/ProjectList';
import ProjectLayout from '@/pages/Project/ProjectDetail/ProjectLayout';
import ProjectOverview from '@/pages/Project/ProjectDetail/Overview/ProjectOverview';
import ProjectDiagram from '@/pages/Project/ProjectDetail/Diagram/ProjectDiagram';
import DiagramEditor from '@/pages/Project/DiagramEditor/DiagramEditor';
import ProjectSchema from '@/pages/Project/ProjectDetail/Schema/ProjectSchema';
import ProjectSchemaDetail from '@/pages/Project/ProjectDetail/Schema/ProjectSchemaDetail';
import SchemaEditor from '@/pages/Project/SchemaEditor/SchemaEditor';
import ProjectDocs from '@/pages/Project/ProjectDetail/Docs/ProjectDocs';
import ProjectDocDetail from '@/pages/Project/ProjectDetail/Docs/ProjectDocDetail';
import ProjectDocEdit from '@/pages/Project/ProjectDetail/Docs/ProjectDocEdit';
import ProjectTasks from '@/pages/Project/ProjectDetail/Tasks/ProjectTasks';
import ProjectProgress from '@/pages/Project/ProjectDetail/Progress/ProjectProgress';

const Router = () => {
  return (
    <Routes>
      {/* 풀스크린 에디터 — Layout 없이 렌더링 */}
      <Route element={<RequireAuth />}>
        <Route path={'/project/:projectId/diagram/:diagramId'} element={<DiagramEditor />} />
        <Route path={'/project/:projectId/schema/:schemaId'} element={<SchemaEditor />} />
      </Route>

      <Route element={<Layout />}>
        {/* Auth / Public Pages */}
        <Route path={'/auth/signup/check'} element={<SignupCheck />} />
        <Route path={'/auth/signup'} element={<Signup />} />
        <Route path={'/auth/signup/google'} element={<SignupGoogle />} />
        <Route path={'/auth/signin'} element={<Signin />} />

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
          <Route path={'/study'} element={<Study />} />
          <Route path={'/study/admin'} element={<StudyAdmin />} />

          {/* Calendar */}
          <Route path={'/calendar'} element={<Calendar />} />

          {/* Project */}
          <Route path={'/project'} element={<ProjectList />} />
          <Route path={'/project/:projectId'} element={<ProjectLayout />}>
            <Route index element={<ProjectOverview />} />
            <Route path={'diagram'} element={<ProjectDiagram />} />
            <Route path={'schema'} element={<ProjectSchema />} />
            <Route path={'docs'} element={<ProjectDocs />} />
            <Route path={'docs/:docId'} element={<ProjectDocDetail />} />
            <Route path={'docs/new'} element={<ProjectDocEdit />} />
            <Route path={'docs/:docId/edit'} element={<ProjectDocEdit />} />
            <Route path={'tasks'} element={<ProjectTasks />} />
            <Route path={'progress'} element={<ProjectProgress />} />
          </Route>
        </Route>
      </Route>

      {/* 존재하지 않는 경로 */}
      <Route path={'*'} element={<NotFound />} />
    </Routes>
  );
};

export default Router;
