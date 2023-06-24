import { handleError } from '$lib/helpers/APIHelpers.js';
import { json, error } from '@sveltejs/kit';
import supabaseServer from '$lib/helpers/backend/supabase.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { getSession } }) => {
	const incomingData = await request.json();

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });
	//////Create Group//////////

	//Clean title
	const cleanedTitle: string = incomingData.title.trim().replace(/\s+/g, '-');
	incomingData.slug = cleanedTitle;

	//Check if group name already exists

	const { error: checkGroupError, data: checkGroup } = await supabaseServer
		.from('groups')
		.select()
		.eq('slug', cleanedTitle);

	handleError(checkGroupError, 'Error checking group name');

	//Return null for error
	if (checkGroup?.length) return json({ error: 'Group Name Already Exists.' });
	//Add user
	incomingData.user_id = session.user.id;
	console.log(incomingData);

	const { error: insertGroupError, data: newGroup } = await supabaseServer
		.from('groups')
		.insert(incomingData)
		.select()
		.single();

	handleError(insertGroupError, 'Error creating group');

	console.log('new Group', newGroup);

	//////Create Members//////////

	const membersPayload = {
		group_id: newGroup?.id,
		user_id: session.user.id,
		role: 'admin'
	};

	const { error: insertMemberError, data: newMember } = await supabaseServer
		.from('members')
		.insert(membersPayload);

	handleError(insertMemberError, 'Error creating member row');

	console.log('New Member', newMember);

	return json(newGroup);
};
