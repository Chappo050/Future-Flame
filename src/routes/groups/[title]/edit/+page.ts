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

	const { data: postData, error: postDataError } = await supabase.from('group_posts').select(`*`);

	handleError(postDataError, 'Error fetching post data');
	const postIds = postData?.map((post) => post.id);

	const { data: postLikes, error: postLikesError } = await supabase
		.from('post_like_count')
		.select('*')
		.in('post_id', postIds);

	console.log('IDS', postLikes);

	const postWithLikes = postData?.map((post) => {
		const likeData = postLikes?.find((like) => like.post_id === post.id);
		post.likes = likeData ? likeData.likes : 0;

		return post;
	});

	console.log('with likes', postWithLikes);

	handleError(postLikesError, 'Error fetching post likes');
	const { data: memberData, error: memberError } = await supabase
		.from('members')
		.select(`*`)
		.eq('group_id', groupData.id);

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
		return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
	});
	groupData.members = memberList;
	groupData.posts = postWithLikes;
	console.log('return data from Group Members List', memberList);

	return { session, groupData };
};
