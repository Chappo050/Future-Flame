<script lang="ts">
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import GroupInfo from '$lib/components/group/GroupInfo.svelte';
	import Location from '$lib/components/group/Location.svelte';
	import MemberList from '$lib/components/group/MemberList.svelte';
	import PostBlock from '$lib/components/group/PostColumn.svelte';
	import FfButtonPrimary from '$lib/components/standardInterface/FFButtonPrimary.svelte';
	import FfButtonRinged from '$lib/components/standardInterface/FFButtonRinged.svelte';
	import FfProgessRadial from '$lib/components/standardInterface/FFProgessRadial.svelte';
	import { APIRequest } from '$lib/helpers/APIHelpers.js';
	import { fetchImage } from '$lib/helpers/frontend/supabaseHelpers.js';
	import { toastStore, type ModalSettings, modalStore } from '@skeletonlabs/skeleton';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';

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
	let isMember: boolean = false;
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
			isAdmin = groupData?.members.find(
				(user) => user.role === 'admin' && user.id === session.user.id
			);
			console.log('Group admin check', session.user.id, groupData.members, isAdmin);

			//Check user member status
			isMember = groupData?.members.some((item) => item.id === session?.user.id);
			console.log('User Exists', isMember);

			if (isMember) {
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
		const groupSlug = url.split('/').pop();

		switch (action) {
			case 'join':
				console.log('join');
				const responseJoin = await APIRequest(window.location.pathname, 'PUT', {
					groupSlug: groupSlug,
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
					groupSlug: groupSlug,
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
	<button class="button">TEST</button>
	<h2 class="h2 text-center my-5">{groupData?.title}</h2>

	<GroupInfo {groupData} />
	<div class="lg:grid lg:grid-cols-6">
		<!-- Group Posts -->
		<div />
		<div class="justify-center my-10 col-span-3">
			<PostBlock {supabase} {session} {isMember} groupId={groupData?.id} posts={groupData?.posts} />
		</div>

		<div class=" flex-col">
			{#if session && groupData?.members}
				<MemberList {supabase} userList={groupData.members} />
			{/if}
			<div class=" flex gap-10 mx-auto py-10 justify-center">
				{#if isAdmin}
					<FfButtonPrimary
						label="Edit Group"
						icon="faPencil"
						clickAction={() => goto(`${window.location.pathname}/edit`)}
					/>
				{/if}
				{#if session && !joinLoading && joinAction == 'join'}
					<FfButtonPrimary
						label="Join"
						icon="faCirclePlus"
						clickAction={() => joinButton(joinAction)}
					/>
				{:else if joinAction == 'leave' && !joinLoading}
					<FfButtonRinged label="Leave" clickAction={() => joinButton(joinAction)} />
				{:else if joinAction == 'signup' && !joinLoading}
					<FfButtonPrimary label="Sign Up" clickAction={() => joinButton(joinAction)} />
				{:else}
					<FfProgessRadial size="w-8" />
				{/if}
			</div>
		</div>
	</div>
</div>
