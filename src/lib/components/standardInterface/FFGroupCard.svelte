<script lang="ts">
	import { fetchImage, fetchUserProfile } from '$lib/helpers/frontend/supabaseHelpers';
	import { Avatar } from '@skeletonlabs/skeleton';

	import { fade, slide } from 'svelte/transition';
	import type { SupabaseClient } from '@supabase/supabase-js';

	import Fa from 'svelte-fa';
	import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
	import FfProgessRadial from './FFProgessRadial.svelte';
	import GroupCardPlaceholder from '../placeholders/GenericPlaceholder.svelte';

	export let group: GroupData;
	export let supabase: SupabaseClient;
	let avatarUrl: string;
	let loading: boolean = false;
	let username: string;
	let avatarLoading: boolean = false;

	const downloadImage = async (path: string) => {
		loading = true;
		const src = (await fetchImage(path, 'banners', supabase)) as string;
		loading = false;
		return src;
	};

	const loadUser = async (user_id: string) => {
		avatarLoading = true;
		const response = await fetchUserProfile(user_id, supabase);
		if (response) {
			avatarUrl = response.avatarUrl || '';
			username = response.userData.username;
		}

		avatarLoading = false;
	};
	$: if (group.user_id) loadUser(group.user_id);
</script>

<a
	class="card card-hover overflow-hidden max-w-lg min-w-[70%] ml-2"
	href="/groups/{group.slug}"
	in:fade={{ duration: 500 }}
>
	<header>
		{#await downloadImage(group.bannerImage)}
			<FfProgessRadial />
		{:then src}
			<img {src} class="bg-black/50 w-full h-32" alt="Post" />
		{/await}
	</header>
	<div class="p-4 space-y-4">
		<h3 class="h3" data-toc-ignore>{group.title}</h3>
		<article class="">
			<p>
				{group.mission}
			</p>
		</article>
	</div>
	<hr class="opacity-50" />
	<footer class="p-4 flex justify-start items-center space-x-4">
		<Avatar src={avatarUrl} width="w-8" />
		<div class="flex-auto flex justify-between items-center">
			<h6 class="font-bold">{username}</h6>
			<small class="flex gap-2"
				><Fa class="mx-auto my-auto" icon={faPeopleGroup} size="1.5x" />
				{group.memberCount}</small
			>
		</div>
	</footer>
</a>
