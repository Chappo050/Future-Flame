<!-- src/routes/account/Avatar.svelte -->
<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import NoImage from '$lib/assets/image-not-found.jpeg';
	import { FileButton } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import MyProgessRadial from '../standardInterface/FFProgessRadial.svelte';
	import { fetchImage, uploadImage } from '$lib/helpers/supabaseHelpers';

	export let url: string;
	export let supabase: SupabaseClient;

	let avatar_url: string | undefined = undefined;
	let uploading = false;
	let loading = false;
	let files: FileList;

	const downloadImage = async (path: string) => {
		loading = true;
		avatar_url = await fetchImage(path, 'avatars', supabase);
		loading = false;
	};
	const uploadAvatar = async () => {
		uploading = true;
		url = (await uploadImage(files, 'avatars', supabase)) as string;
		uploading = false;
	};

	$: if (url) downloadImage(url);
</script>

<div class=" flex-col text-center justify-center">
	{#if avatar_url && !loading && !uploading}
		<Avatar src={avatar_url} fallback={NoImage} width="w-32" rounded="rounded-full mx-auto" />
	{:else if !avatar_url && !loading && !uploading}
		<Avatar src={NoImage} width="w-32" rounded="rounded-full mx-auto" />
	{:else}
		<MyProgessRadial />
	{/if}

	<div class="py-2" />
	<FileButton
		loading="lazy"
		bind:files
		on:change={uploadAvatar}
		disabled={uploading}
		accept="image/*"
		button="variant-soft-primary"
		>Upload
		<input type="hidden" name="avatar_url" value={url} />
	</FileButton>
</div>
