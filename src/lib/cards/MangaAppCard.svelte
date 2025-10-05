<script>
	import Card from '$lib/Card.svelte';
	import Badge from '$lib/Badge.svelte';

	export let sizeStyling = '';
</script>

<Card
	title="Manga App"
	hiddenTitle={true}
	clickable={true}
	{sizeStyling}
	background="bg-gradient-to-tl from-rose-500 to-purple-500"
>
	<div class="flex flex-wrap gap-1">
		<Badge name="React Native" />
		<Badge name="Tailwind" />
		<Badge name="Yarn" />
	</div>
</Card>
