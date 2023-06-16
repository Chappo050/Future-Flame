<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import FfButtonPrimary from '../standardInterface/FFButtonPrimary.svelte';
	import PostForm from './PostForm.svelte';
	import { fetchImage, fetchUserProfile } from '$lib/helpers/supabaseHelpers';
	import { Avatar } from '@skeletonlabs/skeleton';
	import FfProgessRadial from '../standardInterface/FFProgessRadial.svelte';
	import SinglePost from './SinglePostBlock.svelte';

	//Loaded data

	export let supabase: SupabaseClient;
	export let session: any;
	export let isMember: boolean;
	export let groupId: string;
	export let posts: PostData[];
	let isFormActive: boolean = false;
</script>

<div class="mx-2 flex-1">
	<div class="flex-row flex justify-between">
		<h3 class="h3">Posts</h3>
	</div>

	<hr />
	{#if isMember}
		<div class="py-2">
			<FfButtonPrimary
				label="Post"
				icon="faCirclePlus"
				clickAction={() => (isFormActive = !isFormActive)}
			/>
		</div>
		{#if isFormActive}
			<PostForm
				{supabase}
				{session}
				{groupId}
				on:formSubmit={() => (isFormActive = !isFormActive)}
			/>
		{/if}
	{/if}

	{#each posts as post}
		<div class="flex flex-col gap-10">
			<SinglePost {supabase} {session} {post} />
		</div>
	{/each}
</div>
