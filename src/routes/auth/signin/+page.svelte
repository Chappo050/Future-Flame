<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import Google from '$lib/svgs/Google.svelte';

	const submitSocialLogin: SubmitFunction = async ({ action, cancel }: any) => {};
</script>

<main class="flex flex-col justify-center items-center h-full">
	<h1 class="h1">Login</h1>
	<form action="?/login" method="POST" class="flex flex-col gap-5">
		<label class="label"
			><span> Email </span>
			<input class="input" type="text" name="email" />
		</label>

		<label class="label"
			><span> Password </span>
			<input class="input" type="password" name="password" />
		</label>

		<button type="submit" class="btn variant-filled-primary justify-center">Login</button>
	</form>
	<form
		class="socials"
		action="?/login&provider=google"
		method="POST"
		use:enhance={submitSocialLogin}
	>
		<div class="py-5" />
		<button class="btn variant-filled flex gap-2"><Google /> Google</button>
	</form>
</main>
