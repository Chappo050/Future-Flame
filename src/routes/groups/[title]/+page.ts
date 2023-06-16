// src/routes/profile/+page.ts
import { handleError } from '$lib/helpers/APIHelpers';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
	const { supabase, session } = await parent(); //Get session
	const groupSlug = params.title;

	const { data: groupDataReturned, error: groupError } = await supabase
		.from('groups')
		.select(`*`)
		.eq('slug', groupSlug)
		.single();
	const groupData = groupDataReturned as GroupData;
	handleError(groupError, 'Error fetching group data from slug');

	console.log('groupData', groupData);

	const { data: postData, error: postDataError } = await supabase.from('group_posts').select(`*`);

	handleError(postDataError, 'Error fetching post data');

	console.log('Post Data', postData);

	const { data: memberData, error: memberError } = await supabase
		.from('members')
		.select(`*`)
		.eq('group_id', groupData.id);

	console.log('Member Data', memberData);
	handleError(memberError, 'Error fetching members of group');

	///FETCH MEMBERS TO PROFILES
	const userIds = memberData.reduce((acc, item) => {
		acc.push(item.user_id);
		return acc;
	}, []);

	const { data: groupMemberProfileData, error: groupMemberProfileError } = await supabase
		.from('profiles')
		.select('username, avatar_url, id')
		.in('id', userIds);

	console.log('groupMemberProfileData', groupMemberProfileData);

	handleError(groupMemberProfileError, 'Error fetching members profiles');

	//Join data together
	const memberList = memberData.map((member) => {
		const profile = groupMemberProfileData.find((profile) => profile.id === member.user_id);
		if (profile) {
			return {
				id: member.user_id,
				username: profile.username,
				avatar_url: profile.avatar_url,
				role: member.role
			};
		}
		return member;
	});
	postData?.sort((a, b) => {
		return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
	});
	groupData.members = memberList;
	groupData.posts = postData;
	console.log('return data from Group Members List', memberList);

	return { session, groupData };
};
