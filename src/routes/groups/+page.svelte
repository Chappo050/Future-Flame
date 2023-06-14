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
	// let createLoading: boolean = false;
	$: groups = data.groups || [];

	$: if (groups) {
		console.log(groups.length);
		myGroups = [];
		groups.forEach((group) => {
			if (group.user_id == session?.user.id) {
				myGroups.push(group);
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

<div class="container h-full mx-auto flex justify-center pt-10">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h2 class="h2">Explore groups</h2>

		<FfButtonPrimary
			clickAction={createGroupModalComponentForm}
			icon={'faCirclePlus'}
			label="Create"
		/>
		{#if myGroups.length}
			<div class="flex justify-center space-x-10 m-16">
				<FfCarousel {myGroups} {supabase} />
			</div>
		{/if}
		<h3 class="h3">Find Groups</h3>
		<div class="flex justify-center space-x-10">
			<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 m-5">
				{#each groups as group}
					{#if group.user_id != session?.user.id}
						<FfGroupCard {group} {supabase} />
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>
