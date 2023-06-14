<script lang="ts">
	import { fetchImage } from '$lib/helpers/supabaseHelpers';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import FfProgessRadial from '../standardInterface/FFProgessRadial.svelte';

	export let supabase: SupabaseClient;
	export let userList: ProfileData[];
</script>

<div>
	{#if userList.length}
		<dl class="list-nav w-max-lg max-h-40 overflow-auto">
			<p class="text-center">Member List</p>
			<hr />
			<ul>
				{#each userList as user}
					<li>
						<a href="/profile/{user.id}">
							{#await fetchImage(user.avatar_url, 'avatars', supabase) || ''}) || ''}
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

		{#if userList.length == 1}
			<p class="text-center">{userList.length} Member</p>
		{:else}
			<p class="text-center">{userList.length} Members</p>
		{/if}
	{/if}
</div>
