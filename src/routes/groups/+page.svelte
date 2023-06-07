<script lang="ts">
	import CreateGroupModal from '$lib/components/modals/createGroupModal.svelte';
	import FfButtonPrimary from '$lib/components/standardInterface/FFButtonPrimary.svelte';
	import FfCard from '$lib/components/standardInterface/FFCard.svelte';
	import { toastStore, type ModalSettings, modalStore } from '@skeletonlabs/skeleton';
	export let data;
	let { supabase } = data;

	//Component Modal
	function modalComponentForm(): void {
		const c = { ref: CreateGroupModal };
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: 'Custom Form Component',
			body: 'Complete the form below and then press submit.',
			meta: { supabase: supabase },
			response: async (r: any) => {
				if (r) {
					console.log(r);

					await fetch(`/groups`, {
						method: 'POST',
						body: JSON.stringify(r),
						headers: {
							'content-type': 'application/json'
						}
					});
					toastStore.trigger({
						message: 'Note Created Successfully',
						background: 'variant-ghost-success'
					});
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
		<FfButtonPrimary clickAction={modalComponentForm} icon={null} label="Create" />
		<div class="flex justify-center space-x-10">
			<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 m-5">
				<FfCard />
				<FfCard />
				<FfCard />
				<FfCard />
			</div>
		</div>
	</div>
</div>
