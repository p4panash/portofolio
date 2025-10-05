<script>
	import Card from '$lib/Card.svelte';
	import Badge from '$lib/Badge.svelte';

	export let sizeStyling = '';
</script>

<Card title="Tech stack" {sizeStyling} clickable={true}>
	<div class="flex flex-wrap gap-1">
		<Badge isExpandable={false} name="React" />
		<Badge isExpandable={false} name="Next.js" />
		<Badge isExpandable={false} name="Redux" />
		<Badge isExpandable={false} name="Ruby on Rails" />
		<Badge isExpandable={false} name="PostgreSQL" />
		<Badge isExpandable={false} name="Redis" />
		<Badge isExpandable={false} name="Sidekiq" />
	</div>
</Card>
