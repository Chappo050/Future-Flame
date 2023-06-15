<script lang="ts">
	import NoImage from '$lib/assets/image-not-found.jpeg';
	import FfGroupCard from './FFGroupCard.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';

	import Fa from 'svelte-fa';
	import { faCircleLeft, faCircleRight } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';

	export let groups: GroupData[] = [];
	export let supabase: SupabaseClient;
	let index = 0;
	let itemsDisplayed = 1;

	onMount(() => {
		updateItemsDisplayed();
		window?.addEventListener('resize', updateItemsDisplayed);
		return () => {
			window?.removeEventListener('resize', updateItemsDisplayed);
		};
	});

	const updateItemsDisplayed = () => {
		if (window?.innerWidth >= 1280) {
			itemsDisplayed = 3;
		} else if (window?.innerWidth >= 1020) {
			itemsDisplayed = 2;
		} else {
			itemsDisplayed = groups.length;
		}
	};

	const next = () => {
		index = Math.min(index + 1, groups.length - itemsDisplayed);
	};

	const previous = () => {
		index = Math.max(index - 1, 0);
	};
</script>

<div class="container lg:flex lg:flex-row gap-1 lg:gap-10">
	<button
		class="hidden lg:block btn my-auto variant-filled-ghost"
		on:click={previous}
		disabled={index === 0}
	>
		<Fa icon={faCircleLeft} size="2x" />
	</button>
	<div
		class="flex flex-row overflow-x-auto lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-5 hide-scrollbar"
	>
		{#each groups.slice(index, index + itemsDisplayed) as group (group.id)}
			<FfGroupCard {group} {supabase} />
		{/each}
	</div>
	<button
		class="hidden lg:block btn my-auto variant-filled-ghost"
		on:click={next}
		disabled={index >= groups.length - itemsDisplayed}
	>
		<Fa icon={faCircleRight} size="2x" />
	</button>
</div>
