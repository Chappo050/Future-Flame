import type { RequestHandler } from './$types';
import { handleError } from '$lib/helpers/APIHelpers.js';
import { json, error } from '@sveltejs/kit';
import supabaseServer from '$lib/helpers/backend/supabase.js';
import { Permissions } from '$lib/helpers/backend/permissions';

export const POST: RequestHandler = async ({ request, locals: { getSession } }) => {
	const { postId, groupId } = await request.json();

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });
	await Permissions.isGroupMember(session, supabaseServer, groupId);

	const { data: likeData, error: likeError } = await supabaseServer
		.from('post_likes')
		.insert([{ user_id: session.user.id, post_id: postId, group_id: groupId }]);

	handleError(likeError, 'Error adding like');

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ request, locals: { getSession } }) => {
	const { postId, groupId } = await request.json();

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });

	await Permissions.isGroupMember(session, supabaseServer, groupId);

	const { data: likeData, error: likeError } = await supabaseServer
		.from('post_likes')
		.delete()
		.eq('user_id', session.user.id)
		.eq('post_id', postId);

	handleError(likeError, 'Error deleting like');

	return json({ success: true });
};

export const GET: RequestHandler = async ({ url, locals: { getSession } }) => {
	const postId = url.searchParams.get('postId');
	console.log(postId);

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });

	const { data: likeData, error: likeError } = await supabaseServer
		.from('post_likes')
		.select('*')
		.eq('user_id', session.user.id)
		.eq('post_id', postId);

	handleError(likeError, 'Error selecting like');

	if (likeData?.length) {
		return json({ success: true });
	} else {
		return json({ success: false });
	}
};
