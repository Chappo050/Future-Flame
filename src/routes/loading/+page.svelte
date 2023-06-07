<!-- src/routes/logging-in/+page.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import MyProgessRadial from '$lib/components/standardInterface/FFProgessRadial.svelte';

	export let data;
	$: {
		const redirectTo = $page.url.searchParams.get('redirect');

		// check if user has been set in session store then redirect
		if (browser && data.session) {
			goto(redirectTo ?? '/account');
		}
	}
</script>

<section>
	<MyProgessRadial />
</section>
