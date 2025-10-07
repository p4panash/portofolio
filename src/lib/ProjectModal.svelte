<script lang="ts">
	import { marked } from 'marked';

	export let isOpen = false;
	export let projectTitle = '';
	export let onClose = () => {};

	let markdownContent = '';
	let htmlContent = '';
	let loading = true;
	let error = '';

	$: if (isOpen && projectTitle) {
		loadMarkdown();
	}

	async function loadMarkdown() {
		loading = true;
		error = '';
		markdownContent = '';
		htmlContent = '';

		try {
			const filename = projectTitle.toLowerCase().replace(/\s+/g, '-');
			const response = await fetch(`/projects/${filename}.md`);

			if (!response.ok) {
				throw new Error(`Failed to load project content: ${response.statusText}`);
			}

			markdownContent = await response.text();
			htmlContent = await marked.parse(markdownContent);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
			console.error('Error loading markdown:', err);
		} finally {
			loading = false;
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<button
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 border-none cursor-default"
		on:click={handleBackdropClick}
		aria-label="Close modal"
	>
		<div
			class="relative w-full max-w-4xl max-h-[90vh] bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<!-- Header -->
			<div
				class="sticky top-0 flex items-start justify-between px-8 py-6 bg-light-bg dark:bg-dark-bg z-10"
			>
				<h2 id="modal-title" class="text-3xl font-bold">{projectTitle}</h2>
				<button
					on:click={onClose}
					class="ml-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 hover:rotate-90"
					aria-label="Close modal"
				>
					<svg
						class="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Content -->
			<div class="overflow-y-auto px-8 pb-6 max-h-[calc(90vh-80px)]">
				{#if loading}
					<div class="flex items-center justify-center py-12">
						<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-vivid-blue"></div>
					</div>
				{:else if error}
					<div class="text-red-500 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded">
						<p class="font-semibold">Error loading project details</p>
						<p class="text-sm mt-1">{error}</p>
					</div>
				{:else}
					<div class="prose prose-slate dark:prose-invert max-w-none text-left">
						{@html htmlContent}
					</div>
				{/if}
			</div>
		</div>
	</button>
{/if}

<style>
	:global(.prose) {
		max-width: 100%;
	}

	:global(.prose h1) {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	:global(.prose h2) {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 0.75rem;
	}

	:global(.prose h3) {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
	}

	:global(.prose p) {
		margin-bottom: 1rem;
		line-height: 1.75;
	}

	:global(.prose ul, .prose ol) {
		margin-bottom: 1rem;
		padding-left: 1.5rem;
	}

	:global(.prose li) {
		margin-bottom: 0.5rem;
	}

	:global(.prose a) {
		color: #3b82f6;
		text-decoration: none;
	}

	:global(.prose a:hover) {
		text-decoration: underline;
	}

	:global(.prose code) {
		background-color: rgba(0, 0, 0, 0.05);
		padding: 0.2rem 0.4rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
	}

	:global(.dark .prose code) {
		background-color: rgba(255, 255, 255, 0.1);
	}

	:global(.prose pre) {
		background-color: rgba(0, 0, 0, 0.05);
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin-bottom: 1rem;
	}

	:global(.dark .prose pre) {
		background-color: rgba(255, 255, 255, 0.05);
	}

	:global(.prose blockquote) {
		border-left: 4px solid #3b82f6;
		padding-left: 1rem;
		font-style: italic;
		margin: 1rem 0;
	}
</style>
