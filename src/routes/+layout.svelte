<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	//Skeleton
	import {
		AppShell,
		AppBar,
		Drawer,
		drawerStore,
		Toast,
		Modal,
		type DrawerSettings
	} from '@skeletonlabs/skeleton';

	//Analytics
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	inject({ mode: dev ? 'development' : 'production' });

	//Components
	import Fa from 'svelte-fa';
	import { faBars } from '@fortawesome/free-solid-svg-icons';
	import SideNav from '$lib/components/global/SideNav.svelte';
	import Hamburger from '$lib/svgs/Hamburger.svelte';
	import { navigating } from '$app/stores';

	//Other
	import logo from '$lib/assets/future-flame-logo-zip-linear/svg/logo-no-background.svg';

	//SuperBase Auth Setup
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import GroupCardPlaceholder from '$lib/components/placeholders/GenericPlaceholder.svelte';

	export let data;

	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	const drawSettings: DrawerSettings = {
		width: 'w-2/3'
	};
	function drawerOpen(): void {
		drawerStore.open(drawSettings);
	}
</script>

<Toast position="br" />
<Drawer><SideNav {session} /></Drawer>
<Modal />
<!-- App Shell -->
<AppShell
	regionPage="relative hide-scrollbar"
	slotPageHeader=" top-0 z-10"
	slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64"
>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar
			gridColumns="grid-cols-3"
			slotDefault="place-self-center"
			slotTrail="place-content-end"
			padding="py-1 px-5"
		>
			<svelte:fragment slot="lead">
				<a href="/" class=" p-0 m-0 hidden lg:block"
					><img src={logo} class="h-12" alt="Future Flame Logo" />
				</a>
				<div class="flex items-center">
					<button on:click={drawerOpen} class="lg:hidden btn btn-icon-sm justify-end">
						<span>
							<Fa icon={faBars} size="1.5x" />
						</span>
					</button>
				</div>
			</svelte:fragment>
			<a href="/" class=" block lg:hidden p-0 m-0"
				><img src={logo} class="h-12" alt="Future Flame Logo" />
			</a>

			<svelte:fragment slot="trail">
				{#if session}
					<a href="/account" class="btn hidden md:block variant-ringed-primary">Account</a>
				{:else}
					<a href="/auth/signin" class="btn hidden md:block variant-ringed-primary">Login</a>
					<a href="/auth/signup" class="btn btn-sm md:btn variant-filled-primary">Get Started</a>
				{/if}
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft"><SideNav {session} /></svelte:fragment>
	<!-- Page Route Content -->
	{#if $navigating}
		<GroupCardPlaceholder />
	{:else}
		<slot />
	{/if}

	<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
</AppShell>
