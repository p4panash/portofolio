<script>
	import Card from '$lib/Card.svelte';
	import Badge from '$lib/Badge.svelte';

	export let sizeStyling = '';
	export let onClick = () => {};
</script>

<Card
	title="Imi Permit"
	hiddenTitle={true}
	clickable={true}
	{sizeStyling}
	{onClick}
	background="bg-gradient-to-tl from-pink-400 to-indigo-400"
>
	<div class="flex flex-wrap gap-1">
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
