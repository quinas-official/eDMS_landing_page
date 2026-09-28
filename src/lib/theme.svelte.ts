// Light / dark / system theme. The initial class is set by the inline script in app.html
// before first paint; this module keeps it in sync afterwards.

export type ThemeChoice = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';
const THEME_COLORS = { light: '#ffffff', dark: '#0a0a0a' };

export const theme = $state<{ choice: ThemeChoice }>({ choice: 'system' });

const systemDark = () => matchMedia('(prefers-color-scheme: dark)').matches;

function apply() {
	const dark = theme.choice === 'dark' || (theme.choice === 'system' && systemDark());
	document.documentElement.classList.toggle('dark', dark);
	document
		.querySelector('meta[name="theme-color"]')
		?.setAttribute('content', dark ? THEME_COLORS.dark : THEME_COLORS.light);
}

let started = false;

/** Reads the saved choice and follows OS changes while "system" is selected. Call once on mount. */
export function initTheme() {
	if (started) return;
	started = true;
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved === 'light' || saved === 'dark') theme.choice = saved;
	} catch {
		// Storage unavailable (private mode): fall back to the system setting.
	}
	apply();
	matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		if (theme.choice === 'system') apply();
	});
}

export function setTheme(choice: ThemeChoice) {
	theme.choice = choice;
	try {
		if (choice === 'system') localStorage.removeItem(STORAGE_KEY);
		else localStorage.setItem(STORAGE_KEY, choice);
	} catch {
		// The choice still applies for this visit.
	}
	apply();
}
