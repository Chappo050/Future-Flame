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
		{#if session}
			<li>
				<a href="/" class={classesActive('/')} data-sveltekit-preload-data on:click={drawerClose}
					>Home</a
				>
			</li>
		{:else}
			<li>
				<a
					href="/landing"
					class={classesActive('/')}
					data-sveltekit-preload-data
					on:click={drawerClose}>Home</a
				>
			</li>
		{/if}

		<li>
			<a
				href="/groups"
				class={classesActive('/groups')}
				data-sveltekit-preload-data
				on:click={drawerClose}>Groups</a
			>
		</li>
		{#if session}
			<li>
				<a href="/example" class={classesActive('/example')} on:click={drawerClose}>Example</a>
			</li>
		{/if}
	</ul>
</nav>

<div class="flex justify-center items-center pt-5">
	<LightSwitch />
</div>
