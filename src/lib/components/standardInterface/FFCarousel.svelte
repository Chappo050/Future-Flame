<script lang="ts">
	import NoImage from '$lib/assets/image-not-found.jpeg';
	import FfGroupCard from './FFGroupCard.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import ArrowRight from '$lib/svgs/ArrowRight.svelte';
	import ArrowLeft from '$lib/svgs/ArrowLeft.svelte';
	import { onMount } from 'svelte';

	export let myGroups: GroupData[] = [];
	export let supabase: SupabaseClient;
	let index = 0;
	let itemsDisplayed = 1;

	onMount(() => {
		updateItemsDisplayed();
		window.addEventListener('resize', updateItemsDisplayed);
		return () => {
			window.removeEventListener('resize', updateItemsDisplayed);
		};
	});

	const updateItemsDisplayed = () => {
		if (window.innerWidth >= 1280) {
			itemsDisplayed = 3;
		} else if (window.innerWidth >= 640) {
			itemsDisplayed = 2;
		} else {
			itemsDisplayed = 1;
		}
	};

	const next = () => {
		index = Math.min(index + 1, myGroups.length - itemsDisplayed);
	};

	const previous = () => {
		index = Math.max(index - 1, 0);
	};

	$: if (window.innerWidth) {
		updateItemsDisplayed();
	}
</script>

<div class=" md:flex md:flex-row gap-1 md:gap-5 lg:gap-10">
	<button
		class="hidden md:block btn-icon btn-icon-sm h-10 w-10 my-auto"
		on:click={previous}
		disabled={index === 0}
	>
		<ArrowLeft />
	</button>
	<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
		{#each myGroups.slice(index, index + itemsDisplayed) as group (group.id)}
			<FfGroupCard {group} {supabase} />
		{/each}
	</div>
	<div class="block md:hidden">
		<button
			class="btn-icon btn-icon-sm h-10 w-10 my-auto"
			on:click={previous}
			disabled={index === 0}
		>
			<ArrowLeft />
		</button>
		<button
			class="btn-icon btn-icon-sm h-10 w-10 my-auto"
			on:click={next}
			disabled={index >= myGroups.length - itemsDisplayed}
		>
			<ArrowRight />
		</button>
	</div>

	<button
		class=" hidden md:block btn-icon btn-icon-sm h-10 w-10 my-auto"
		on:click={next}
		disabled={index >= myGroups.length - itemsDisplayed}
	>
		<ArrowRight />
	</button>
</div>
