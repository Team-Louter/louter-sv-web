import type { IconType } from "react-icons";
import type { RefObject } from "react";
import type { Comment } from "./post";

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
    type?: string;
}

export interface MarkdownProps {
    textareaRef: RefObject<HTMLTextAreaElement | null>;
    content: string;
    setContent: (value: string) => void;
    onImageClick?: () => void;
    onFileClick?: () => void;
}

export type KebabMenuProps = {
    items: { label: string; onClick: () => void }[];
};

export interface CommentWriteProps {
    comment?: Comment;
    onClose?: () => void;
    isEditing?: boolean;
    parentId?: number | null;
    onSuccess?: () => void;
}

export interface ConfirmModalProps {
    open: boolean;
    message?: string;
    onCancel: () => void;
    onConfirm: () => void;
    cancelLabel?: string;
    confirmLabel?: string;
    confirmColor?: string;
    confirmLabelColor?: string;
    errorMessage?: string;
}