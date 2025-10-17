<script>
	import NewTab from './svgs/NewTab.svelte';

	export let title = '';
	export let sizeStyling = '';
	export let background = 'bg-light-bg dark:bg-dark-bg';
	export let hiddenTitle = false;
	export let clickable = false;
	export let noPadding = false;
	export let onClick = () => {};
	export let testId = '';

	let isFocused = hiddenTitle ? false : true;

	const changeFocus = () => {
		if (!hiddenTitle) return;

		isFocused = !isFocused;
	};

	const handleClick = () => {
		if (clickable && onClick) {
			onClick();
		}
	};

	const baseClasses =
		'rounded-lg border border-gray-200/50 dark:border-gray-700/30 overflow-hidden shadow-lg text-light-text dark:text-dark-text ' +
		sizeStyling +
		' ' +
		`${clickable ? 'hover:shadow-soft-glow cursor-pointer hover:border-vivid-blue dark:hover:border-vivid-blue ' : ''}` +
		background;
</script>

{#if clickable}
	<button
		type="button"
		on:mouseenter={changeFocus}
		on:mouseleave={changeFocus}
		on:click={handleClick}
		class={baseClasses + ' text-left w-full'}
		data-testid={testId}
		aria-label={title ? `Open ${title} details` : 'Open details'}
	>
		<div class="{noPadding ? '' : 'p-5'} w-full h-full flex flex-col relative">
			{#if title && !hiddenTitle}
				<h2
					class="text-sm font-semibold mb-2 text-light-secondary dark:text-dark-secondary uppercase tracking-wider"
				>
					{title}
				</h2>
			{/if}
			<div class="flex-1 flex flex-col justify-end">
				<slot />
			</div>
			{#if hiddenTitle}
				<div
					class="flex items-center gap-2 absolute right-4 top-4 rounded-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 shadow-lg py-2 px-3 transition-all duration-300 z-30 {isFocused
						? 'pr-4'
						: ''}"
				>
					{#if isFocused}
						<span class="font-semibold whitespace-nowrap text-sm">{title}</span>
					{/if}
					<NewTab size={16} />
				</div>
			{/if}
		</div>
	</button>
{:else}
	<div class={baseClasses}>
		<div class="{noPadding ? '' : 'p-5'} w-full h-full flex flex-col relative">
			{#if title && !hiddenTitle}
				<h2
					class="text-sm font-semibold mb-2 text-light-secondary dark:text-dark-secondary uppercase tracking-wider"
				>
					{title}
				</h2>
			{/if}
			<div class="flex-1 flex flex-col justify-end">
				<slot />
			</div>
		</div>
	</div>
{/if}
