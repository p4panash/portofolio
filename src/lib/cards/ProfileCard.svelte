<script>
	import Card from '$lib/Card.svelte';

	export let sizeStyling = '';
</script>

<Card {sizeStyling} clickable={true}>
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
