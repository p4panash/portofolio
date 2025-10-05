<script>
	import Card from '$lib/Card.svelte';
	import Badge from '$lib/Badge.svelte';

	export let sizeStyling = '';
</script>

<Card
	title="This beauty"
	hiddenTitle={true}
	clickable={true}
	{sizeStyling}
	background="bg-gradient-to-tl from-violet-500 to-fuchsia-500"
>
	<div class="flex gap-1">
		<Badge name="Svelte" />
		<Badge name="Tailwind" />
		<Badge name="Pnpm" />
	</div>
</Card>
