<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	let tabSet: number = 0;
	export let groupData: GroupData | null | undefined;
</script>

<div class="w-full px-5 lg:px-0">
	<TabGroup>
		<Tab bind:group={tabSet} name="tab1" value={0}>Mission</Tab>
		<Tab bind:group={tabSet} name="tab2" value={1}>Location</Tab>
		<Tab bind:group={tabSet} name="tab3" value={2}>Social</Tab>
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
