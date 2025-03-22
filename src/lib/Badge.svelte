<script>
	import {
		SiSvelte,
		SiPnpm,
		SiTailwindcss,
		SiReact,
		SiYarn,
		SiNextdotjs,
		SiJest,
		SiRubyonrails,
		SiRedis,
		SiSidekiq,
		SiPostgresql,
		SiGithub,
		SiVercel,
		SiI18next
	} from '@icons-pack/svelte-simple-icons';

	import DokkuLogo from './svgs/DokkuLogo.svelte';

	export let name = '';
	export let gradientBackground = false;

	const icons = new Map([
		['svelte', [SiSvelte, '#FF3E00', 'bg-gradient-to-r from-orange-500 to-orange-300']],
		[
			'tailwind',
			[SiTailwindcss, '#06B6D4', 'bg-gradient-to-r from-gray-800 via-indigo-600 to-purple-700']
		],
		['react', [SiReact, '#61DAFB', 'bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500']],
		[
			'react native',
			[SiReact, '#61DAFB', 'bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500']
		],
		['pnpm', [SiPnpm, '#F69220', 'bg-gradient-to-r from-yellow-400 to-teal-500']],
		['yarn', [SiYarn, '#2C8EBB', 'bg-gradient-to-r from-teal-600 via-blue-500 to-cyan-500']],
		[
			'next.js',
			[SiNextdotjs, '#000000', 'bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600']
		],
		['jest', [SiJest, '#C21325', 'bg-gradient-to-r from-red-700 via-red-500 to-rose-500']],
		[
			'ruby on rails',
			[SiRubyonrails, '#D30001', 'bg-gradient-to-r from-red-600 via-rose-500 to-red-400']
		],
		['redis', [SiRedis, '#FF4438', 'bg-gradient-to-r from-red-800 via-red-600 to-red-500']],
		['sidekiq', [SiSidekiq, '#B1003E', 'bg-gradient-to-r from-red-900 via-red-700 to-red-600']],
		[
			'postgresql',
			[SiPostgresql, '#4169E1', 'bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400']
		],
		['github ci', [SiGithub, '#181717', 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700']],
		['vercel', [SiVercel, '#000000', 'bg-gradient-to-r from-black via-gray-800 to-gray-700']],
		['i18next', [SiI18next, '#26A69A', 'bg-gradient-to-r from-black via-gray-800 to-gray-700']],
		['dokku', [DokkuLogo, null, 'bg-gradient-to-r from-black via-gray-800 to-gray-700']]
	]);

	const [Icon, color, background] = icons.get(name.toLowerCase()) || [];
</script>

<div class={'rounded shadow flex p-1 justify-center ' + (gradientBackground ? background : '')}>
	<div class="flex gap-2">
		{#if Icon}
			<Icon size={24} {color} />
		{/if}
		<span class="text-gray-100 dark:text-gray-200 font-medium">{name}</span>
	</div>
</div>
