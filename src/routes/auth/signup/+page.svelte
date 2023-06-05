<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import Google from '$lib/svgs/Google.svelte';
	const submitSocialLogin: SubmitFunction = async ({ action, cancel }: any) => {};
</script>

<main class="flex flex-col justify-center items-center h-1/2">
	<h1 class="h1">Sign Up</h1>
	<form action="?/register" method="POST" class="flex flex-col gap-5">
		<label class="label"
			><span> Email </span>
			<input class="input" type="text" name="email" />
		</label>
		<label class="label"
			><span> Username </span>
			<input class="input" type="text" name="username" />
		</label>

		<label class="label"
			><span> Password </span>
			<input class="input" type="password" name="password" />
		</label>
		<label class="label"
			><span> Confirm Password </span>
			<input class="input" type="password" name="confirmPassword" />
		</label>

		<button type="submit" class="btn variant-filled-primary justify-center">Sign Up</button>
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
