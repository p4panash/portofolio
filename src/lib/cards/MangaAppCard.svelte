<script>
	import Card from '$lib/Card.svelte';
	import Badge from '$lib/Badge.svelte';
	import OptimizedImage from '$lib/OptimizedImage.svelte';

	export let sizeStyling = '';
	export let onClick = () => {};
</script>

<Card
	title="Manga App"
	hiddenTitle={true}
	clickable={true}
	{sizeStyling}
	{onClick}
	background="bg-gradient-to-br from-rose-200/80 to-purple-200/80 dark:from-rose-900/40 dark:to-purple-900/40"
	testId="project-card-manga-app"
>
	<!-- Decorative shapes -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div
			class="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-rose-300/40 dark:bg-rose-700/20"
		></div>
	</div>

	<!-- Badge section shape - mostly outside, partially covering badges -->
	<div
		class="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-purple-300/40 dark:bg-purple-700/25 pointer-events-none"
	></div>

	<div
		class="absolute -top-4 -right-8 w-4/5 h-full flex items-start justify-end pointer-events-none overflow-visible z-10"
	>
		<OptimizedImage
			src="/images/projects/manga-app.png"
			alt="Manga App Screenshot"
			width={800}
			height={600}
			className="w-full h-full object-cover transform rotate-12 transition-transform duration-300 rounded-xl"
		/>
	</div>
	<div class="flex flex-wrap gap-1 relative z-20">
		<Badge name="React Native" />
		<Badge name="Tailwind" />
		<Badge name="Yarn" />
	</div>
</Card>
