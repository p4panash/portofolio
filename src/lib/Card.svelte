<script>
	import NewTab from './svgs/NewTab.svelte';

	export let title = '';
	export let sizeStyling = '';
	export let background = 'bg-light-bg dark:bg-dark-bg';
	export let hiddenTitle = false;
	export let clickable = false;
	export let index = 1;
	export let noPadding = false;

	let isFocused = hiddenTitle ? false : true;

	const changeFocus = () => {
		if (!hiddenTitle) return;

		isFocused = !isFocused;
	};
</script>

<div
	role="textbox"
	tabindex={index}
	on:mouseenter={changeFocus}
	on:mouseleave={changeFocus}
	class={'rounded-lg border overflow-hidden shadow-lg text-light-text dark:text-dark-text ' +
		sizeStyling +
		' ' +
		`${clickable ? 'hover:shadow-soft-glow cursor-pointer hover:border-vivid-blue ' : ''}` +
		background}
>
	<div class="{noPadding ? '' : 'p-5'} w-full h-full flex flex-col justify-end relative">
		<slot />
		{#if title && !hiddenTitle}
			<h2 class="text-xl font-semibold mt-2">{title}</h2>
		{/if}
		{#if hiddenTitle && isFocused}
			<div
				class="flex items-center gap-2 absolute right-3 top-2 rounded-lg border bg-light-bg dark:bg-dark-bg py-1 px-2"
			>
				<span class="font-semibold whitespace-nowrap">{title}</span>
				<NewTab size={18} />
			</div>
		{/if}
	</div>
</div>
