<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	let tabSet: number = 0;
	export let groupData: GroupData | null | undefined;
</script>

<div class="w-full">
	<TabGroup>
		<Tab bind:group={tabSet} name="tab1" value={0}>Location</Tab>

		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			<div class=" max-h-40 overflow-y-auto overflow-x-hidden">
				{#if tabSet === 0}
					{groupData?.mission || 'Data fail to load'}
				{:else if tabSet === 1}
					(tab panel 2 contents)
				{:else if tabSet === 2}
					(tab panel 3 contents)
				{/if}
			</div>
		</svelte:fragment>
	</TabGroup>
</div>
