<script lang="ts">
	import FormTextArea from '$lib/components/forms/FormTextArea.svelte';
	import { APIRequest } from '$lib/helpers/APIHelpers';
	import { toastStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';

	export let data: PageData;
	let { supabase, session, groupData } = data;
	//Loading for each element
	let loadingMission: boolean = false;

	interface GroupEditForm {
		mission: string;
		id: string;
	}

	let form: GroupEditForm = {
		mission: groupData.mission,
		id: groupData.id
	};

	const resetLoading = () => {
		loadingMission = false;
	};

	const submitForm = async () => {
		try {
			const response = await APIRequest(window.location.pathname, 'PUT', form);
			console.log(response);
			if (response.success) {
				toastStore.trigger({
					message: 'Group Updated Successfully',
					background: 'variant-filled-success'
				});
			} else {
				toastStore.trigger({
					message: 'Group Updated Failed',
					background: 'variant-filled-error'
				});
			}
			// Handle response...
		} catch (error) {
			console.error(error);
			// Handle error...
			toastStore.trigger({
				message: 'Group Updated Error',
				background: 'variant-filled-error'
			});
		}
		resetLoading();
	};

	$: console.log(form);
</script>

<div class="container mx-auto flex flex-col justify-center">
	<h2 class="h2 text-center my-5">{groupData?.title}</h2>
	<div class=" flex flex-col gap-10 mx-auto p-2 w-modal justify-center">
		<FormTextArea
			title="Mission"
			text={groupData.mission}
			isShown={true}
			loading={loadingMission}
			on:loading={(e) => (loadingMission = true)}
			on:change={(e) => (form.mission = e.detail)}
			on:formSubmit={submitForm}
		/>
	</div>
</div>
