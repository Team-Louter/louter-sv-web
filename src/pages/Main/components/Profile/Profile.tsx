import { useNavigate } from "react-router-dom";
import MainPost from "../MainPost/MainPost";
import * as S from "./Profile.styled";
import { dummyMyPosts } from "@/constants/dummy";
import PopularPost from "../PopularPost/PopularPost";

export default function Profile () {
    const navigate = useNavigate();

    return (
        <>
            <S.ProfileContainer>
                <S.ProfileInfoOut>
                    <S.ProfileInfoIn>
                        <S.ForRow>
                            <S.ProfileImg></S.ProfileImg>
                            <S.BasicProfile>
                                <S.Name>최현수</S.Name>
                                <S.School>1학년 3반 16번</S.School>
                            </S.BasicProfile>
                        </S.ForRow>
                        <S.MyProfile onClick={() => navigate('/me')}>MY 프로필</S.MyProfile>
                    </S.ProfileInfoIn>
                </S.ProfileInfoOut>
                <S.MyPostTitle>내가 최근에 쓴 글</S.MyPostTitle>
                <MainPost title={dummyMyPosts[0].title} viewCount={dummyMyPosts[0].viewCount}/>
            </S.ProfileContainer>
            <PopularPost/>
        </>
    )
}