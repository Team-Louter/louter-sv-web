import { useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import * as S from './style';
import Topbar from '@/components/common/Topbar';

function Layout() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentY = e.currentTarget.scrollTop;
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
