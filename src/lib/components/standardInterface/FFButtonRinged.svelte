<script lang="ts">
	export let icon: string | null = null;
	export let label: string;
	export let clickAction: () => void;
	import Fa from 'svelte-fa';
	import { faRightFromBracket, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	const getIconByName = (name: string): IconDefinition | null => {
		switch (name) {
			case 'faRightFromBraket':
				return faRightFromBracket;

			// Add more cases for other icons
			default:
				return null;
		}
	};

	const iconDefinition = icon ? getIconByName(icon) : null;
</script>

<button type="button" on:click={clickAction} class="btn variant-ringed-primary">
	{#if iconDefinition}
		<Fa icon={iconDefinition} size="1.5x" />
	{/if}
	<span class="hidden md:block">{label}</span>
</button>
