<script>
	import Badge from '$lib/Badge.svelte';
	import Card from '$lib/Card.svelte';
</script>

<div
	class="container min-h-[80vh] mx-auto grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-5"
>
	<Card sizeStyling="lg:col-span-2 lg:row-span-2 ">
		<div class="h-full flex flex-col justify-between">
			<div class="flex justify-between">
				<div class="flex">
					<img
						alt="avatar"
						src="https://avatars.githubusercontent.com/u/30667314?v=4"
						class="w-24 h-24 rounded-full border"
					/>
					<span class="ml-2 text-xl font-semibold self-end">Cătălin Muntean</span>
				</div>
				<div class="self-end">
					<span>Download Resume</span>
				</div>
			</div>
			<div>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam semper felis vitae arcu
					hendrerit rutrum. Phasellus efficitur vulputate auctor. Maecenas ultricies tellus vitae
					eleifend sodales. Etiam justo sapien, eleifend a suscipit at, gravida sit amet quam.
				</p>
			</div>
		</div>
	</Card>

	<Card
		title="This beauty"
		hiddenTitle={true}
		sizeStyling="lg:col-span-1 lg:row-span-2"
		background="bg-gradient-to-tl from-violet-500 to-fuchsia-500"
	>
		<div class="flex gap-1">
			<Badge name="Svelte" />
			<Badge name="Tailwind" />
			<Badge name="Pnpm" />
		</div>
	</Card>

	<Card
		title="Manga App"
		hiddenTitle={true}
		sizeStyling="lg:col-span-1 lg:row-span-2"
		background="bg-gradient-to-tl from-rose-500 to-purple-500"
	>
		<div class="flex flex-wrap gap-1">
			<Badge name="React Native" />
			<Badge name="Tailwind" />
			<Badge name="Yarn" />
		</div>
	</Card>

	<Card title="Tech stack" sizeStyling="lg:col-span-1 lg:row-span-1" />

	<Card title="Photos" sizeStyling="lg:col-span-1 lg:row-span-2" />

	<Card
		title="Imi Permit"
		hiddenTitle={true}
		sizeStyling="lg:col-span-2 lg:row-span-2"
		background="bg-gradient-to-tl from-pink-400 to-indigo-400"
	>
		<div class="flex flex-wrap gap-1">
			<Badge name="Next.js" />
			<Badge name="i18next" />
			<Badge name="Jest" />
			<Badge name="Ruby on Rails" />
			<Badge name="Sidekiq" />
			<Badge name="Redis" />
			<Badge name="PostgreSQL" />
			<Badge name="GitHub CI" />
			<Badge name="Vercel" />
			<Badge name="Dokku" />
		</div>
	</Card>

	<Card title="Social Media" sizeStyling="lg:col-span-1 lg:row-span-1" />

	<Card title="Map" sizeStyling="lg:col-span-1 lg:row-span-1" />

	<Card title="Other stuff / Github repo" sizeStyling="lg:col-span-1 lg:row-span-1" />

	<Card title="More to come & contact" sizeStyling="lg:col-span-2 lg:row-span-1" />
</div>
