<script>
	import Card from '$lib/Card.svelte';
</script>

<div
	class="container min-h-[80vh] mx-auto grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-auto"
>
	<Card sizeStyling="col-span-2 row-span-3 ">
		<div class="flex">
			<div>
				<img
					alt="avatar"
					src="https://avatars.githubusercontent.com/u/30667314?v=4"
					class="w-20 h-20 rounded-full"
				/>
				<span class="text-xl font-semibold">Cătălin Muntean</span>
			</div>
			<div>
				<span>Download Resume</span>
			</div>
		</div>
	</Card>

	<Card title="Tech stack" sizeStyling="col-span-1 row-span-2" />

	<Card title="Manga App" sizeStyling="col-span-1 row-span-3" />

	<Card title="Social Media" sizeStyling="col-span-1" />

	<Card title="Instagram Pics" sizeStyling="col-span-1 row-span-2" />

	<Card title="This beauty" sizeStyling="col-span-1 row-span-3" />

	<Card title="Imi Permit" sizeStyling="col-span-2 row-span-3" />

	<Card title="Map" sizeStyling="col-span-1 row-span-2" />

	<Card title="More to come & contact" sizeStyling="col-span-2" />

	<Card title="Other stuff / Github repo" sizeStyling="col-span-1" />
</div>
