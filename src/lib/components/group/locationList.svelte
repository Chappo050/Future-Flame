<script lang="ts">
	export let locations: MarkerData[] = [];
</script>

<dl class="list-dl">
	<div>
		<span class="flex-auto">
			{#each locations as location, index (location)}
				<div class="flex">
					<span class="badge bg-primary-500 text-white">{index + 1}</span>
					<dt>{location.address}</dt>
				</div>
			{/each}
		</span>
	</div>
</dl>
