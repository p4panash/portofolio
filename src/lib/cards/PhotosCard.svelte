<script lang="ts">
	import Card from '$lib/Card.svelte';
	import Carousel from '$lib/Carousel.svelte';

	export let sizeStyling = '';

	// Placeholder images - will be replaced with actual photos
	const images = [
		'/images/photos/1.webp',
		'/images/photos/2.webp',
		'/images/photos/3.webp',
		'/images/photos/4.webp',
		'/images/photos/5.webp',
		'/images/photos/6.webp'
	];
</script>

<Card {sizeStyling} noPadding>
	<div class="relative w-full h-full rounded-lg overflow-hidden min-h-[200px]">
		<Carousel {images} autoPlayInterval={5000} />
	</div>
</Card>
