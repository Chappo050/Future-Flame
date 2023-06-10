<script lang="ts">
	import { fetchImage } from '$lib/helpers/supabaseHelpers';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import FfProgessRadial from '../standardInterface/FFProgessRadial.svelte';

	export let supabase: SupabaseClient;
	export let userList: ProfileData[];
	console.log(' Got data', userList);

	// onMount(async () => {
	// 	console.log('Fetching image');

	// 	for (let user of userList) {
	// 		user.avatar_url = (await fetchImage(user.avatar_url, 'avatars', supabase)) || '';
	// 	}
	// });

	// $: if (userList) {
	// 	console.log('test', );

	// 	(async () => {
	// 		for (let user of userList) {
	// 			user.avatar_url = (await fetchImage(user.avatar_url, 'avatars', supabase)) || '';
	// 		}
	// 	})();
	// }
</script>

<dl class="list-nav w-max-lg">
	<ul>
		{#each userList as user}
			<li>
				<a href="/profile/{user.id}">
					{#await fetchImage(user.avatar_url, 'avatars', supabase) || ''}
						<FfProgessRadial size="w-12" />
					{:then src}
						<Avatar {src} width="w-12" rounded="rounded-full" />
					{/await}

					<span class="flex-auto">
						<dt>{user.username}</dt>
						{#if user.role}
							<dd>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</dd>
						{/if}
					</span>
				</a>
			</li>
		{/each}
	</ul>
</dl>
