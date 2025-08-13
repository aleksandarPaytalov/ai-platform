'use client';

import { useEffect } from 'react';

// Dev-only accessibility initializer
export default function AxeA11y() {
	useEffect(() => {
		if (process.env.NODE_ENV !== 'development') return;
		let cleanup: (() => void) | undefined;
		(async () => {
			try {
				const ReactAxe = await import('@axe-core/react');
				const ReactLib = await import('react');
				const ReactDOM = await import('react-dom');
				// React 19 exposes createElement as a getter; skip if not writable
				const desc = Object.getOwnPropertyDescriptor(ReactLib, 'createElement');
				if (desc && desc.writable !== true) {
					console.info('[A11y] Skipping axe-core/react init (React.createElement is not writable in this React version).');
					return;
				}
				// Initialize axe with default rules, 1s debounce
				(ReactAxe as any).default(ReactLib, ReactDOM, 1000);
				cleanup = () => {
					// no built-in dispose; rely on page reload between dev sessions
				};
			} catch (err) {
				console.warn('axe-core/react not available:', err);
			}
		})();
		return () => {
			if (cleanup) cleanup();
		};
	}, []);

	return null;
}


