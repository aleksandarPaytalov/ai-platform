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
    const rc = r / 255;
    const gc = g / 255;
    const bc = b / 255;
    const R = rc <= 0.03928 ? rc / 12.92 : Math.pow((rc + 0.055) / 1.055, 2.4);
    const G = gc <= 0.03928 ? gc / 12.92 : Math.pow((gc + 0.055) / 1.055, 2.4);
    const B = bc <= 0.03928 ? bc / 12.92 : Math.pow((bc + 0.055) / 1.055, 2.4);
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


