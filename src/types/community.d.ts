import type { IconType } from "react-icons";
import type { Comment } from "./post";

export interface Markdown {
    label: string;
    icon: IconType;
    size?: number;
    before: string;
    after: string;
    block: boolean;
    type?: string;
}