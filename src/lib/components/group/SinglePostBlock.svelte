<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';

	import { fetchUserProfile } from '$lib/helpers/frontend/supabaseHelpers';
	import { Avatar } from '@skeletonlabs/skeleton';
	import FfProgessRadial from '../standardInterface/FFProgessRadial.svelte';
	import Fa from 'svelte-fa';
	import { faFireFlameSimple } from '@fortawesome/free-solid-svg-icons';
	import { APIRequest } from '$lib/helpers/APIHelpers';
	import { invalidateAll } from '$app/navigation';
	export let supabase: SupabaseClient;
	export let session: any;
	export let post: PostData;

	const incrementLike = async (postId: string) => {
		if (!session) return;
		await APIRequest('/api/protected/group/like', 'POST', {
			groupId: post.group_id,
			postId: postId
		});
		post.likes++;
	};

	const decrementLike = async (postId: string) => {
		if (!session) return;
		await APIRequest('/api/protected/group/like', 'DELETE', {
			groupId: post.group_id,
			postId: postId
		});
		post.likes--;
	};

	const checkLikedStatus = async (postId: string) => {
		if (!session) return;
		const response = await APIRequest(`/api/protected/group/like?postId=${postId}`, 'GET');

		console.log('RES', response);
		return response.success;
	};
</script>

<div class="card card-hover overflow-hidden max-w-ful min-w-[70%] my-5">
	<header>
		<!-- If image user here -->
		<!-- {#await downloadImage(group.bannerImage) then src}
			<img {src} class="bg-black/50 w-full h-32" alt="Post" />
		{/await} -->
	</header>

	<div class="p-4 space-y-4">
		<div class="flex flex-col justify-between">
			<h3 class="h3">{post.title}</h3>
			<small>{new Date(post?.created_at).toLocaleString()}</small>
		</div>

		<hr class="opacity-50" />
		<article class="">
			<p>{post.message}</p>
		</article>
	</div>
	<hr class="opacity-50" />
	<footer class="p-4 flex justify-between items-center space-x-4">
		<div class="flex">
			{#await fetchUserProfile(post.user_id, supabase)}
				<FfProgessRadial size="w-10" />
			{:then profile}
				<Avatar src={profile?.avatarUrl} width="w-10" rounded="rounded-full" />
				<p class="my-auto ml-2">{profile?.userData.username}</p>
			{/await}
		</div>

		{#await checkLikedStatus(post.id) then isLiked}
			{#if isLiked}
				<button class="flex gap-2 hover:scale-110" on:click={() => decrementLike(post?.id)}
					><Fa class="mx-auto my-auto" color="red" icon={faFireFlameSimple} size="1.5x" />
					{post.likes}</button
				>
			{:else}
				<button class="flex gap-2 hover:scale-110" on:click={() => incrementLike(post?.id)}
					><Fa class="mx-auto my-auto" icon={faFireFlameSimple} size="1.5x" />
					{post.likes}</button
				>
			{/if}
		{/await}
	</footer>
</div>
