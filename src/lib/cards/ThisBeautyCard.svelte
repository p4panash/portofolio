<script>
	import Card from '$lib/Card.svelte';
	import Badge from '$lib/Badge.svelte';
	import OptimizedImage from '$lib/OptimizedImage.svelte';

	export let sizeStyling = '';
	export let onClick = () => {};
</script>

<Card
	title="This beauty"
	hiddenTitle={true}
	clickable={true}
	{sizeStyling}
	{onClick}
	background="bg-gradient-to-br from-violet-200/80 to-fuchsia-200/80 dark:from-violet-900/40 dark:to-fuchsia-900/40"
	testId="project-card-this-beauty"
>
	<!-- Decorative shapes -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div
			class="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-fuchsia-300/40 dark:bg-fuchsia-700/20"
		></div>
	</div>

	<!-- Badge section shape - mostly outside, partially covering badges -->
	<div
		class="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-violet-300/40 dark:bg-violet-700/25 pointer-events-none"
	></div>

	<div
		class="absolute -top-20 -right-20 w-[130%] h-[130%] flex items-start justify-end pointer-events-none overflow-visible z-10"
	>
		<OptimizedImage
			src="/images/projects/this-beauty.webp"
			alt="This Beauty Screenshot"
			width={800}
			height={600}
			loading={'eager'}
			className="w-full h-full object-contain transform rotate-12 transition-transform duration-300 rounded-xl"
			responsiveSizes={[640, 960, 1280, 1920]}
			sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
		/>
	</div>
	<div class="flex gap-1 relative z-20">
		<Badge name="Svelte" />
		<Badge name="Tailwind" />
		<Badge name="Pnpm" />
		<Badge name="Claude Code" />
	</div>
</Card>
