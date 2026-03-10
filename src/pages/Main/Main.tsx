import Calendar from "@/components/common/Calendar/Calendar";
import * as S from "./Main.styled.ts"
import Profile from "./components/Profile/Profile.tsx";
import MemberSection from "./components/MemberSection/MemberSection.tsx";

export default function Main() {
    return (
        <>
            <S.Container>
                <S.Scroll>
                    <S.CalendarDiv>
                        <Calendar readOnly={true}/>
                    </S.CalendarDiv>

                    <S.ForColumn>
                        <Profile/>
                    </S.ForColumn>
                </S.Scroll>

                <S.Line/>

                <MemberSection/>
                <S.Footer>
                    <S.Louter>Louter(라우터) / 대구소프트웨어마이스터고</S.Louter>
                    <S.Github><a href="https://github.com/Team-Louter" target="_blank" rel="noopener noreferrer">Github</a></S.Github>
                </S.Footer>
            </S.Container>
        </>
    )
}