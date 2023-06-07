<script lang="ts">
	import { toastStore, type ModalSettings, modalStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';
	//Load data
	export let data: PageData;

	//Grab posts from the data object
	$: ({ posts } = data);

	function deleteNote(postID: string): void {
		const confirmDelete: ModalSettings = {
			type: 'confirm',
			title: 'Delete Note',
			body: ' Are you sure you want to delete this note?',
			response: async (r: boolean) => {
				if (r) {
					await fetch(`/notes?postID=${postID}`, {
						method: 'DELETE'
					});
					await invalidate(() => true);
					toastStore.trigger({
						message: 'Note Deleted Successfully',
						background: 'variant-ghost-success'
					});
					return;
				}
				toastStore.trigger({
					message: 'Note not deleted.',
					background: 'variant-ghost-error'
				});
			}
		};
		modalStore.trigger(confirmDelete);
	}
</script>

<div class="container h-full w-fit mx-auto flex">
	<div class="p-5">
		<div class="flex items-center justify-center">
			<h1 class="h1">Notes</h1>
		</div>
		<div class="grid grid-cols-2 gap-10 mt-5">
			{#if posts}
				{#each posts as post}
					<div class="card p-4 variant-soft relative flex flex-col gap-2">
						<button
							type="submit"
							on:click={() => deleteNote(post.id)}
							class="btn-icon btn-icon-sm variant-filled-error absolute -top-1.5 -right-1.5"
							>X</button
						>
						<h2 class="h2">
							{post?.title}
						</h2>
						<div>
							{post?.content}
						</div>
						<div>
							{post?.selected}
						</div>
						<div class="flex gap-1 flex-wrap">
							{#if post?.tags}
								{#each post?.tags as tag}
									<span class="badge variant-filled-primary">{tag}</span>
								{/each}
							{/if}
						</div>
						<small>
							{post.id}
						</small>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
