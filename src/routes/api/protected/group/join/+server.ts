// src/routes/api/protected-route/+server.ts
import { handleError } from '$lib/helpers/APIHelpers.js';
import { json, error } from '@sveltejs/kit';
import supabaseServer from '$lib/helpers/backend/supabase.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { getSession } }) => {
	const { groupSlug } = await request.json();

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });

	//Slug to uuid
	const { error: selectGroupError, data: groupFromSlug } = await supabaseServer
		.from('groups')
		.select('id')
		.eq('slug', groupSlug)
		.single();

	//Can add more logic here
	const groupId = groupFromSlug?.id;

	handleError(selectGroupError, 'Error selecting group row');
	const success = await joinGroup(groupId, session, supabaseServer);

	return json({ success: success });
};

///////////////////Create member record///////////////
async function joinGroup(groupId: string, session: any, supabaseServer: any) {
	const membersPayload = {
		group_id: groupId,
		user_id: session.user.id,
		role: 'member'
	};

	const { error: insertMemberError, data: newMember } = await supabaseServer
		.from('members')
		.insert(membersPayload);

	handleError(insertMemberError, 'Error creating member row');

	console.log('New Member', newMember);
	return true;
}
