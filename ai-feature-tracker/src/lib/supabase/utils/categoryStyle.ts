export type CategoryStyle = {
    hex: string;
    textHex: string; // computed readable text color
    isDark: boolean;
};

export function normalizeHex(input: string | null | undefined, fallback = '#2563eb'): string {
    const val = (input || '').trim();
    if (/^#([0-9a-fA-F]{3}){1,2}$/.test(val)) return toFullHex(val);
    return fallback;
}

export function toFullHex(hex: string): string {
    if (!hex.startsWith('#')) return hex;
    if (hex.length === 4) {
        const r = hex[1];
        const g = hex[2];
        const b = hex[3];
        return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    return hex.toLowerCase();
}

export function getTextColorForBackground(bgHex: string): string {
    const hex = toFullHex(bgHex).replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Relative luminance (WCAG)
    const [R, G, B] = [r, g, b].map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
    // Choose black for light backgrounds, white for dark backgrounds
    return luminance > 0.179 ? '#111827' /* gray-900 */ : '#ffffff';
}

export function buildCategoryStyle(color_code: string | null | undefined): CategoryStyle {
    const hex = normalizeHex(color_code);
    const textHex = getTextColorForBackground(hex);
    const isDark = textHex === '#ffffff';
    return { hex, textHex, isDark };
}


