<script lang="ts">
	import { invalidate } from '$app/navigation';
	import MemberList from '$lib/components/group/MemberList.svelte';
	import FfButtonPrimary from '$lib/components/standardInterface/FFButtonPrimary.svelte';
	import { fetchImage } from '$lib/helpers/supabaseHelpers.js';
	import { toastStore, type ModalSettings, modalStore } from '@skeletonlabs/skeleton';

	//Loaded data
	export let data;
	let { supabase, session, groupData } = data;
	let loadingBanner: boolean = false;
	let bannerImage: string;

	const downloadImages = async (path: string) => {
		loadingBanner = true;
		bannerImage = (await fetchImage(path, 'banners', supabase)) as string;
		console.log(bannerImage);

		loadingBanner = false;
	};

	$: if (groupData) downloadImages(groupData.bannerImage);

	const joinButton = async (action: string) => {
		switch (action) {
			case 'join':
				console.log('join');
				break;

			case 'leave':
				console.log('leave');
				break;

			case 'signup':
				console.log('Sign Up');
				break;

			default:
				break;
		}
	};
</script>

<header>
	<img src={bannerImage} class="bg-black/50 w-full h-32" alt="Post" />
</header>
<div class="container mx-auto flex flex-col justify-center pt-10">
	{#if session}
		<FfButtonPrimary label="Join" clickAction={joinButton} />
	{:else if groupData?.members}
		<FfButtonPrimary label="Leave" clickAction={joinButton} />
	{:else}
		<FfButtonPrimary label="Sign Up" clickAction={joinButton} />
	{/if}

	<h2 class="h2">{groupData?.title}</h2>
	<MemberList {supabase} userList={groupData.members} />
</div>
