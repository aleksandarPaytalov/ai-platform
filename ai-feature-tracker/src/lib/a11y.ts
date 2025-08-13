import { theme } from '@/lib/design-system';

// Relative luminance
function luminance(hex: string): number {
	const c = hex.replace('#', '');
	const r = parseInt(c.substring(0, 2), 16) / 255;
	const g = parseInt(c.substring(2, 4), 16) / 255;
	const b = parseInt(c.substring(4, 6), 16) / 255;
	const srgb = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
	return 0.2126 * srgb[0]! + 0.7152 * srgb[1]! + 0.0722 * srgb[2]!;
}

export function getContrastRatio(foregroundHex: string, backgroundHex: string): number {
	const L1 = luminance(foregroundHex);
	const L2 = luminance(backgroundHex);
	const lighter = Math.max(L1, L2);
	const darker = Math.min(L1, L2);
	return (lighter + 0.05) / (darker + 0.05);
}

export function validateThemeContrast(): Array<{ pair: string; ratio: number; pass: boolean }> {
	const pairs: Array<[string, string]> = [
		[theme.light.primary, theme.light.primaryForeground],
		[theme.light.secondary, theme.light.secondaryForeground],
		[theme.light.accent, theme.light.accentForeground],
		[theme.light.destructive, theme.light.destructiveForeground],
		[theme.light.background, theme.light.foreground],
	];

	return pairs.map(([bg, fg]) => {
		const ratio = getContrastRatio(fg, bg);
		return {
			pair: `${fg} on ${bg}`,
			ratio: Number(ratio.toFixed(2)),
			pass: ratio >= 4.5,
		};
	});
}

export function logContrastReport(): void {
	const results = validateThemeContrast();
	const failures = results.filter((r) => !r.pass);
	if (failures.length > 0) {
		console.warn('[A11y] Contrast failures (need >= 4.5:1):', failures);
	} else {
		console.info('[A11y] All checked theme color pairs meet AA contrast.');
	}
}


