<script>
	import Card from '$lib/Card.svelte';
	import InfoBadge from '$lib/InfoBadge.svelte';
	import DownloadIcon from '$lib/svgs/DownloadIcon.svelte';

	export let sizeStyling = '';
</script>

<Card {sizeStyling}>
	<div class="h-full flex flex-col gap-8">
		<div class="flex items-center gap-4">
			<img
				alt="Cătălin Muntean"
				src="https://avatars.githubusercontent.com/u/30667314?v=4"
				class="w-20 h-20 rounded-full border-2 border-gray-200 dark:border-gray-700 shadow-md"
			/>
			<div class="flex flex-col flex-1">
				<h3 class="text-2xl font-bold text-light-text dark:text-dark-text">Cătălin Muntean</h3>
				<div class="flex items-center justify-between">
					<p class="text-base text-light-secondary dark:text-dark-secondary">
						Full-Stack Developer
					</p>
					<a
						href="/resume.pdf"
						download
						class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl whitespace-nowrap transition-all duration-200"
						on:click={(e) => e.stopPropagation()}
					>
						<span>Resume</span>
						<DownloadIcon size={12} />
					</a>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-3">
			<p class="text-base text-light-text dark:text-dark-text leading-relaxed">
				Full-stack developer specializing in building scalable web applications with Ruby on Rails
				and React. Passionate about clean code, user experience, and continuous learning.
			</p>
			<div class="flex flex-wrap gap-1">
				<InfoBadge text="5+ years experience" />
				<InfoBadge text="Remote ready" />
				<InfoBadge text="Open to opportunities" />
			</div>
		</div>
	</div>
</Card>
