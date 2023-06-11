// src/routes/profile/+page.ts
import type { PageLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent }) => {
	const { supabase, session } = await parent(); //Get session
	console.log('loading data');

	const { data, error } = await supabase.from('groups').select('*');

	const groupNoCount = data as GroupData[];

	if (error) {
		return fail(500, {
			supabaseErrorMessage: error.message
		});
	}

	const { data: memberCount, error: memberCountError } = await supabase
		.from('group_members_count')
		.select('*');

	console.log('GOT', groupNoCount, memberCount);

	if (memberCountError) {
		console.error('Error retrieving data from view:', memberCountError);
		return fail(500, {
			supabaseErrorMessage: memberCountError.message
		});
	}
	const groups: GroupData[] = groupNoCount.map((group) => {
		const count = memberCount.find((item) => item.group_id == group.id);
		group.memberCount = count?.member_count | 0;
		return group;
	});

	return { session, groups };
};
