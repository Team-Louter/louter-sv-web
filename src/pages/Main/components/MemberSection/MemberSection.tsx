import { getGenerations } from "@/utils/FormatFilters.ts";
import { useEffect, useState } from "react";
import Member from "../Member/Member.tsx";
import { getMember } from "@/api/Member.ts";
import type { Member as MemberType } from "@/types/member.js";
import * as S from "./MemnerSection.styled.ts";

export default function MemberSection() {
    const [selectedGen, setSelectedGen] = useState<string>("전체");
    const [members, setMembers] = useState<MemberType[] | null>(null);
    const [allMembers, setAllMembers] = useState<MemberType[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getMemberInfo = async () => {
        setIsLoading(true);
        try {
            const data = await getMember(selectedGen, null);
            setMembers(data);
            if (selectedGen === "전체" && !allMembers) {
                setAllMembers(data);
            }
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getMemberInfo();
    }, [selectedGen]);

    return (
        <S.MemberContainer>
            <S.Title>Louter Member</S.Title>
            <S.FilterContainer>
                {getGenerations(allMembers).map((gen) => (
                    <S.GenFilter
                        key={gen}
                        onClick={() => setSelectedGen(gen)}
                        $isSelected={selectedGen === gen}
                    >
                        {gen}
                    </S.GenFilter>
                ))}
            </S.FilterContainer>
            <S.MemberScroll>
                {members?.map((member) => (
                    <Member key={member.userId} memberInfo={member} isLoading={isLoading} />
                ))}
            </S.MemberScroll>
        </S.MemberContainer>
    );
}