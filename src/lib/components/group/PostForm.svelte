<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { slide } from 'svelte/transition';
	import FfButtonPrimary from '../standardInterface/FFButtonPrimary.svelte';
	import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { APIRequest } from '$lib/helpers/APIHelpers';
	import { toastStore } from '@skeletonlabs/skeleton';
	import { invalidateAll } from '$app/navigation';
	import FfProgessRadial from '../standardInterface/FFProgessRadial.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let supabase: SupabaseClient;
	export let session: any;
	export let groupId: string;
	let loading: boolean = false;
	let form: PostData = {
		user_id: session?.user?.id,
		group_id: groupId,
		message: '',
		likes: 0,
		title: ''
	};

	const resetForm = () => {
		form = {
			user_id: session?.user?.id,
			group_id: groupId,
			message: '',
			likes: 0,
			title: ''
		};
	};

	const submitForm = async () => {
		loading = true;
		const response = await APIRequest(window.location.pathname, 'POST', form);
		console.log(response);
		if (response.success) {
			toastStore.trigger({
				message: 'Post Created Successfully',
				background: 'variant-filled-success'
			});
			await invalidateAll();
			resetForm();
			dispatch('formSubmit');
		} else {
			toastStore.trigger({
				message: 'Post Failed, Please Try Again',
				background: 'variant-filled-error'
			});
		}
		loading = false;
	};
</script>

<div transition:slide class="">
	<div class="input-group grid-cols-3 gap-2">
		<div class="input-group-shim rounded-lg">Something Here</div>
		<input type="text" bind:value={form.title} class="col-span-2" placeholder="Title here..." />

		<hr class="col-span-3" />

		<textarea
			bind:value={form.message}
			class="textarea w-auto border-0 col-span-3"
			rows="4"
			placeholder="What's important?"
		/>

		<hr class="col-span-3" />

		<div class="col-span-3 flex">
			<button class="btn"><Fa icon={faCirclePlus} size="1x" /></button>
			<button class="btn"> <Fa icon={faCirclePlus} size="1x" /></button>
			<button class="btn"> <Fa icon={faCirclePlus} size="1x" /></button>
		</div>

		<hr class="col-span-3" />
		<div class="col-span-3">
			{#if !loading}
				<button type="button" on:click={submitForm} class=" mx-auto btn variant-filled-primary">
					<span class="">Submit</span>
				</button>
			{:else}
				<div class="mx-auto">
					<FfProgessRadial size="w-10" />
				</div>
			{/if}
		</div>
	</div>
</div>
