<script lang="ts">
	import Card from '$lib/Card.svelte';
	import { onMount } from 'svelte';
	import mapboxgl from 'mapbox-gl';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';

	export let sizeStyling = '';

	let mapContainer: HTMLDivElement;
	let map: mapboxgl.Map;
	let canZoomIn = false;
	let canZoomOut = true;
	let markerElement: HTMLElement | null = null;

	const INITIAL_ZOOM = 10.5;
	const MIN_ZOOM = 3; // Europe-wide view
	const MAX_ZOOM = INITIAL_ZOOM;
	const ZOOM_OUT_CLICKS_FOR_SMALL_MARKER = 3; // Number of zoom-out clicks before marker shrinks
	const SMALL_MARKER_THRESHOLD = INITIAL_ZOOM - ZOOM_OUT_CLICKS_FOR_SMALL_MARKER; // ~7.5

	const updateMarkerSize = () => {
		if (map && markerElement) {
			const currentZoom = map.getZoom();
			const markerCircle = markerElement.querySelector('.marker-circle');

			if (markerCircle) {
				if (currentZoom <= SMALL_MARKER_THRESHOLD) {
					// Smaller radius after 3 zoom-out clicks
					markerCircle.classList.remove('w-20', 'h-20');
					markerCircle.classList.add('w-12', 'h-12');
				} else {
					// Larger radius at initial/closer zoom
					markerCircle.classList.remove('w-12', 'h-12');
					markerCircle.classList.add('w-20', 'h-20');
				}
			}
		}
	};

	const updateZoomButtons = () => {
		if (map) {
			const currentZoom = map.getZoom();
			canZoomIn = currentZoom < MAX_ZOOM;
			canZoomOut = currentZoom > MIN_ZOOM;
		}
	};

	const onZoomChange = () => {
		updateZoomButtons();
		updateMarkerSize();
	};

	const zoomIn = () => {
		if (map && canZoomIn) {
			map.zoomIn();
		}
	};

	const zoomOut = () => {
		if (map && canZoomOut) {
			map.zoomOut();
		}
	};

	onMount(() => {
		mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;

		const isDark = document.documentElement.classList.contains('dark');

		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/standard',
			center: [23.6, 46.77],
			zoom: INITIAL_ZOOM,
			minZoom: MIN_ZOOM,
			maxZoom: INITIAL_ZOOM,
			interactive: false,
			config: {
				basemap: {
					lightPreset: isDark ? 'night' : 'day'
				}
			}
		});

		map.on('zoom', onZoomChange);

		// Wait for map to load, then add custom marker
		map.on('load', () => {
			// Create custom marker element
			const el = document.createElement('div');
			el.className = 'custom-marker';
			el.innerHTML = `
				<div class="relative">
					<div class="marker-circle w-20 h-20 bg-blue-500 bg-opacity-40 rounded-full shadow-lg flex items-center justify-center border-2 border-white transition-all duration-300">
						<span class="text-3xl">👨🏼‍💻</span>
					</div>
				</div>
			`;

			markerElement = el;
			new mapboxgl.Marker({ element: el, anchor: 'center' }).setLngLat([23.556, 46.754]).addTo(map);

			// Set initial marker size based on zoom level
			updateMarkerSize();
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

		<!-- Zoom Controls -->
		<div class="absolute top-3 right-3 flex flex-col gap-2">
			<button
				on:click={zoomIn}
				disabled={!canZoomIn}
				class="w-10 h-10 bg-white dark:bg-dark-bg bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center transition-all border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-opacity-100 dark:hover:bg-opacity-100 disabled:hover:bg-opacity-80 disabled:dark:hover:bg-opacity-80"
				aria-label="Zoom in"
			>
				<span class="text-xl font-bold text-gray-700 dark:text-gray-200">+</span>
			</button>
			<button
				on:click={zoomOut}
				disabled={!canZoomOut}
				class="w-10 h-10 bg-white dark:bg-dark-bg bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center transition-all border border-gray-200 dark:border-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-opacity-100 dark:hover:bg-opacity-100 disabled:hover:bg-opacity-80 disabled:dark:hover:bg-opacity-80"
				aria-label="Zoom out"
			>
				<span class="text-xl font-bold text-gray-700 dark:text-gray-200">−</span>
			</button>
		</div>
	</div>
</Card>
