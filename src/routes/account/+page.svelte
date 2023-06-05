<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import Avatar from '$lib/components/account/Avatar.svelte';
	import MyProgessRadial from '$lib/components/global/MyProgessRadial.svelte';

	export let data;
	export let form;

	let { session, supabase, profile } = data;

	let profileForm: any;
	let loading = false;

	//populate fields
	let fullName: string = profile?.full_name ?? '';
	let username: string = profile?.username ?? '';
	let avatar_url: string = profile?.avatar_url ?? '';
	let website: string = profile?.full_name ?? '';

	//Can be used to enhance form submissions
	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }: any) => {
			loading = false;
			update();
		};
	};
</script>

<div class="flex justify-center items-center pt-10">
	<form
		class="gap-4 flex flex-col justify-center"
		method="post"
		action="?/update"
		use:enhance={handleSubmit}
		bind:this={profileForm}
	>
		<div class=" justify-center flex">
			<Avatar
				{supabase}
				bind:url={avatar_url}
				size={10}
				on:upload={() => {
					profileForm.requestSubmit();
				}}
			/>
		</div>

		<label class="label"
			><span> Email </span>
			<input class="input" type="text" value={session.user.email} disabled />
		</label>

		<label class="label"
			><span> Full Name </span>
			<input class="input" name="full_name" type="text" value={form?.fullName ?? fullName} />
		</label>

		<label class="label">
			<span>Username</span>
			<input class="input" name="username" type="text" value={form?.username ?? username} />
		</label>
		<label class="label">
			<span>Website</span>
			<input class="input" name="website" type="text" value={form?.website ?? website} />
		</label>
		<div class=" flex justify-evenly pt-4">
			{#if loading}
				<MyProgessRadial />
			{:else}
				<button type="submit" class="btn variant-filled-primary" disabled={loading}>Update</button>
				<form method="post" action="?/signout" use:enhance={handleSignOut}>
					<button type="submit" class="btn variant-filled-secondary" disabled={loading}
						>Sign Out</button
					>
				</form>
			{/if}
		</div>
	</form>
</div>
