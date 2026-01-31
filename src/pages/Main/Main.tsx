import Calendar from "@/components/common/Calendar/Calendar";
import * as S from "./Main.styled.ts"
import Profile from "./components/Profile/Profile.tsx";

export default function Main() {
    return (
        <>
            <S.Container>
                <S.CalendarDiv>
                    <Calendar/>
                </S.CalendarDiv>

                <S.ForColumn>
                    <Profile/>
                </S.ForColumn>
            </S.Container>
        </>
    )
}