<script lang="ts">
	import NoImage from '$lib/assets/image-not-found.jpeg';

	const tempImage = 'https://source.unsplash.com/vjUokUWbFOs/400x175';

	import FfGroupCard from './FFGroupCard.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import ArrowRight from '$lib/svgs/ArrowRight.svelte';
	import ArrowLeft from '$lib/svgs/ArrowLeft.svelte';

	export let myGroups: GroupData[] = [];
	export let supabase: SupabaseClient;
	let index = 0;

	const next = () => {
		index = Math.min(index + 1, myGroups.length - 3);
	};

	const previous = () => {
		index = Math.max(index - 1, 0);
	};
</script>

<div class=" flex flex-row gap-10">
	<button class="btn-icon btn-icon-sm h-10 w-10 my-auto" on:click={previous} disabled={index === 0}
		><ArrowLeft /></button
	>
	<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 -5">
		{#each myGroups.slice(index, index + 3) as group (group.id)}
			<FfGroupCard {group} {supabase} />
		{/each}
	</div>
	<button
		class="btn-icon btn-icon-sm h-10 w-10 my-auto"
		on:click={next}
		disabled={index >= myGroups.length - 3}><ArrowRight /></button
	>
</div>
