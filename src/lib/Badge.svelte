<script lang="ts">
	import { icons } from './constants';
	import { darkMode } from './stores/theme';

	export let name = '';
	export let gradientBackground = false;
	export let isExpandable = true;

	const [Icon, color, background] = icons.get(name.toLowerCase()) || [];

	let isExpanded = false;
	let isDarkMode = false;

	darkMode.subscribe((value) => {
		isDarkMode = value;
	});

	const expand = (e: MouseEvent) => {
		if (!isExpandable) return;

		e.stopPropagation();
		isExpanded = !isExpanded;
	};

	// Make black icons white in dark mode
	$: iconColor = isDarkMode && (color === '#000000' || color === '#181717') ? '#FFFFFF' : color;
</script>

<button
	class={'cursor-pointer rounded shadow flex p-1 justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ' +
		(gradientBackground ? background : '')}
	on:click={expand}
	aria-label={isExpandable ? `${name} (click to ${isExpanded ? 'collapse' : 'expand'})` : name}
>
	<div class="flex gap-2">
		{#if Icon}
			<Icon size={24} color={iconColor} />
		{/if}
		{#if isExpanded}
			<span class="text-gray-100 dark:text-gray-200 font-medium">
				{name}
			</span>
		{/if}
	</div>
</button>
