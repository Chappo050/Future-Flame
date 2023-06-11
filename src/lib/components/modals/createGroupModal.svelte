<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';
	//Components
	import BannerUpload from '../global/bannerUpload.svelte';
	import { APIRequest } from '$lib/helpers/APIHelpers';
	import { goto } from '$app/navigation';
	import FfProgessRadial from '../standardInterface/FFProgessRadial.svelte';
	// Props
	export let parent: any;
	//Variables
	let bannerURL: string;
	let supabase: SupabaseClient = $modalStore[0].meta.supabase;
	let loading: boolean = false;
	let isDisabled: boolean;
	//Functions
	// Form Data
	const formData = {
		title: '',
		mission: '',
		// email: '',
		bannerImage: ''
	};

	// We've created a custom submit function to pass the response and close the modal.
	async function onFormSubmit() {
		loading = true;
		console.log('Modal', $modalStore[0]);

		const response = await APIRequest('/groups', 'POST', formData);
		loading = false;

		if ($modalStore[0].response && response.id)
			$modalStore[0].response({ success: true, response });
		else if ($modalStore[0].response) $modalStore[0].response({ success: false, response });

		modalStore.close();
	}

	$: formData.bannerImage = bannerURL;
	$: isDisabled = !formData.title || !formData.mission || !formData.bannerImage || !bannerURL;

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		{#if loading}
			<header class={cHeader}>Creating Group Please Wait..</header>
			<form class="modal-form {cForm} "><FfProgessRadial /></form>
		{:else}
			<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
			<article>{$modalStore[0].body ?? '(body missing)'}</article>
			<!-- Enable for debugging: -->
			<form class="modal-form {cForm} ">
				<BannerUpload {supabase} bind:url={bannerURL} />
				<label class="label">
					<span>Title</span>
					<input
						class="input"
						type="text"
						bind:value={formData.title}
						placeholder="Enter name..."
						maxlength="30"
					/>
				</label>

				<label class="label relative">
					<span>Mission</span>
					<textarea
						class="textarea"
						rows="12"
						bind:value={formData.mission}
						placeholder="Enter this groups mission..."
						maxlength="600"
					/>
					<span id="wordCount" class="absolute bottom-2 right-2 text-gray-500"
						>{formData.mission.length} / 600</span
					>
				</label>
			</form>
			<!-- prettier-ignore -->
			<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" disabled={isDisabled} on:click={onFormSubmit}>Create</button>
		</footer>
		{/if}
	</div>
{/if}
