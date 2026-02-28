export const MAX_LENGTH = 2000;

export const insertAtCursor = (
    content: string,
    setContent: (v: string) => void,
    textareaRef: React.RefObject<HTMLTextAreaElement | null>,
    text: string
) => {
    const el = textareaRef.current;
    const pos = el?.selectionStart ?? content.length;
    const newValue = content.substring(0, pos) + text + content.substring(pos);
    if (newValue.length > MAX_LENGTH) return;
    setContent(newValue);
    requestAnimationFrame(() => {
        el?.focus();
        el?.setSelectionRange(pos + text.length, pos + text.length);
    });
};

export const processListEnter = (
    value: string,
    lineStart: number,
    currentLine: string,
    el: HTMLTextAreaElement,
    setContent: (v: string) => void,
    ulMatch: RegExpMatchArray | null,
    olMatch: RegExpMatchArray | null
) => {
    const pos = el.selectionStart;

    if (ulMatch) {
        const prefix = ulMatch[1];
        if (currentLine === prefix) {
            const newValue = value.substring(0, lineStart) + value.substring(pos);
            setContent(newValue);
            requestAnimationFrame(() => el.setSelectionRange(lineStart, lineStart));
            return;
        }
        const insertText = "\n" + prefix;
        const newValue = value.substring(0, pos) + insertText + value.substring(pos);
        if (newValue.length > MAX_LENGTH) return;
        setContent(newValue);
        requestAnimationFrame(() => el.setSelectionRange(pos + insertText.length, pos + insertText.length));

    } else if (olMatch) {
        const indent = olMatch[1];
        const num = parseInt(olMatch[2], 10);
        const olPrefix = indent + num + ". ";
        if (currentLine === olPrefix || currentLine === indent + num + ".") {
            const newValue = value.substring(0, lineStart) + value.substring(pos);
            setContent(newValue);
            requestAnimationFrame(() => el.setSelectionRange(lineStart, lineStart));
            return;
        }
        const insertText = "\n" + indent + (num + 1) + ". ";
        const newValue = value.substring(0, pos) + insertText + value.substring(pos);
        if (newValue.length > MAX_LENGTH) return;
        setContent(newValue);
        requestAnimationFrame(() => el.setSelectionRange(pos + insertText.length, pos + insertText.length));
    }
};