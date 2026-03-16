import instance from "./Axios";

export const fcm = async (token: string): Promise<void> => {
    console.log(token)
    await instance.post<void>("fcm/token", { token : token });
}