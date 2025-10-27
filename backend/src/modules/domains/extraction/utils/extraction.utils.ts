import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export function formatDate(dateString: string | null): string | null {
  if (!dateString || typeof dateString !== 'string') return null;
  const formatsToTry = [
    'DD MMM YYYY',
    'MMMM DD, YYYY',
    'YYYY-MM-DD',
    'M/D/YYYY',
    'MM/DD/YYYY',
    'MM/DD/YY',
    'D-MMM-YY',
    'DD-MMM-YY',
  ];
  for (const fmt of formatsToTry) {
    const d = dayjs(dateString.trim(), fmt, 'en', true);
    if (d.isValid()) {
      let year = d.year();
      if (fmt.toLowerCase().includes('yy') && !fmt.toLowerCase().includes('yyyy')) {
        year = year > dayjs().year() % 100 ? 1900 + year : 2000 + year;
      }
      return d.year(year).format('YYYY-MM-DD');
    }
  }
  console.warn(`Warning: Could not parse date '${dateString}'. Returning null.`);
  return null;
}

export function recursiveClean<T>(data: T): T {
  if (typeof data === 'string') {
    return data.trim() as T;
  }
  if (Array.isArray(data)) {
    return data.map((item: unknown) => recursiveClean(item)) as T;
  }
  if (typeof data === 'object' && data !== null) {
    const objData = data as Record<string, unknown>;
    for (const key of Object.keys(objData)) {
      if (key.toLowerCase().includes('date')) {
        objData[key] = formatDate(objData[key] as string | null);
      } else {
        objData[key] = recursiveClean(objData[key]);
      }
    }
  }
  return data;
}

export function sanitizeJsonString(str: string): string {
  return str
    .replace(/\\n/g, '\\n')
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, '\\&')
    .replace(/\\r/g, '\\r')
    .replace(/\\t/g, '\\t')
    .replace(/\\b/g, '\\b')
    .replace(/\\f/g, '\\f')
    .replace(/[\u0000-\u001F]+/g, ''); // eslint-disable-line no-control-regex
}
