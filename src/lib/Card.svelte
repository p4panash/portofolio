<script>
	export let title = '';
	export let image = ''; // Optional image URL
	export let sizeStyling = '';
	export let background = 'bg-light-bg dark:bg-dark-bg';
</script>

<div
	class={'rounded-lg border overflow-hidden shadow-lg  text-light-text dark:text-dark-text hover:shadow-soft-glow ' +
		sizeStyling +
		' ' +
		background}
>
	<div class="p-5 w-full h-full flex flex-col justify-end">
		<slot />
		{#if title}
			<h2 class="text-xl font-semibold mt-2">{title}</h2>
		{/if}
	</div>
</div>
