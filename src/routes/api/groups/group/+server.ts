// src/routes/api/protected-route/+server.ts
import { handleError } from '$lib/helpers/APIHelpers.js';
import { json, error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals: { supabase, getSession } }) {
	const { postId, groupId, action } = await request.json();

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });

	const { data: likeData, error: likeError } = await supabase
		.from('post_likes')
		.insert([{ user_id: session.user.id, post_id: postId, group_id: groupId }]);

	handleError(likeError, 'Error adding like');

	return json({ success: true });
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals: { supabase, getSession } }) {
	const postId = url.searchParams.get('postId');
	console.log(postId);

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });

	const { data: likeData, error: likeError } = await supabase
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
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request, locals: { supabase, getSession } }) {
	const { postId, groupId } = await request.json();

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });

	const { data: likeData, error: likeError } = await supabase
		.from('post_likes')
		.delete()
		.eq('user_id', session.user.id)
		.eq('post_id', postId);

	handleError(likeError, 'Error deleting like');

	return json({ success: true });
}
