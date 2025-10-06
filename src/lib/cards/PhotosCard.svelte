<script lang="ts">
	import Card from '$lib/Card.svelte';
	import Carousel from '$lib/Carousel.svelte';

	export let sizeStyling = '';

	// Placeholder images - will be replaced with actual photos
	const placeholderImages = [
		'/images/photos/placeholder-1.jpg',
		'/images/photos/placeholder-2.jpg',
		'/images/photos/placeholder-3.jpg',
		'/images/photos/placeholder-4.jpg',
		'/images/photos/placeholder-5.jpg'
	];
</script>

<Card {sizeStyling} noPadding>
	<div class="relative w-full h-full rounded-lg overflow-hidden min-h-[200px]">
		<Carousel images={placeholderImages} autoPlayInterval={5000} />
	</div>
</Card>
