// src/routes/profile/+page.ts
import { handleError } from '$lib/helpers/APIHelpers';
import type { PageLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent }) => {
	const { supabase, session } = await parent(); //Get session

	if (!session) return { message: 'No user, load landing page' };

	const { data: visisbleGroups, error: visisbleGroupsError } = await supabase
		.from('user_group_ids')
		.select('*')
		.single();

	handleError(visisbleGroupsError, 'Selecting all groups error');

	if (!visisbleGroups?.group_ids?.length)
		handleError(visisbleGroups, 'Selecting all groups data error');

	const { data: groupData, error: groupDataError } = await supabase
		.from('groups')
		.select('*')
		.in('id', visisbleGroups?.group_ids);

	handleError(groupDataError, 'Selecting all groups error');

	const groupNoCount = groupData as GroupData[];

	const { data: memberCount, error: memberCountError } = await supabase
		.from('group_members_count')
		.select('*');

	handleError(memberCountError, 'Member count error');

	console.log('GOT', groupNoCount, memberCount);

	const groups: GroupData[] = groupNoCount.map((group) => {
		const count = memberCount.find((item) => item.group_id == group.id);
		group.memberCount = count?.member_count | 0;
		return group;
	});

	return { session, groups };
};
