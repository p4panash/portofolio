<script lang="ts">
	import type { ComponentType, SvelteComponent } from 'svelte';
	import ProfileCard from '$lib/cards/ProfileCard.svelte';
	import ThisBeautyCard from '$lib/cards/ThisBeautyCard.svelte';
	import MangaAppCard from '$lib/cards/MangaAppCard.svelte';
	import TechStackCard from '$lib/cards/TechStackCard.svelte';
	import PhotosCard from '$lib/cards/PhotosCard.svelte';
	import ImiPermitCard from '$lib/cards/ImiPermitCard.svelte';
	import MapCard from '$lib/cards/MapCard.svelte';
	import ContactCard from '$lib/cards/ContactCard.svelte';

	let isModalOpen = false;
	let selectedProject = '';
	let ProjectModal: ComponentType<SvelteComponent> | null = null;

	// Lazy load ProjectModal only when needed
	async function openProjectModal(projectTitle: string) {
		if (!ProjectModal) {
			const module = await import('$lib/ProjectModal.svelte');
			ProjectModal = module.default;
		}
		selectedProject = projectTitle;
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		selectedProject = '';
	}
</script>

<div
	class="container md:h-[95vh] mx-auto grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr px-4 pb-4 md:p-0"
>
	<ProfileCard
		sizeStyling="col-span-1 row-span-2 order-1 md:col-span-1 md:row-span-2 md:order-1 lg:col-span-2 lg:row-span-2 lg:order-none"
	/>
	<ThisBeautyCard
		sizeStyling="col-span-1 row-span-2 order-5 md:col-span-1 md:row-span-1 md:order-7 lg:col-span-1 lg:row-span-2 lg:order-none"
		onClick={() => openProjectModal('This Beauty')}
	/>
	<MangaAppCard
		sizeStyling="col-span-1 row-span-2 order-4 md:col-span-1 md:row-span-2 md:order-5 lg:col-span-1 lg:row-span-2 lg:order-none"
		onClick={() => openProjectModal('Manga App')}
	/>
	<TechStackCard
		sizeStyling="col-span-1 row-span-1 order-2 md:col-span-1 md:row-span-1 md:order-3 lg:col-span-1 lg:row-span-1 lg:order-none"
		onClick={() => openProjectModal('Tech Stack')}
	/>
	<PhotosCard sizeStyling="hidden lg:block lg:col-span-1 lg:row-span-2" />
	<ImiPermitCard
		sizeStyling="col-span-1 row-span-2 order-3 md:col-span-1 md:row-span-3 md:order-2 lg:col-span-2 lg:row-span-3 lg:order-none"
		onClick={() => openProjectModal('Imi Permit')}
	/>
	<MapCard
		sizeStyling="hidden md:block md:col-span-1 md:row-span-2 md:order-4 lg:col-span-1 lg:row-span-2 lg:order-none"
	/>
	<ContactCard
		sizeStyling="col-span-1 row-span-1 order-6 md:col-span-1 md:row-span-1 md:order-6 lg:col-span-1 lg:row-span-1 lg:order-none"
	/>
</div>

<!-- Lazy-loaded Project Modal -->
{#if isModalOpen && ProjectModal}
	<svelte:component
		this={ProjectModal}
		isOpen={isModalOpen}
		projectTitle={selectedProject}
		onClose={closeModal}
	/>
{/if}
