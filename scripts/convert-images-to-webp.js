import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STATIC_DIR = join(__dirname, '..', 'static');

async function getAllImages(dir) {
	const images = [];
	const entries = await readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			images.push(...(await getAllImages(fullPath)));
		} else {
			const ext = extname(entry.name).toLowerCase();
			if (['.png', '.jpg', '.jpeg'].includes(ext)) {
				images.push(fullPath);
			}
		}
	}

	return images;
}

async function convertToWebP(imagePath) {
	const ext = extname(imagePath);
	const outputPath = imagePath.replace(new RegExp(`${ext}$`), '.webp');
	const fileName = basename(imagePath);

	try {
		const stats = await stat(imagePath);
		const originalSize = stats.size;

		await sharp(imagePath).webp({ quality: 85, effort: 6 }).toFile(outputPath);

		const newStats = await stat(outputPath);
		const newSize = newStats.size;
		const savings = (((originalSize - newSize) / originalSize) * 100).toFixed(2);

		console.log(
			`✓ ${fileName} → ${basename(outputPath)} (${(originalSize / 1024).toFixed(2)}KB → ${(newSize / 1024).toFixed(2)}KB, saved ${savings}%)`
		);

		return { originalPath: imagePath, outputPath, originalSize, newSize };
	} catch (error) {
		console.error(`✗ Failed to convert ${fileName}:`, error.message);
		throw error;
	}
}

async function main() {
	console.log('🔍 Searching for images in static folder...\n');
	const images = await getAllImages(STATIC_DIR);

	console.log(`Found ${images.length} images to convert:\n`);

	let totalOriginalSize = 0;
	let totalNewSize = 0;

	for (const imagePath of images) {
		const result = await convertToWebP(imagePath);
		totalOriginalSize += result.originalSize;
		totalNewSize += result.newSize;
	}

	const totalSavings = (((totalOriginalSize - totalNewSize) / totalOriginalSize) * 100).toFixed(2);

	console.log(`\n✨ Conversion complete!`);
	console.log(
		`📊 Total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB → ${(totalNewSize / 1024 / 1024).toFixed(2)}MB`
	);
	console.log(
		`💾 Total saved: ${totalSavings}% (${((totalOriginalSize - totalNewSize) / 1024 / 1024).toFixed(2)}MB)`
	);
}

main().catch(console.error);
