<script>
	import { icons } from './constants';

	export let name = '';
	export let gradientBackground = false;
	export let isExpandable = true;

	const [Icon, color, background] = icons.get(name.toLowerCase()) || [];

	let isExpanded = false;

	const expand = (e) => {
		if (!isExpandable) return;

		e.stopPropagation();
		isExpanded = !isExpanded;
	};
</script>

<button
	class={'cursor-pointer rounded shadow flex p-1 justify-center' +
		(gradientBackground ? background : '')}
	on:click={expand}
>
	<div class="flex gap-2">
		{#if Icon}
			<Icon size={24} {color} />
		{/if}
		{#if isExpanded}
			<span class="text-gray-100 dark:text-gray-200 font-medium">
				{name}
			</span>
		{/if}
	</div>
</button>
