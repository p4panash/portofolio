<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { icons } from './constants';
	import { darkMode } from './stores/theme';

	export let name = '';
	export let gradientBackground = false;
	export let isExpandable = true;

	const [Icon, color, background] = icons.get(name.toLowerCase()) || [];

	let isExpanded = false;
	let mounted = false;

	// Defer rendering badges until after mount to improve initial paint
	onMount(() => {
		mounted = true;
	});

	const expand = (e: MouseEvent) => {
		if (!isExpandable) return;

		e.stopPropagation();
		isExpanded = !isExpanded;
	};

	// Use the $ prefix to auto-subscribe/unsubscribe properly for SSR
	// Make black icons white in dark mode
	$: iconColor = $darkMode && (color === '#000000' || color === '#181717') ? '#FFFFFF' : color;
</script>

{#if mounted}
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
{:else}
	<!-- Placeholder with fixed dimensions to prevent layout shift -->
	<div
		class="w-[40px] h-[40px] rounded shadow bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
		aria-hidden="true"
	></div>
{/if}
