<!-- src/routes/account/Avatar.svelte -->
<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import NoImage from '$lib/assets/image-not-found.jpeg';
	import { createEventDispatcher } from 'svelte';
	import { FileButton } from '@skeletonlabs/skeleton';
	import { Avatar } from '@skeletonlabs/skeleton';
	import MyProgessRadial from '../global/MyProgessRadial.svelte';

	export let size = 10;
	export let url: string;
	export let supabase: SupabaseClient;

	let avatar_url: string | undefined = undefined;
	let uploading = false;
	let loading = false;
	let files: FileList;

	const dispatch = createEventDispatcher();
	const downloadImage = async (path: string) => {
		loading = true;
		try {
			const { data, error } = await supabase.storage.from('avatars').download(path);

			if (error) {
				throw error;
			}

			const url = URL.createObjectURL(data);
			avatar_url = url;
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message);
			}
		}
		loading = false;
	};
	const uploadAvatar = async () => {
		try {
			uploading = true;

			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.');
			}

			const file = files[0];
			const fileExt = file.name.split('.').pop();
			url = `${Math.random()}.${fileExt}`;

			let { data, error } = await supabase.storage.from('avatars').upload(url, file);
			if (error) {
				throw error;
			}
			dispatch('upload');
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			uploading = false;
		}
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

<!-- <div class=" flex-col text-center justify-center">
	{#if avatar_url}
		<Avatar src={avatar_url} width="w-32" rounded="rounded-full mx-auto" />
	{:else}
		<div class="avatar no-image" style="height: {size}em; width: {size}em;" />
	{/if}

	<FileButton
		name="avatar_url"
		bind:files
		on:change={uploadAvatar}
		disabled={uploading}
		accept="image/*"
		button="variant-soft-primary">Upload</FileButton
	>
</div> -->
