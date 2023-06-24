<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import LocationAndMap from './LocationAndMap.svelte';

	let tabSet: number = 0;
	export let groupData: GroupData | null | undefined;

	export let isAdmin = false;
</script>

<div class="w-full px-5">
	<TabGroup>
		<Tab bind:group={tabSet} name="tab1" value={0}>Mission</Tab>
		<Tab bind:group={tabSet} name="tab2" value={1}>Location</Tab>
		<Tab bind:group={tabSet} name="tab3" value={2}>Social</Tab>
		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			<div class=" max-h-80 overflow-y-auto overflow-x-hidden">
				{#if tabSet === 0}
					{groupData?.mission || 'Data fail to load'}
				{:else if tabSet === 1}
					<LocationAndMap {isAdmin} groupId={groupData?.id} />
				{:else if tabSet === 2}
					(tab panel 3 contents)
				{/if}
			</div>
		</svelte:fragment>
	</TabGroup>
</div>
