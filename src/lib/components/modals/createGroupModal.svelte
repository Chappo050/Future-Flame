<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';
	//Components
	import BannerUpload from '../global/bannerUpload.svelte';
	// Props
	export let parent: any;
	//Variables
	let banner: any;
	let bannerURL: string;
	let supabase: SupabaseClient = $modalStore[0].meta.supabase;

	//Functions
	// Form Data
	const formData = {
		title: '',
		description: '',
		// email: '',
		bannerImage: ''
	};
	$: formData.bannerImage = bannerURL;
	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}
	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->
<!-- For something -->
<!-- on:upload={() => {
    banner.uploadBanner();
}} -->
{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}">
			<BannerUpload {supabase} bind:url={bannerURL} />
			<label class="label">
				<span>Title</span>
				<input class="input" type="text" bind:value={formData.title} placeholder="Enter name..." />
			</label>
			<label class="label">
				<span>Description</span>
				<input
					class="input"
					type="text"
					bind:value={formData.description}
					placeholder="Enter description..."
				/>
			</label>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Create</button>
    </footer>
	</div>
{/if}
