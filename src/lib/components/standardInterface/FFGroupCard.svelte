<script lang="ts">
	import { fetchImage, fetchUserProfile } from '$lib/helpers/supabaseHelpers';
	import { Avatar } from '@skeletonlabs/skeleton';

	import { fade, slide } from 'svelte/transition';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import GroupSVG from '$lib/svgs/GroupSVG.svelte';
	export let group: GroupData;
	export let supabase: SupabaseClient;
	let src: string;
	let avatarUrl: string;
	let loading: boolean = false;
	let username: string;
	let avatarLoading: boolean = false;

	const downloadImage = async (path: string) => {
		loading = true;
		src = (await fetchImage(path, 'banners', supabase)) as string;
		console.log(src);

		loading = false;
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
	$: if (group.bannerImage) downloadImage(group.bannerImage);
	$: if (group.user_id) loadUser(group.user_id);
</script>

<a
	class="card card-hover overflow-hidden max-w-lg"
	href="/groups/{group.slug}"
	in:fade={{ duration: 500 }}
>
	<header>
		<img {src} class="bg-black/50 w-full h-32" alt="Post" />
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
			<small class="flex gap-2"><GroupSVG />{group.memberCount}</small>
		</div>
	</footer>
</a>
