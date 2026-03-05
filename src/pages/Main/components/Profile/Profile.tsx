import { useNavigate } from 'react-router-dom';
import MainPost from '../MainPost/MainPost';
import * as S from './Profile.styled';
import PopularPost from '../PopularPost/PopularPost';
import { getMyPost } from '@/api/User';
import { useEffect, useState } from 'react';
import type { MyPost } from '@/types/post';
import { useAuthStore } from '@/store/authStore';

export default function Profile() {
  const navigate = useNavigate();
  const userInfo = useAuthStore((state) => state.user);
  const [myPost, setMyPost] = useState<MyPost | null>(null);

  const getMyPostInfo = async () => {
    try {
      const data = await getMyPost();
      setMyPost(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMyPostInfo();
  }, []);

  return (
    <>
      <S.ProfileContainer>
        <S.ProfileInfoOut>
          <S.ProfileInfoIn>
            <S.ForRow>
              <S.ProfileImgDiv>
                <S.ProfileImg src={userInfo?.profileImageUrl} />
              </S.ProfileImgDiv>
              <S.BasicProfile>
                <S.Name>{userInfo?.userName}</S.Name>
                <S.School>
                  {userInfo?.grade}학년 {userInfo?.classRoom}반{' '}
                  {userInfo?.number}번
                </S.School>
              </S.BasicProfile>
            </S.ForRow>
            <S.MyProfile onClick={() => navigate('/me')}>MY 프로필</S.MyProfile>
          </S.ProfileInfoIn>
        </S.ProfileInfoOut>
        <S.MyPostTitle>내가 최근에 쓴 글</S.MyPostTitle>
        {(myPost?.content?.length ?? 0) > 0
          ? <MainPost
              title={myPost?.content[0]?.postTitle ?? ''}
              viewCount={myPost?.content[0]?.viewers ?? 0}
              id={myPost?.content[0]?.postId}
            />
          : <span style={{alignSelf: 'center', marginTop: 30}}>작성한 게시글이 없습니다.</span>
        }
      </S.ProfileContainer>
      <PopularPost />
    </>
  );
}