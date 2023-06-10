// src/routes/profile/+page.ts
import type { PageLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent, params }) => {
	const { supabase, session } = await parent(); //Get session
	const groupId = params.id;

	if (!session) {
		throw redirect(303, '/');
	}
	const { data: groupData, error: groupError } = await supabase
		.from('groups')
		.select(`*`)
		.eq('id', groupId)
		.single();

	if (groupError) {
		console.log('groupMemberProfileError', groupError);

		return fail(500, {
			supabaseErrorMessage: groupError.message
		});
	}

	console.log('groupData', groupData);

	const { data: memberData, error: memberError } = await supabase
		.from('members')
		.select(`*`)
		.eq('group_id', groupId);

	console.log('Member Data', memberData);

	if (memberError) {
		console.log('groupMemberProfileError', memberError);

		return fail(500, {
			supabaseErrorMessage: memberError.message
		});
	}
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

	if (groupMemberProfileError) {
		console.log('groupMemberProfileError', groupMemberProfileError);

		return fail(500, {
			supabaseErrorMessage: groupMemberProfileError.message
		});
	}
	//Join data together
	const memberList = memberData.map((member) => {
		const profile = groupMemberProfileData.find((profile) => profile.id === member.user_id);
		if (profile) {
			return {
				user_id: member.user_id,
				username: profile.username,
				avatar_url: profile.avatar_url,
				role: member.role
			};
		}
		return member;
	});

	groupData.members = memberList;
	console.log('return data from Group Members List', memberList);

	return { session, groupData };
};
