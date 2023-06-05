<script lang="ts">
	import { page } from '$app/stores';
	import { LightSwitch, drawerStore } from '@skeletonlabs/skeleton';

	$: classesActive = (href: string) => (href === $page.url.pathname ? '!bg-primary-400' : '');

	function drawerClose(): void {
		drawerStore.close();
	}
	export let session: any;
</script>

<nav class="list-nav p-4 flex flex-col justify-center items-left">
	<ul>
		<li><a href="/" class={classesActive('/')} on:click={drawerClose}>Home</a></li>
		<li><a href="/groups" class={classesActive('/groups')} on:click={drawerClose}>Groups</a></li>
		<li><a href="/notes" class={classesActive('/notes')} on:click={drawerClose}>Notes</a></li>
		{#if session}
			<li>
				<a href="/example" class={classesActive('/example')} on:click={drawerClose}>Example</a>
			</li>
		{/if}
		<li><a href="/Other" class={classesActive('/other')} on:click={drawerClose}>Other</a></li>
	</ul>
</nav>

<div class="flex justify-center items-center pt-5">
	<LightSwitch />
</div>
