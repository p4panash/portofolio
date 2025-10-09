<script>
	import Card from '$lib/Card.svelte';
	import Badge from '$lib/Badge.svelte';

	export let sizeStyling = '';
	export let onClick = () => {};
</script>

<Card title="Tech stack" {sizeStyling} clickable={true} {onClick}>
	<div class="flex flex-wrap gap-1">
		<Badge isExpandable={false} name="Ruby on Rails" />
		<Badge isExpandable={false} name="React" />
		<Badge isExpandable={false} name="Next.js" />
		<Badge isExpandable={false} name="Redux" />
		<Badge isExpandable={false} name="Sidekiq" />
		<Badge isExpandable={false} name="PostgreSQL" />
		<Badge isExpandable={false} name="Redis" />
	</div>
</Card>
