export const getLocalDateString = (date: Date | null | undefined): string => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDate = (date: Date | null | undefined): string => {
  if (!date) return '';
  
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\. /g, '-').replace(/\.$/, '');
};

export const getDateRange = (start: Date | null, end: Date | null): string => {
  const startDate = formatDate(start);
  
  if (!end) return `${startDate} ~ ${startDate}`;
  
  const endDate = formatDate(new Date(end.getTime() - 86400000)); // 24 * 60 * 60 * 1000
  
  return `${startDate} ~ ${endDate}`;
};

export const formatDateTime = (uploadTime: string): string => {
  if (!uploadTime) return '';
  const date = new Date(uploadTime);
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const yy  = String(kstDate.getUTCFullYear()).slice(2);
  const mm  = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
  const dd  = String(kstDate.getUTCDate()).padStart(2, '0');
  const hh  = String(kstDate.getUTCHours()).padStart(2, '0');
  const min = String(kstDate.getUTCMinutes()).padStart(2, '0');
  return `${yy}.${mm}.${dd}. ${hh}:${min}`;
};