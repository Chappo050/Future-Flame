import type { RequestHandler } from './$types';
import { handleError } from '$lib/helpers/APIHelpers.js';
import { json, error } from '@sveltejs/kit';
import supabaseServer from '$lib/helpers/backend/supabase.js';
import { Permissions } from '$lib/helpers/backend/permissions';

export const POST: RequestHandler = async ({ request, locals: { getSession } }) => {
	const incomingData = await request.json();
	console.log('incoming Data', incomingData);
	const session = await getSession();
	const form: PostData = incomingData;

	if (!session) throw error(401, { message: 'Unauthorized' });
	const isMember = await Permissions.isGroupMember(session, supabaseServer, form.group_id);
	if (!isMember) throw error(401, { message: 'Unauthorized' });
	//////Insert Post Group//////////

	const { error: insertPostError, data: postData } = await supabaseServer
		.from('group_posts')
		.insert(form)
		.select('*')
		.single();

	console.log(postData);

	handleError(insertPostError, 'Error inserting post row');
	return json({ success: true, postData });
};
