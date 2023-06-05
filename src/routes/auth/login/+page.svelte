<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import { enhance, type SubmitFunction } from '$app/forms';

	export let data;
	let loading = false;
	//Can be used to enhance form submissions
	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<div class=" flex h-3/4 justify-center items-center">
	<Auth
		providers={['google']}
		supabaseClient={data.supabase}
		view="sign_in"
		redirectTo={`${data.url}/loading?redirect=/`}
		showLinks={true}
		appearance={{
			theme: ThemeSupa
		}}
		additionalData={[]}
	/>
	<form action="?/signInGoogle" method="post" use:enhance={handleSubmit}>
		<button class="btn variant-filled" type="submit">Google</button>
	</form>
</div>
