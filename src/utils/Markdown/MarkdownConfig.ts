import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

export const md = new MarkdownIt({
    breaks: true,
    linkify: true,
    html: false,
});

// 링크 새 탭으로 열기
const defaultRender = md.renderer.rules.link_open || ((tokens: any, idx: any, options: any, _env: any, self: any) => self.renderToken(tokens, idx, options));
md.renderer.rules.link_open = (tokens: any, idx: any, options: any, env: any, self: any) => {
    tokens[idx].attrSet("target", "_blank");
    tokens[idx].attrSet("rel", "noopener noreferrer");
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