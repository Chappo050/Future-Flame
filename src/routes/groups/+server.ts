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
		user_ids: [session.user.id]
	};

	const { error: insertMemberError, data: newMember } = await supabase
		.from('members')
		.insert(membersPayload)
		.select()
		.single();

	if (insertMemberError) {
		console.log('Error creating member row', insertMemberError);
		// the user is not signed in
		throw error(500, { message: 'Error creating member row' });
	}
	console.log('New Member', newMember);

	//////Update Group//////////
	const updateGroupMemberIdPayload = { members: newMember.id };

	const { error: updateGroupMemberError, data: updatedGroup } = await supabase
		.from('groups')
		.update(updateGroupMemberIdPayload)
		.eq('id', newGroup.id)
		.select()
		.single();

	if (updateGroupMemberError) {
		console.log('Error creating member row', insertMemberError);
		// the user is not signed in
		throw error(500, { message: 'Error creating member row' });
	}
	console.log('Updated Group', updatedGroup);
	// return new Response(String(newGroup.id));
	return json(updatedGroup);
}

// export const POST: RequestHandler = async ({ request, url,  }) => {
// 	console.log('REQUEST', request);

// };
