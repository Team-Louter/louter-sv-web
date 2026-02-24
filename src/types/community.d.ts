import type { IconType } from "react-icons";
import type { RefObject } from "react";

export interface CommunitySidebarProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

export interface CategoryDropdownProps {
    options: string[];
    selected: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export interface Markdown {
    label: string;
    icon: IconType;
    size?: number;
    before: string;
    after: string;
    block: boolean;
}

export interface MarkdownProps {
    textareaRef: RefObject<HTMLTextAreaElement | null>;
    content: string;
    setContent: (value: string) => void;
}

export type KebabMenuProps = {
    items: { label: string; onClick: () => void }[];
};

export interface CommentWriteProps {
    onClose?: () => void;
    initialValue?: string;
}