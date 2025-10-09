<script>
	import '../app.css';
	import ThemeToggle from '$lib/ThemeToggle.svelte';
</script>

<div style="display: contents">
	<main class="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
		<!-- Floating Theme Toggle -->
		<div class="fixed right-6 z-50" style="top: 6px;">
			<ThemeToggle />
		</div>

		<div class="container mx-auto pt-5">
			<slot />
		</div>
	</main>
</div>
