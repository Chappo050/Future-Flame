// src/routes/api/protected-route/+server.ts
import { handleError } from '$lib/helpers/APIHelpers.js';
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

	handleError(checkGroupError, 'Error checking group name');

	//Return null for error
	if (checkGroup.length) return json({ error: 'Group Name Already Exists.' });

	const { error: insertGroupError, data: newGroup } = await supabase
		.from('groups')
		.insert(incomingData)
		.select()
		.single();

	handleError(insertGroupError, 'Error creating group');

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

	handleError(insertMemberError, 'Error creating member row');

	console.log('New Member', newMember);

	return json(newGroup);
}

// export const POST: RequestHandler = async ({ request, url,  }) => {
// 	console.log('REQUEST', request);

// };
