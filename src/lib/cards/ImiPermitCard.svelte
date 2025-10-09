<script>
	import Card from '$lib/Card.svelte';
	import Badge from '$lib/Badge.svelte';
	import OptimizedImage from '$lib/OptimizedImage.svelte';

	export let sizeStyling = '';
	export let onClick = () => {};
</script>

<Card
	title="Imi Permit"
	hiddenTitle={true}
	clickable={true}
	{sizeStyling}
	{onClick}
	background="bg-gradient-to-br from-pink-200/80 to-indigo-200/80 dark:from-pink-900/40 dark:to-indigo-900/40"
	testId="project-card-imi-permit"
>
	<!-- Decorative shapes -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none">
		<div
			class="absolute top-12 -left-20 w-64 h-64 rounded-full bg-pink-300/40 dark:bg-pink-700/20"
		></div>
	</div>

	<!-- Badge section shape - mostly outside, partially covering badges -->
	<div
		class="absolute -bottom-[24rem] -left-[3rem] w-[32rem] h-[32rem] rounded-full bg-indigo-300/40 dark:bg-indigo-700/25 pointer-events-none"
	></div>

	<div
		class="absolute -top-4 -right-16 w-full h-4/5 flex items-start justify-end pointer-events-none overflow-visible z-10"
	>
		<OptimizedImage
			src="/images/projects/imi-permit.png"
			alt="Imi Permit Screenshot"
			width={800}
			height={600}
			className="w-full h-full object-cover transform rotate-12 transition-transform duration-300 rounded-xl"
		/>
	</div>
	<div class="flex flex-wrap gap-1 relative z-20">
		<Badge name="Next.js" />
		<Badge name="i18next" />
		<Badge name="Jest" />
		<Badge name="Ruby on Rails" />
		<Badge name="Sidekiq" />
		<Badge name="Redis" />
		<Badge name="PostgreSQL" />
		<Badge name="GitHub CI" />
		<Badge name="Vercel" />
		<Badge name="Dokku" />
	</div>
</Card>
