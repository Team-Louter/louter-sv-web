import { useNavigate } from 'react-router-dom';
import MainPost from '../MainPost/MainPost';
import * as S from './Profile.styled';
import PopularPost from '../PopularPost/PopularPost';
import { getMyPost, getUser } from '@/api/User';
import { useEffect, useState } from 'react';
import type { User } from '@/types/user';
import type { MyPost } from '@/types/post';

export default function Profile() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [myPost, setMyPost] = useState<MyPost | null>(null);

  const getUserInfo = async () => {
    try {
      const data = await getUser();
      setUserInfo(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getMyPostInfo = async () => {
    try {
      const data = await getMyPost();
      setMyPost(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUserInfo();
    getMyPostInfo();
  }, []);

  return (
    <>
      <S.ProfileContainer>
        <S.ProfileInfoOut>
          <S.ProfileInfoIn>
            <S.ForRow>
              <S.ProfileImg src={userInfo?.profileImageUrl} />
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
        <MainPost
          title={myPost?.content[0]?.postTitle ?? 'Untitled'}
          viewCount={myPost?.content[0]?.viewers ?? 0}
          id={myPost?.content[0]?.postId}
        />
      </S.ProfileContainer>
      <PopularPost />
    </>
  );
}
