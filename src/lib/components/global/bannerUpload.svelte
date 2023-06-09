<!-- src/routes/account/Avatar.svelte -->
<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import NoImage from '$lib/assets/image-not-found.jpeg';
	import { createEventDispatcher } from 'svelte';
	import { FileButton } from '@skeletonlabs/skeleton';
	import MyProgessRadial from '../standardInterface/FFProgessRadial.svelte';
	import { fetchImage, uploadImage } from '$lib/helpers/supabaseHelpers';

	export let url: string;
	export let supabase: SupabaseClient;

	let bannerImage: string | undefined = undefined;
	let uploading = false;
	let loading = false;
	let files: FileList;

	const downloadImage = async (path: string) => {
		loading = true;
		console.log('get image', path);
		bannerImage = await fetchImage(path, 'banners', supabase);
		loading = false;
	};

	const uploadAvatar = async () => {
		uploading = true;
		url = (await uploadImage(files, 'banners', supabase)) as string;
		uploading = false;
	};

	$: if (url) downloadImage(url);
</script>

<div class=" flex-col text-center justify-center">
	<p>Banner Image</p>
	{#if bannerImage && !loading && !uploading}
		<header>
			<img src={bannerImage} alt="banner" class="bg-black/50 w-full h-32" />
		</header>
	{:else if !bannerImage && !loading && !uploading}
		<header>
			<img src={NoImage} a alt="banner" class="bg-black/50 w-full h-32" />
		</header>
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
		<input type="hidden" name="bannerImage" value={url} />
	</FileButton>
</div>
