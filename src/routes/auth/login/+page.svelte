<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import Login from '$lib/components/auth/Login.svelte';

	export let data;
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
	<Login data />
</div>
