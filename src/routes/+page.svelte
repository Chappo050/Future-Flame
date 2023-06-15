<script lang="ts">
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import CreateGroupModal from '$lib/components/modals/createGroupModal.svelte';
	import FfButtonPrimary from '$lib/components/standardInterface/FFButtonPrimary.svelte';
	import FfCarousel from '$lib/components/standardInterface/FFCarousel.svelte';
	import FfGroupCard from '$lib/components/standardInterface/FFGroupCard.svelte';
	import { toastStore, type ModalSettings, modalStore } from '@skeletonlabs/skeleton';

	//Icons

	//Loaded data
	export let data;
	let groups: GroupData[] = [];
	let { supabase, session } = data;
	let myGroups: GroupData[] = [];
	let memberGroups: GroupData[] = [];
	// let createLoading: boolean = false;
	$: groups = data.groups || [];

	$: if (groups) {
		console.log(groups.length);
		myGroups = [];
		memberGroups = [];
		groups.forEach((group) => {
			if (group.user_id == session?.user.id) {
				console.log('Owner', group);

				myGroups.push(group);
			} else {
				console.log('member', group);
				memberGroups.push(group);
			}
		});
	}
	//Component Modal For Group Form
	function createGroupModalComponentForm(): void {
		const c = { ref: CreateGroupModal };
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: 'Custom Form Component',
			body: 'Complete the form below and then press submit.',
			meta: { supabase: supabase },
			response: async (r: any) => {
				if (r) {
					// createLoading = true;
					// const response = await APIRequest('/groups', 'POST', r);

					if (r.success) {
						toastStore.trigger({
							message: 'Group Created Successfully',
							background: 'variant-ghost-success'
						});
						// createLoading = false;
						goto(`/groups/${r.response.slug}`);
					} else {
						toastStore.trigger({
							message: 'Group Creation Failed, Please Try Again',
							background: 'variant-ghost-error'
						});
						// createLoading = false;
					}

					return;
				}
				toastStore.trigger({
					message: 'Creation cancelled.',
					background: 'variant-ghost-error'
				});
			}
		};
		modalStore.trigger(modal);
	}
</script>

<div class="container h-full mx-auto w-full flex justify-center pt-10">
	<!-- Landing Page for logged in users -->
	{#if session}
		<div class="space-y-10 text-center flex flex-col items-center">
			<h2 class="h2">Feed</h2>

			{#if myGroups?.length}
				<div class="flex flex-col justify-center w-screen sm:w-auto m-auto">
					<div class="ml-10 flex">
						<h3 class="h3 mr-auto">My Groups</h3>
						<FfButtonPrimary
							clickAction={createGroupModalComponentForm}
							icon={'faCirclePlus'}
							label="Create"
						/>
					</div>

					<hr class="my-3" />
					<FfCarousel groups={myGroups} {supabase} />
				</div>
			{/if}
			{#if memberGroups?.length}
				<div class="flex flex-col justify-center w-screen sm:w-auto m-auto">
					<div class="ml-10 flex">
						<h3 class="h3 mr-auto">Joined Group</h3>
					</div>
					<hr class="my-3" />
					<FfCarousel groups={memberGroups} {supabase} />
				</div>
			{/if}
			<div class="flex flex-col justify-center space-x-10 m-16">
				<h3 class="h3 mr-auto">Feed</h3>
				<hr class="my-3" />
			</div>
		</div>
	{:else}
		<!-- Landing page for new users -->
	{/if}
</div>
