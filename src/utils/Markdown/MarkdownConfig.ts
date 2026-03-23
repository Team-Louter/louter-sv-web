import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

export const md = new MarkdownIt({
    breaks: true,
    linkify: true,
    html: false,
});

// 링크 새 탭으로 열기 / 파일은 다운로드
const defaultRender = md.renderer.rules.link_open || ((tokens: any, idx: any, options: any, _env: any, self: any) => self.renderToken(tokens, idx, options));
md.renderer.rules.link_open = (tokens: any, idx: any, options: any, env: any, self: any) => {
    const href = tokens[idx].attrGet("href") ?? "";

    const isBlobFile = href.startsWith("blob:");
    const isMediaExt = /\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg)(\?.*)?$/i.test(href);
    const isPdf = /\.pdf(\?.*)?$/i.test(href); // PDF는 새 탭으로 열기
    const isFileExt = /\.(zip|hwp|xlsx|xls|docx|pptx|txt|csv|apk)(\?.*)?$/i.test(href);
    const isFile = isBlobFile || isFileExt;

    if (isFile && !isMediaExt && !isPdf) {
        // 파일은 download 속성 추가 (새 탭 X)
        const filename = decodeURIComponent(href.split("/").pop()?.split("?")[0] ?? "file");
        tokens[idx].attrSet("download", filename);
    } else {
        // 이미지/영상/PDF/일반 링크는 새 탭으로
        tokens[idx].attrSet("target", "_blank");
        tokens[idx].attrSet("rel", "noopener noreferrer");
    }

    return defaultRender(tokens, idx, options, env, self);
};

// md.render() 결과물에서 video 커스텀 태그를 실제 HTML로 치환
const postprocessRendered = (html: string) => {
    return html.replace(
        /<a[^>]*href="([^"]+)"[^>]*>video:([^<]+)<\/a>/g,
        `<video controls style="max-width:100%;max-height:300px;border-radius:8px;" src="$1"></video>`
    );
};

export const renderMarkdown = (content: string) =>
    DOMPurify.sanitize(postprocessRendered(md.render(content)), {
        ALLOWED_TAGS: [
            "p", "br", "strong", "em", "del", "h1", "h2", "h3", "h4", "h5", "h6",
            "ul", "ol", "li", "blockquote", "pre", "code", "hr",
            "a", "img", "video",
        ],
        ALLOWED_ATTR: [
            "href", "target", "rel", "download",
            "src", "alt", "width", "height", "style",
            "controls",
        ],
        ALLOW_UNKNOWN_PROTOCOLS: true,
        FORCE_BODY: true,
});