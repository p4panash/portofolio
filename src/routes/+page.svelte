<script>
	import ProfileCard from '$lib/cards/ProfileCard.svelte';
	import ThisBeautyCard from '$lib/cards/ThisBeautyCard.svelte';
	import MangaAppCard from '$lib/cards/MangaAppCard.svelte';
	import TechStackCard from '$lib/cards/TechStackCard.svelte';
	import PhotosCard from '$lib/cards/PhotosCard.svelte';
	import ImiPermitCard from '$lib/cards/ImiPermitCard.svelte';
	import MapCard from '$lib/cards/MapCard.svelte';
	import ContactCard from '$lib/cards/ContactCard.svelte';
</script>

<div
	class="container min-h-[80vh] mx-auto grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-5"
>
	<ProfileCard sizeStyling="lg:col-span-2 lg:row-span-2" />
	<ThisBeautyCard sizeStyling="lg:col-span-1 lg:row-span-2" />
	<MangaAppCard sizeStyling="lg:col-span-1 lg:row-span-2" />
	<TechStackCard sizeStyling="lg:col-span-1 lg:row-span-1" />
	<PhotosCard sizeStyling="lg:col-span-1 lg:row-span-2" />
	<ImiPermitCard sizeStyling="lg:col-span-2 lg:row-span-3" />
	<MapCard sizeStyling="lg:col-span-1 lg:row-span-2" />
	<ContactCard sizeStyling="lg:col-span-1 lg:row-span-1" />
</div>
