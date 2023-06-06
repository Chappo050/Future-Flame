// src/routes/api/protected-route/+server.ts
import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ url, locals: { supabase, getSession } }) => {
	const postID: string | null = url.searchParams.get('postID');
	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });
	if (!postID) throw error(500, { message: 'Cannot find post ID' });

	const { error: deleteError } = await supabase.from('posts').delete().eq('id', postID);

	if (deleteError) {
		console.log('Error', deleteError);
		// the user is not signed in
		throw error(500, { message: 'Error deleting' });
	}

	return json({ success: true });
};
