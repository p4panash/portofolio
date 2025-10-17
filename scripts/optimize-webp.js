import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STATIC_DIR = join(__dirname, '..', 'static');

async function getAllWebPImages(dir) {
	const images = [];
	const entries = await readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			images.push(...(await getAllWebPImages(fullPath)));
		} else {
			const ext = extname(entry.name).toLowerCase();
			// Skip already generated responsive images
			if (ext === '.webp' && !entry.name.match(/-\d+w\.webp$/)) {
				images.push(fullPath);
			}
		}
	}

	return images;
}

async function optimizeWebP(imagePath) {
	const dir = dirname(imagePath);
	const baseName = basename(imagePath, '.webp');
	const fileName = basename(imagePath);

	try {
		const originalStats = await stat(imagePath);
		const originalSize = originalStats.size;

		const image = sharp(imagePath);
		const metadata = await image.metadata();

		// Re-compress with better quality (75 instead of 85)
		const tempPath = join(dir, `${baseName}-temp.webp`);
		await sharp(imagePath).webp({ quality: 75, effort: 6 }).toFile(tempPath);

		// Replace original
		await sharp(tempPath).toFile(imagePath);

		// Clean up temp
		const fs = await import('fs/promises');
		await fs.unlink(tempPath);

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
			const responsivePath = join(dir, `${baseName}${size.suffix}.webp`);
			await sharp(imagePath)
				.resize(size.width, null, { withoutEnlargement: true })
				.webp({ quality: 75, effort: 6 })
				.toFile(responsivePath);
		}

		const newStats = await stat(imagePath);
		const newSize = newStats.size;
		const savings = (((originalSize - newSize) / originalSize) * 100).toFixed(2);

		console.log(
			`✓ ${fileName}: ${(originalSize / 1024).toFixed(2)}KB → ${(newSize / 1024).toFixed(2)}KB (saved ${savings}%)${sizes.length > 0 ? ` + ${sizes.length} responsive sizes` : ''}`
		);

		return { originalSize, newSize, responsiveSizes: sizes.length };
	} catch (error) {
		console.error(`✗ Failed to optimize ${fileName}:`, error.message);
		throw error;
	}
}

async function main() {
	console.log('🔍 Finding WebP images in static folder...\n');
	const images = await getAllWebPImages(STATIC_DIR);

	console.log(`Found ${images.length} images to optimize:\n`);

	let totalOriginalSize = 0;
	let totalNewSize = 0;
	let totalResponsiveImages = 0;

	for (const imagePath of images) {
		const result = await optimizeWebP(imagePath);
		totalOriginalSize += result.originalSize;
		totalNewSize += result.newSize;
		totalResponsiveImages += result.responsiveSizes;
	}

	const totalSavings = (((totalOriginalSize - totalNewSize) / totalOriginalSize) * 100).toFixed(2);

	console.log(`\n✨ Optimization complete!`);
	console.log(
		`📊 Total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB → ${(totalNewSize / 1024 / 1024).toFixed(2)}MB`
	);
	console.log(
		`💾 Total saved: ${totalSavings}% (${((totalOriginalSize - totalNewSize) / 1024 / 1024).toFixed(2)}MB)`
	);
	console.log(`📱 Generated ${totalResponsiveImages} responsive image variants`);
}

main().catch(console.error);
