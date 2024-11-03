<script>
	export let title = '';
	export let image = ''; // Optional image URL
	export let sizeStyling = '';
</script>

<div
	class={'rounded-lg border border-black overflow-hidden shadow-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text hover:shadow-soft-glow ' +
		sizeStyling}
>
	<div class="p-6">
		{#if title}
			<h2 class="text-xl font-semibold mb-2">{title}</h2>
		{/if}
		<slot />
	</div>
</div>
