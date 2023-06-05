<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { SocialAuth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';

	export let data: any;
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<div class=" flex h-3/4 justify-center items-center">
	<SocialAuth
		providers={['google']}
		supabaseClient={data.supabase}
		redirectTo={`${data.url}/loading?redirect=/`}
		appearance={{
			theme: ThemeSupa
		}}
	/>
</div>
