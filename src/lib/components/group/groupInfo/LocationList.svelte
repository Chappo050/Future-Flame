<script lang="ts">
	import Fa from 'svelte-fa';
	import { faPencil, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';

	// Create a new event dispatcher
	const dispatch = createEventDispatcher();
	export let isAdmin: boolean = false;
	export let locations: MarkerData[] = [];

	// Writable store to keep track of the items in edit mode
	const editing = writable(Array(locations.length).fill(false));
	let inputElements: any = [];

	const updateLocation = () => {
		console.log('sending update');

		dispatch('updateLocation', locations);
	};
</script>

<dl class="list-dl">
	<div>
		<span class="flex-auto">
			{#each locations as location, index (location)}
				<div class="flex">
					<span class="badge bg-primary-500 text-white">{index + 1}</span>
					<dt class="max-w-md whitespace-normal"><strong>{location.address}</strong></dt>
					{#if $editing[index] && isAdmin}
						<button
							class="btn btn-icon"
							on:click={() => {
								updateLocation();
								$editing[index] = false;
							}}><Fa icon={faCircleCheck} size="1.0x" /></button
						>
					{:else if isAdmin}
						<button
							on:click={() => {
								$editing[index] = true;
								Promise.resolve().then(() => {
									if (inputElements[index]) inputElements[index].focus();
								});
							}}
							class="btn btn-icon"
						>
							<Fa icon={faPencil} size="1.0x" /></button
						>
					{/if}
				</div>

				{#if location.description && !$editing[index]}
					<p class="max-w-md text-base whitespace-normal text-center">{location.description}</p>
				{:else if $editing[index] && isAdmin}
					<input
						type="text"
						class="input"
						bind:this={inputElements[index]}
						bind:value={location.description}
						maxlength="50"
						on:keydown={(e) => {
							if (e.key === 'Enter') {
								updateLocation();
								$editing[index] = false;
							}
						}}
					/>
				{/if}
			{/each}
		</span>
	</div>
</dl>
