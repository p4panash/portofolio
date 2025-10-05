<script lang="ts">
	import Card from '$lib/Card.svelte';
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';

	export let sizeStyling = '';

	let mapContainer: HTMLDivElement;

	onMount(() => {
		mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;

		const isDark = document.documentElement.classList.contains('dark');

		const map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/standard',
			center: [23.6, 46.76],
			zoom: 10.5,
			interactive: false,
			config: {
				basemap: {
					lightPreset: isDark ? 'night' : 'day'
				}
			}
		});

		// Wait for map to load, then add custom marker
		map.on('load', () => {
			// Create custom marker element
			const el = document.createElement('div');
			el.className = 'custom-marker';
			el.innerHTML = `
				<div class="relative">
					<div class="w-20 h-20 bg-blue-500 bg-opacity-40 rounded-full shadow-lg flex items-center justify-center border-2 border-white">
						<span class="text-4xl">💻</span>
					</div>
				</div>
			`;

			new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat([23.556, 46.754]).addTo(map);
		});

		// Watch for dark mode changes
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === 'class') {
					const isDark = document.documentElement.classList.contains('dark');
					map.setConfigProperty('basemap', 'lightPreset', isDark ? 'night' : 'day');
				}
			});
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});

		return () => {
			observer.disconnect();
			map.remove();
		};
	});
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<Card {sizeStyling} noPadding>
	<div class="relative w-full h-full rounded-lg overflow-hidden min-h-[200px]">
		<div bind:this={mapContainer} class="w-full h-full" />
	</div>
</Card>
