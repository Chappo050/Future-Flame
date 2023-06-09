<script lang="ts">
	import { fetchUserProfile } from '$lib/helpers/supabaseHelpers';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { SupabaseClient } from '@supabase/supabase-js';
	interface loadedUser {
		username: string;
		avatarUrl: string;
	}

	export let supabase: SupabaseClient;
	export let userList: ProfileData[];

	let avatarLoading: boolean = false;
	let loadedUsers: loadedUser[];

	const loadUser = async (userList: ProfileData[]) => {
		for await (const iterator of userList) {
			avatarLoading = true;
			const response = await fetchUserProfile(iterator.avatar_url, supabase);
			if (response) {
				loadedUsers.push({
					username: response.userData.username,
					avatarUrl: response.avatarUrl || ''
				});
			}

			avatarLoading = false;
		}
	};

	$: if (userList) loadUser(userList);
</script>

<dl class="list-dl">
	{#each loadedUsers as user}
		<div>
			<Avatar src={user.avatarUrl} width="w-32" rounded="rounded-full" />
			<span class="flex-auto">
				<dt>{user.username}</dt>
				<dd>Description</dd>
			</span>
		</div>
	{/each}
</dl>
