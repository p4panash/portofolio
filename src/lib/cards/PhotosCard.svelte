<script lang="ts">
	import Card from '$lib/Card.svelte';
	import Carousel from '$lib/Carousel.svelte';

	export let sizeStyling = '';

	// Placeholder images - will be replaced with actual photos
	const images = [
		'/images/photos/1.jpeg',
		'/images/photos/2.jpeg',
		'/images/photos/3.jpeg',
		'/images/photos/4.jpeg',
		'/images/photos/5.jpeg',
		'/images/photos/6.jpg'
	];
</script>

<Card {sizeStyling} noPadding>
	<div class="relative w-full h-full rounded-lg overflow-hidden min-h-[200px]">
		<Carousel {images} autoPlayInterval={5000} />
	</div>
</Card>
