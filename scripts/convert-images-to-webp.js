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
	const baseOutputPath = imagePath.replace(new RegExp(`${ext}$`), '');
	const fileName = basename(imagePath);

	try {
		const stats = await stat(imagePath);
		const originalSize = stats.size;
		const image = sharp(imagePath);
		const metadata = await image.metadata();

		// Convert with better compression (quality 75)
		const outputPath = `${baseOutputPath}.webp`;
		await sharp(imagePath).webp({ quality: 75, effort: 6 }).toFile(outputPath);

		// Generate responsive sizes for larger images
		const sizes = [];
		if (metadata.width > 1200) {
			sizes.push(
				{ width: 640, suffix: '-640w' },
				{ width: 960, suffix: '-960w' },
				{ width: 1280, suffix: '-1280w' },
				{ width: 1920, suffix: '-1920w' }
			);
		} else if (metadata.width > 800) {
			sizes.push({ width: 640, suffix: '-640w' }, { width: 960, suffix: '-960w' });
		}

		// Generate responsive versions
		for (const size of sizes) {
			const responsivePath = `${baseOutputPath}${size.suffix}.webp`;
			await sharp(imagePath)
				.resize(size.width, null, { withoutEnlargement: true })
				.webp({ quality: 75, effort: 6 })
				.toFile(responsivePath);
		}

		const newStats = await stat(outputPath);
		const newSize = newStats.size;
		const savings = (((originalSize - newSize) / originalSize) * 100).toFixed(2);

		console.log(
			`✓ ${fileName} → ${basename(outputPath)} (${(originalSize / 1024).toFixed(2)}KB → ${(newSize / 1024).toFixed(2)}KB, saved ${savings}%)${sizes.length > 0 ? ` + ${sizes.length} responsive sizes` : ''}`
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
