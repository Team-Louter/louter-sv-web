import type { Member } from "@/types/member";
import instance from "./Axios";

// 멤버 가져오기
export const getMember = async (gen: string|null, key:string|null): Promise<Member[]> => {
    const response = await instance.get<Member[]>("/members", {
        params: {
            generation: gen === null || gen === "전체" ? null : Number(gen.replace("기", "")),
            keyword: key
        }
    });
    return response.data;
}