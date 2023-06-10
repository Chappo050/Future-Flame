// src/routes/api/protected-route/+server.ts
import { json, error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals: { supabase, getSession } }) {
	const incomingData = await request.json();

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });
	//////Create Group//////////
	const { error: insertGroupError, data: newGroup } = await supabase
		.from('groups')
		.insert(incomingData)
		.select()
		.single();

	if (insertGroupError) {
		console.log('Error creating group', insertGroupError);
		// the user is not signed in
		throw error(500, { message: 'Error creating group' });
	}
	console.log('new Group', newGroup);

	//////Create Members//////////

	const membersPayload = {
		group_id: newGroup.id,
		user_id: session.user.id,
		role: 'member'
	};

	const { error: insertMemberError, data: newMember } = await supabase
		.from('members')
		.insert(membersPayload);

	if (insertMemberError) {
		console.log('Error creating member row', insertMemberError);
		// the user is not signed in
		throw error(500, { message: 'Error creating member row' });
	}
	console.log('New Member', newMember);

	return json(newGroup);
}

// export const POST: RequestHandler = async ({ request, url,  }) => {
// 	console.log('REQUEST', request);

// };
