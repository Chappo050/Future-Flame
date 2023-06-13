<script lang="ts">
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import GroupInfo from '$lib/components/group/GroupInfo.svelte';
	import Location from '$lib/components/group/Location.svelte';
	import MemberList from '$lib/components/group/MemberList.svelte';
	import FfButtonPrimary from '$lib/components/standardInterface/FFButtonPrimary.svelte';
	import FfButtonRinged from '$lib/components/standardInterface/FFButtonRinged.svelte';
	import FfProgessRadial from '$lib/components/standardInterface/FFProgessRadial.svelte';
	import { APIRequest } from '$lib/helpers/APIHelpers.js';
	import { fetchImage } from '$lib/helpers/supabaseHelpers.js';
	import { toastStore, type ModalSettings, modalStore } from '@skeletonlabs/skeleton';
	import type { SupabaseClient } from '@supabase/supabase-js';

	//Loaded data
	export let data;
	let supabase: SupabaseClient;
	let session: any;
	let groupData: GroupData | undefined | null;
	({ supabase, session, groupData } = data);

	let loadingBanner: boolean = false;
	let bannerImage: string;
	let joinAction: string = 'signup';
	let joinLoading: boolean;
	let isAdmin: boolean = false;
	const downloadImages = async (path: string) => {
		loadingBanner = true;
		bannerImage = (await fetchImage(path, 'banners', supabase)) as string;
		console.log(bannerImage);

		loadingBanner = false;
	};
	$: if (data) {
		({ supabase, session, groupData } = data);
	}
	$: if (groupData) downloadImages(groupData.bannerImage);
	$: if (groupData) {
		joinLoading = true;
		if (!session) {
			joinAction = 'signup';
		} else {
			//Check admin
			isAdmin = groupData.members.some((item) => item.role === 'admin');
			console.log(session.user.id, groupData.members);

			//Check user member status
			const userExists = groupData.members.some((item) => item.id === session?.user.id);
			console.log('User Exists', userExists);

			if (userExists) {
				joinAction = 'leave';
			} else {
				joinAction = 'join';
			}
		}
		joinLoading = false;
	}
	const joinButton = async (action: string) => {
		joinLoading = true;
		const url = window.location.href;
		const groupId = url.split('/').pop();

		switch (action) {
			case 'join':
				console.log('join');
				const responseJoin = await APIRequest(window.location.pathname, 'PUT', {
					groupId,
					action: 'join'
				});
				if (responseJoin.success) {
					console.log('invalidate');

					await invalidate(() => true);
				}

				break;

			case 'leave':
				console.log('leave');
				const responseLeave = await APIRequest(window.location.pathname, 'PUT', {
					groupId,
					action: 'leave'
				});
				if (responseLeave.success) {
					console.log('invalidate');

					await invalidate(() => true);
				}

				break;

			case 'signup':
				console.log('Sign Up');
				goto('/signup');
				break;

			default:
				break;
		}
	};
</script>

<header>
	<img src={bannerImage} class="bg-black/50 w-full h-32" alt="Post" />
</header>
<div class="container mx-auto flex flex-col justify-center">
	<h2 class="h2 text-center my-5">{groupData?.title}</h2>

	<GroupInfo {groupData} />
	<div class=" hidden lg:flex justify-end">
		{#if session && groupData?.members}
			<MemberList {supabase} userList={groupData.members} />
		{/if}
	</div>

	<div class=" flex gap-10 mx-auto py-10">
		{#if isAdmin}
			<FfButtonPrimary
				label="Edit Group"
				clickAction={() => goto(`${window.location.pathname}/edit`)}
			/>
		{/if}
		{#if session && !joinLoading && joinAction == 'join'}
			<FfButtonPrimary label="Join" clickAction={() => joinButton(joinAction)} />
		{:else if joinAction == 'leave' && !joinLoading}
			<FfButtonRinged label="Leave" clickAction={() => joinButton(joinAction)} />
		{:else if joinAction == 'signup' && !joinLoading}
			<FfButtonPrimary label="Sign Up" clickAction={() => joinButton(joinAction)} />
		{:else}
			<FfProgessRadial size="w-8" />
		{/if}
	</div>
</div>
