<script lang="ts">
	import ProfileCard from '$lib/cards/ProfileCard.svelte';
	import ThisBeautyCard from '$lib/cards/ThisBeautyCard.svelte';
	import MangaAppCard from '$lib/cards/MangaAppCard.svelte';
	import TechStackCard from '$lib/cards/TechStackCard.svelte';
	import PhotosCard from '$lib/cards/PhotosCard.svelte';
	import ImiPermitCard from '$lib/cards/ImiPermitCard.svelte';
	import MapCard from '$lib/cards/MapCard.svelte';
	import ContactCard from '$lib/cards/ContactCard.svelte';
	import ProjectModal from '$lib/ProjectModal.svelte';

	let isModalOpen = false;
	let selectedProject = '';

	function openProjectModal(projectTitle: string) {
		selectedProject = projectTitle;
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		selectedProject = '';
	}
</script>

<div
	class="container min-h-[95vh] mx-auto grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-rows-5"
>
	<ProfileCard sizeStyling="lg:col-span-2 lg:row-span-2" />
	<ThisBeautyCard
		sizeStyling="lg:col-span-1 lg:row-span-2"
		onClick={() => openProjectModal('This Beauty')}
	/>
	<MangaAppCard
		sizeStyling="lg:col-span-1 lg:row-span-2"
		onClick={() => openProjectModal('Manga App')}
	/>
	<TechStackCard sizeStyling="lg:col-span-1 lg:row-span-1" />
	<PhotosCard sizeStyling="lg:col-span-1 lg:row-span-2" />
	<ImiPermitCard
		sizeStyling="lg:col-span-2 lg:row-span-3"
		onClick={() => openProjectModal('Imi Permit')}
	/>
	<MapCard sizeStyling="lg:col-span-1 lg:row-span-2" />
	<ContactCard sizeStyling="lg:col-span-1 lg:row-span-1" />
</div>

<ProjectModal isOpen={isModalOpen} projectTitle={selectedProject} onClose={closeModal} />
