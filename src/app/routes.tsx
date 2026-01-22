export const ROUTES = {
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNUP_GOOGLE: '/auth/signup/google',
    SIGNIN: '/auth/signin',
  },
  MAIN: '/',
  MYPAGE: {
    DETAIL: '/profile/:userId',
  },
  COMMUNITY: {
    LIST: '/community',
    DETAIL: '/community/:postId',
    CREATE: '/community/write',
  },
  MENTORING: '/mentoring',
  STUDY: {
    LIST: '/study',
    ADMIN: '/study/admin',
  },
  CALENDAR: '/calendar',
};
