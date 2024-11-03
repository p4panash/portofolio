<script>
	import '../app.css';

	let darkMode = false;

	// Function to toggle dark mode
	function toggleTheme() {
		darkMode = !darkMode;
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
</script>

<div style="display: contents">
	<main class="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
		<div class="container mx-auto pt-5">
			<button
				class="mb-4 px-4 py-2 bg-vivid-blue hover:bg-hover-blue text-white rounded"
				on:click={toggleTheme}
			>
				Toggle {darkMode ? 'Light' : 'Dark'} Mode
			</button>

			<slot />
		</div>
	</main>
</div>
