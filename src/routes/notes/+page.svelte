<script lang="ts">
	import { noteStore } from '$lib/stores/note';
	import { toastStore, type ModalSettings, modalStore } from '@skeletonlabs/skeleton';

	function deleteNote(noteId: string): void {
		const confirmDelete: ModalSettings = {
			type: 'confirm',
			title: 'Delete Note',
			body: ' Are you sure you want to delete this note?',
			response: (r: boolean) => {
				if (r) {
					noteStore.update((notes) => notes.filter((n) => n.id !== noteId));
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
			{#each $noteStore as note}
				<div class="card p-4 variant-soft relative flex flex-col gap-2">
					<button
						on:click={() => deleteNote(note.id)}
						class="btn-icon btn-icon-sm variant-filled-error absolute -top-1.5 -right-1.5">X</button
					>
					<h2 class="h2">
						{note.title}
					</h2>
					<div>
						{note.content}
					</div>
					<div>
						{note.selected}
					</div>
					<div class="flex gap-1 flex-wrap">
						{#each note?.tags as tag}
							<span class="badge variant-filled-primary">{tag}</span>
						{/each}
					</div>
					<small>
						{note.id}
					</small>
				</div>
			{/each}
		</div>
	</div>
</div>
