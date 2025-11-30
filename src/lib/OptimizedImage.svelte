<script lang="ts">
	export let src: string;
	export let alt: string;
	export let width: number | string = '';
	export let height: number | string = '';
	export let className: string = '';
	export let loading: 'lazy' | 'eager' = 'lazy';
	export let fetchpriority: 'high' | 'low' | 'auto' = 'auto';
	export let sizes: string = ''; // Optional override for custom sizes attribute

	// Auto-generate srcset for responsive images
	// Assumes standard sizes [640w, 960w, 1280w, 1920w] exist for all .webp images
	function generateSrcset(src: string): string {
		if (!src.endsWith('.webp')) return '';

		const baseSrc = src.replace('.webp', '');
		const standardSizes = [640, 960, 1280, 1920];
		const srcsetParts = standardSizes.map((size) => `${baseSrc}-${size}w.webp ${size}w`);

		return srcsetParts.join(', ');
	}

	$: srcset = generateSrcset(src);
	// Default sizes: full width on mobile (≤768px), ~1/3 width on desktop
	// This matches typical card layouts in the portfolio
	$: computedSizes = sizes || (srcset ? '(max-width: 768px) 100vw, 33vw' : '');
</script>

<img
	{src}
	{srcset}
	sizes={computedSizes}
	{alt}
	{width}
	{height}
	{loading}
	{fetchpriority}
	class={className}
	decoding="async"
/>
