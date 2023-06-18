<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { slide } from 'svelte/transition';
	import { faPencil } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import FfProgessRadial from '../standardInterface/FFProgessRadial.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let title: string;
	export let text: string;
	export let isShown: boolean = false;
	export let loading: boolean = false;

	const submitForm = async () => {
		dispatch('loading');

		dispatch('formSubmit');
	};
	$: dispatch('change', text);
	$: console.log(loading);
</script>

<div transition:slide>
	<div class="input-group grid-cols-3">
		<div
			class="input-group-shim rounded-lg p-1 pb-0 h4"
			on:click={() => (isShown = !isShown)}
			on:keydown={() => (isShown = !isShown)}
		>
			{title}
		</div>
		<div on:click={() => (isShown = !isShown)} on:keydown={() => (isShown = !isShown)} />
		<div
			class="ml-auto"
			on:click={() => (isShown = !isShown)}
			on:keydown={() => (isShown = !isShown)}
		>
			<Fa icon={faPencil} size="1.0x" />
		</div>

		{#if isShown}
			<textarea
				transition:slide
				bind:value={text}
				class="textarea w-auto border-0 col-span-3"
				rows="4"
				placeholder="State your mission..."
			/>

			<hr class="col-span-3 py-1" transition:slide />

			<div class="col-span-3 flex py-1" transition:slide>
				{#if !loading}
					<button
						type="button"
						on:click={submitForm}
						class=" flex mx-auto justify-end btn variant-filled-primary"
					>
						<span class="">Save</span>
					</button>
				{:else}
					<div class="mx-auto">
						<FfProgessRadial size="w-10" />
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
