// Exports PNG logos, touch icons and favicon.ico from static/logo.svg.
// Run with `npm run icons` after editing the SVG.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const svg = await readFile('static/logo.svg');
const render = (size) => sharp(svg, { density: 72 * (size / 64) * 2 }).resize(size, size).png().toBuffer();

// Opaque square version for iOS, which rounds corners itself and shows transparency as black.
const squareSvg = Buffer.from(svg.toString().replace('rx="14"', 'rx="0"'));
const renderSquare = (size) =>
	sharp(squareSvg, { density: 72 * (size / 64) * 2 }).resize(size, size).png().toBuffer();

await mkdir('static/brand', { recursive: true });

const outputs = {
	'static/favicon-32.png': render(32),
	'static/apple-touch-icon.png': renderSquare(180),
	'static/icon-192.png': render(192),
	'static/icon-512.png': render(512),
	'static/brand/logo-256.png': render(256),
	'static/brand/logo-1024.png': render(1024)
};
for (const [path, buf] of Object.entries(outputs)) await writeFile(path, await buf);

// ICO with embedded PNGs (supported by all current browsers and Windows).
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(icoSizes.map(render));
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach((png, i) => {
	const e = 6 + 16 * i;
	header.writeUInt8(icoSizes[i], e);
	header.writeUInt8(icoSizes[i], e + 1);
	header.writeUInt16LE(1, e + 4);
	header.writeUInt16LE(32, e + 6);
	header.writeUInt32LE(png.length, e + 8);
	header.writeUInt32LE(offset, e + 12);
	offset += png.length;
});
await writeFile('static/favicon.ico', Buffer.concat([header, ...pngs]));

// Wordmarks: logo + "eDMS", for light and dark backgrounds.
// The dark-background version inverts the mark (white tile, black paper) so the tile stays visible.
const mark = svg.toString().replace(/<svg[^>]*>|<\/svg>/g, '');
const invertedMark = mark
	.replaceAll('#0a0a0a', '__INK__')
	.replaceAll('#fff"', '#0a0a0a"')
	.replaceAll('__INK__', '#fff')
	.replace('#d4d4d4', '#525252');
for (const [name, color, m] of [
	['logo-wordmark', '#0a0a0a', mark],
	['logo-wordmark-white', '#ffffff', invertedMark]
]) {
	const word = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 188 64" width="752" height="256">
		${m}
		<text x="78" y="45" font-family="Inter, 'Segoe UI', Arial, sans-serif" font-size="38" font-weight="700" letter-spacing="-0.5" fill="${color}">eDMS</text>
	</svg>`;
	await writeFile(`static/brand/${name}.svg`, word);
	await sharp(Buffer.from(word)).png().toFile(`static/brand/${name}.png`);
}

console.log('Icons written to static/ and static/brand/');
