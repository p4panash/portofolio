<script>
	import Card from '$lib/Card.svelte';
	import { SiLinkedin, SiGithub, SiGmail } from '@icons-pack/svelte-simple-icons';
	import { darkMode } from '$lib/stores/theme';

	export let sizeStyling = '';

	const contacts = [
		{
			name: 'LinkedIn',
			icon: SiLinkedin,
			href: 'https://www.linkedin.com/in/catalin-muntean/',
			colorLight: '#0A66C2',
			colorDark: '#0A66C2'
		},
		{
			name: 'GitHub',
			icon: SiGithub,
			href: 'https://github.com/p4panash',
			colorLight: '#181717',
			colorDark: '#E6EDF3'
		},
		{
			name: 'Email',
			icon: SiGmail,
			href: 'mailto:muntean.catalin.avram@gmail.com',
			colorLight: '#EA4335',
			colorDark: '#EA4335'
		}
	];
</script>

<Card {sizeStyling} title="Let's Connect">
	<div class="flex items-center justify-between gap-6">
		{#each contacts as contact}
			<a
				href={contact.href}
				target={contact.name !== 'Email' ? '_blank' : undefined}
				rel={contact.name !== 'Email' ? 'noopener noreferrer' : undefined}
				aria-label={contact.name}
				class="group flex flex-col items-center gap-2 transition-transform duration-200 hover:scale-110"
			>
				<svelte:component
					this={contact.icon}
					size={32}
					color={$darkMode ? contact.colorDark : contact.colorLight}
				/>
				<span
					class="text-xs font-medium text-light-secondary dark:text-dark-secondary group-hover:text-vivid-blue transition-colors duration-200"
				>
					{contact.name}
				</span>
			</a>
		{/each}
	</div>
</Card>
