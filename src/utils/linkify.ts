export function linkify(text: string): string {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  
    const urlPattern = /(https?:\/\/[^\s<>"']+)/g;
    return escaped.replace(
      urlPattern,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
}