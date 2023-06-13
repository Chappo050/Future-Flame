// src/routes/api/protected-route/+server.ts
import { json, error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals: { supabase, getSession } }) {
	const incomingData = await request.json();

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });
	//////Create Group//////////

	//Clean title
	const cleanedTitle: string = incomingData.title.trim().replace(/\s+/g, '-');
	incomingData.slug = cleanedTitle;

	//Check if group name already exists

	const { error: checkGroupError, data: checkGroup } = await supabase
		.from('groups')
		.select()
		.eq('slug', cleanedTitle);

	console.log(checkGroup);

	if (checkGroupError) {
		console.log('Error checking group name', checkGroupError);
		// the user is not signed in
		throw error(500, { message: 'Error checking group name' });
	}

	//Return null for error
	if (checkGroup.length) return json({ error: 'Group Name Already Exists.' });

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
		role: 'admin'
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
