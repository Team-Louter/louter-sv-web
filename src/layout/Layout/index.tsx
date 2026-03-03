import { useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import * as S from './style';
import Topbar from '@/components/common/Topbar';

function Layout() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  // 스크롤 방향을 감지하여 상단바 숨기기 여부를 결정하는 핸들러
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentY = e.currentTarget.scrollTop;
    // 아래로 스크롤하고 현재 위치가 60px 이상이면 상단바를 숨김
    setHidden(currentY > lastScrollY.current && currentY > 60);
    lastScrollY.current = currentY;
  };

  return (
    <S.Container onScroll={handleScroll}>
      <S.HeaderSpacer />
      <Topbar hidden={hidden} />
      <Outlet />
    </S.Container>
  );
}

export default Layout;
