<script lang="ts">
	import OptimizedImage from '$lib/OptimizedImage.svelte';

	export let images: string[] = [];
	export let autoPlayInterval: number = 5000; // 5 seconds default
	export let responsiveSizes: number[] = [];
	export let imageSizes: string = ''; // Custom sizes attribute for responsive images

	let currentIndex = 0;
	let isExpanded = false;
	let autoPlayTimer: ReturnType<typeof setInterval> | null = null;

	const goToSlide = (index: number) => {
		currentIndex = index;
		resetAutoPlay();
	};

	const nextSlide = () => {
		currentIndex = (currentIndex + 1) % images.length;
		resetAutoPlay();
	};

	const prevSlide = () => {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
		resetAutoPlay();
	};

	const resetAutoPlay = () => {
		if (autoPlayTimer) {
			clearInterval(autoPlayTimer);
		}
		startAutoPlay();
	};

	const startAutoPlay = () => {
		autoPlayTimer = setInterval(() => {
			currentIndex = (currentIndex + 1) % images.length;
		}, autoPlayInterval);
	};

	const toggleExpand = () => {
		isExpanded = !isExpanded;
		if (isExpanded) {
			// Focus the modal when it opens to enable keyboard events
			setTimeout(() => {
				const modal = document.querySelector('[role="dialog"]');
				if (modal instanceof HTMLElement) {
					modal.focus();
				}
			}, 0);
		}
	};

	const closeExpanded = () => {
		isExpanded = false;
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (!isExpanded) return;

		if (e.key === 'Escape') {
			closeExpanded();
		} else if (e.key === 'ArrowLeft') {
			prevSlide();
		} else if (e.key === 'ArrowRight') {
			nextSlide();
		}
	};

	$: if (images.length > 0) {
		startAutoPlay();
	}
</script>

<div class="relative w-full h-full overflow-hidden rounded-lg">
	<!-- Images -->
	<div class="relative w-full h-full">
		{#each images as image, index}
			<button
				on:click={toggleExpand}
				class="absolute inset-0 transition-opacity duration-500 {currentIndex === index
					? 'opacity-100'
					: 'opacity-0'} cursor-pointer"
				aria-label="Expand image"
			>
				<OptimizedImage
					src={image}
					alt="Carousel slide {index + 1}"
					width={800}
					height={600}
					loading={index === 0 ? 'eager' : 'lazy'}
					className="w-full h-full object-cover"
					{responsiveSizes}
					sizes={imageSizes}
				/>
			</button>
		{/each}
	</div>

	<!-- Navigation Controls -->
	{#if images.length > 1}
		<!-- Previous Button -->
		<button
			on:click={prevSlide}
			class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-dark-bg bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all border border-gray-200 dark:border-gray-700 hover:bg-opacity-100 dark:hover:bg-opacity-100"
			aria-label="Previous slide"
		>
			<span class="text-xl font-bold text-gray-700 dark:text-gray-200">‹</span>
		</button>

		<!-- Next Button -->
		<button
			on:click={nextSlide}
			class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white dark:bg-dark-bg bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all border border-gray-200 dark:border-gray-700 hover:bg-opacity-100 dark:hover:bg-opacity-100"
			aria-label="Next slide"
		>
			<span class="text-xl font-bold text-gray-700 dark:text-gray-200">›</span>
		</button>

		<!-- Dots Indicators -->
		<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
			<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
			{#each images as _image, index (index)}
				<button
					on:click={() => goToSlide(index)}
					class="w-2 h-2 rounded-full transition-all border border-white dark:border-gray-400 {currentIndex ===
					index
						? 'bg-white dark:bg-gray-900/80 w-6'
						: 'bg-white dark:bg-gray-900/80 bg-opacity-50 dark:bg-opacity-50'}"
					aria-label="Go to slide {index + 1}"
				/>
			{/each}
		</div>
	{/if}
</div>

<!-- Expanded Image Modal -->
{#if isExpanded}
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div
		class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
		on:click={closeExpanded}
		on:keydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="0"
	>
		<button
			on:click={closeExpanded}
			class="absolute top-4 right-4 w-12 h-12 bg-white dark:bg-dark-bg bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center transition-all border border-gray-200 dark:border-gray-700 hover:bg-opacity-100 dark:hover:bg-opacity-100"
			aria-label="Close expanded view"
		>
			<span class="text-2xl font-bold text-gray-700 dark:text-gray-200">×</span>
		</button>

		<div on:click|stopPropagation role="presentation">
			<OptimizedImage
				src={images[currentIndex]}
				alt="Expanded view of slide {currentIndex + 1}"
				className="max-w-[90vw] max-h-[90vh] object-contain"
				loading="eager"
				{responsiveSizes}
				sizes="90vw"
			/>
		</div>

		{#if images.length > 1}
			<!-- Previous Button -->
			<button
				on:click|stopPropagation={prevSlide}
				class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-dark-bg bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all border border-gray-200 dark:border-gray-700 hover:bg-opacity-100 dark:hover:bg-opacity-100"
				aria-label="Previous slide"
			>
				<span class="text-2xl font-bold text-gray-700 dark:text-gray-200">‹</span>
			</button>

			<!-- Next Button -->
			<button
				on:click|stopPropagation={nextSlide}
				class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-dark-bg bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all border border-gray-200 dark:border-gray-700 hover:bg-opacity-100 dark:hover:bg-opacity-100"
				aria-label="Next slide"
			>
				<span class="text-2xl font-bold text-gray-700 dark:text-gray-200">›</span>
			</button>
		{/if}
	</div>
{/if}
