<script lang="ts">
	export let src: string;
	export let alt: string;
	export let width: number | string = '';
	export let height: number | string = '';
	export let className: string = '';
	export let loading: 'lazy' | 'eager' = 'lazy';
	export let fetchpriority: 'high' | 'low' | 'auto' = 'auto';

	// For now, we'll use standard img tags with optimized attributes
	// When images are processed through vite-imagetools, this component
	// can be extended to use <picture> elements with multiple formats
</script>

<img {src} {alt} {width} {height} {loading} {fetchpriority} class={className} decoding="async" />
