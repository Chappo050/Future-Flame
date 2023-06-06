<script lang="ts">
	// Import Section
	import type { PageData } from './$types';
	import { noteStore } from '$lib/stores/note';
	import { InputChip, toastStore, type ToastSettings, focusTrap } from '@skeletonlabs/skeleton';
	import { enhance } from '$app/forms';

	// Variables declaration Section
	export let data: PageData;
	export let form: any;
	let loadedData: any | null = [];
	let selected: string = '';
	let title: string = '';
	let content: string = '';
	let tags: string[] = [];
	let isFocused: boolean = true;
	const t: ToastSettings = {
		message: 'Note created successfully',
		background: 'variant-filled-success'
	};

	// Function declaration Section
	// // Loading data from database server-side example
	// async function loadData() {
	// 	const { data: result } = await data.supabase.from('test').select('*').limit(20);
	// 	loadedData = result;
	// }

	// Functions using stores
	function createNote(): void {
		noteStore.update((notes) => [
			...notes,
			{
				id: crypto.randomUUID(),
				title,
				selected,
				content,
				tags
			}
		]);
		resetForm();
		toastStore.trigger(t);
	}

	function resetForm(): void {
		form = null;
		title = '';
		tags = [];
		content = '';
		selected = '';
	}

	// Computed Section
	// Client-side RLS
	// $: if (data.session) {
	// 	loadData();
	// }

	// $: ({ tableData } = data);

	$: if (form?.success) {
		resetForm();
		toastStore.trigger(t);
	}
</script>

<!-- FORM -->
<div class="flex justify-center items-center h-full">
	{#if data.session}
		<form
			method="post"
			action="?/createPost"
			use:enhance
			use:focusTrap={isFocused}
			class="card flex-col p-4"
		>
			<div class="flex justify-center space-x-2">
				<label class="label">
					<span>Input</span>
					<input
						value={form?.title ?? ''}
						class="input"
						name="title"
						type="text"
						placeholder="Input"
					/>
				</label>

				<label class="label">
					<span>Select</span>
					<select value={form?.selected ?? ''} name="selected" class="select">
						{#each loadedData as option}
							<option value={option.value}>{option.text}</option>
						{/each}
					</select>
				</label>
			</div>
			<div class="p-2">
				<InputChip bind:value={tags} name="tags[]" placeholder="Enter any value..." />
			</div>
			<div class="flex justify-center space-x-2">
				<label class="label">
					<span>Textarea</span>
					<textarea
						value={form?.content ?? ''}
						class="textarea"
						name="content"
						rows="4"
						placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit."
					/>
				</label>
			</div>
			<button type="submit" class="btn w-full variant-filled-primary">Submit</button>
		</form>
	{/if}
</div>
