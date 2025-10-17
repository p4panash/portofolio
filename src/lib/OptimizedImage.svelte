<script lang="ts">
	export let src: string;
	export let alt: string;
	export let width: number | string = '';
	export let height: number | string = '';
	export let className: string = '';
	export let loading: 'lazy' | 'eager' = 'lazy';
	export let fetchpriority: 'high' | 'low' | 'auto' = 'auto';

	// Generate srcset for responsive images
	// Note: We generate a conservative srcset. The browser will only load what exists.
	// Large images (photos) have: 640w, 960w, 1280w, 1920w
	// Medium images (projects) may have: 640w, 960w
	export let responsiveSizes: number[] = [];
	export let sizes: string = ''; // Allow custom sizes attribute

	function generateSrcset(src: string, responsiveSizes: number[]): string {
		if (!src.endsWith('.webp') || responsiveSizes.length === 0) return '';

		const baseSrc = src.replace('.webp', '');
		const srcsetParts = responsiveSizes.map((size) => `${baseSrc}-${size}w.webp ${size}w`);

		return srcsetParts.join(', ');
	}

	$: srcset = generateSrcset(src, responsiveSizes);
	// If sizes not provided, generate a reasonable default based on common layouts
	$: computedSizes =
		sizes || (srcset ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw' : '');
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
