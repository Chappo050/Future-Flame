import { handleError } from '$lib/helpers/APIHelpers.js';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals: { getSession, supabase } }) {
	const incomingData = await request.json();
	const session = await getSession();
	//////Create Group//////////
	const { error: insertGroupError, data: newGroup } = await supabase
		.from('groups')
		.insert(incomingData)
		.select()
		.single();

	handleError(insertGroupError, 'Error inserting group');

	//////Create Members//////////

	const membersPayload = {
		group_id: newGroup.id,
		user_id: session.user.id,
		role: 'admin'
	};

	const { error: insertMemberError, data: newMember } = await supabase
		.from('members')
		.insert(membersPayload);

	handleError(insertMemberError, 'Error inserting member');

	console.log('New Member', newMember);

	return json(newGroup);
}
