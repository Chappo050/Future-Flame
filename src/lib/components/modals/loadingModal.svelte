<script lang="ts">
	// import type { SupabaseClient } from '@supabase/supabase-js';
	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';
	import FfProgessRadial from '../standardInterface/FFProgessRadial.svelte';
	// Props
	export let parent: any;
	//Variables
	// let supabase: SupabaseClient = $modalStore[0].meta.supabase;

	modalStore.close();
	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}">
			<FfProgessRadial />
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
    </footer>
	</div>
{/if}
