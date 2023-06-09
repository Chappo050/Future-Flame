<script lang="ts">
	import { invalidate } from '$app/navigation';
	import MemberList from '$lib/components/group/MemberList.svelte';
	import FfButtonPrimary from '$lib/components/standardInterface/FFButtonPrimary.svelte';
	import { fetchImage } from '$lib/helpers/supabaseHelpers.js';
	import { toastStore, type ModalSettings, modalStore } from '@skeletonlabs/skeleton';

	//Loaded data
	export let data;
	let { supabase, session, group } = data;
	let loadingBanner: boolean = false;
	let bannerImage: string;

	const downloadImages = async (path: string) => {
		loadingBanner = true;
		bannerImage = (await fetchImage(path, 'banners', supabase)) as string;
		console.log(bannerImage);

		loadingBanner = false;
	};

	$: if (group) downloadImages(group.bannerImage);

	// //Component Modal
	// function modalComponentForm(): void {
	// 	const c = { ref: CreateGroupModal };
	// 	const modal: ModalSettings = {
	// 		type: 'component',
	// 		component: c,
	// 		title: 'Custom Form Component',
	// 		body: 'Complete the form below and then press submit.',
	// 		meta: { supabase: supabase },
	// 		response: async (r: any) => {
	// 			if (r) {
	// 				console.log(r);

	// 				await fetch(`/groups`, {
	// 					method: 'POST',
	// 					body: JSON.stringify(r),
	// 					headers: {
	// 						'content-type': 'application/json'
	// 					}
	// 				});
	// 				await invalidate(() => true);
	// 				toastStore.trigger({
	// 					message: 'Group Created Successfully',
	// 					background: 'variant-ghost-success'
	// 				});

	// 				return;
	// 			}
	// 			toastStore.trigger({
	// 				message: 'Creation cancelled.',
	// 				background: 'variant-ghost-error'
	// 			});
	// 		}
	// 	};
	// 	modalStore.trigger(modal);
	// }
</script>

<header>
	<img src={bannerImage} class="bg-black/50 w-full h-32" alt="Post" />
</header>
<div class="container mx-auto flex flex-col justify-center pt-10">
	<h2 class="h2">{group?.title}</h2>
	<!-- <MemberList {supabase} userList={[]} /> -->
</div>
