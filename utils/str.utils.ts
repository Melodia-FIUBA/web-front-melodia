/* eslint-disable @typescript-eslint/no-unused-vars */
export const titleCase = (s: string): string | undefined => {
    try {
        return s
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map(w => w[0]?.toLocaleUpperCase() + w.slice(1).toLocaleLowerCase())
            .join(' ');
    } catch (_) {
        return undefined;
    }
};