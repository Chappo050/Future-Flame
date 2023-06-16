// src/routes/api/protected-route/+server.ts
import { handleError } from '$lib/helpers/APIHelpers.js';
import { json, error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals: { supabase, getSession } }) {
	const incomingData = await request.json();
	console.log('incoming Data', incomingData);
	const session = await getSession();
	const form: PostData = incomingData;
	if (!session) throw error(401, { message: 'Unauthorized' });

	//////Insert Post Group//////////

	const { error: insertPostError, data: postData } = await supabase
		.from('group_posts')
		.insert(form)
		.select('*')
		.single();

	console.log(postData);

	handleError(insertPostError, 'Error inserting post row');
	return json({ success: true, postData });
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, locals: { supabase, getSession } }) {
	const { groupSlug, action } = await request.json();

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });

	//Slug to uuid
	const { error: selectGroupError, data: groupFromSlug } = await supabase
		.from('groups')
		.select('id')
		.eq('slug', groupSlug)
		.single();

	const groupId = groupFromSlug?.id;

	handleError(selectGroupError, 'Error selecting group row');

	if (action == 'join') {
		await joinGroup(groupId, session, supabase);
	} else if (action == 'leave') {
		await leaveGroup(groupId, session, supabase);
	}

	return json({ success: true });
}

///////////////////Delete member record///////////////
async function leaveGroup(groupId: string, session: any, supabase: any) {
	const membersPayload = {
		group_id: groupId,
		user_id: session.user.id,
		role: 'member'
	};

	const { error: selectMemberError, data: selectedMember } = await supabase
		.from('members')
		.select('id')
		.eq('user_id', session.user.id)
		.eq('group_id', groupId)
		.single();

	handleError(selectMemberError, 'Error selecting member row');

	console.log('New Member', selectedMember);

	const { error: deleteError, data: deleteData } = await supabase
		.from('members')
		.delete()
		.eq('id', selectedMember.id)
		.eq('group_id', groupId);

	handleError(deleteError, 'Error deleting member row');

	console.log('Delete data', deleteData);
}

///////////////////Create member record///////////////
async function joinGroup(groupId: string, session: any, supabase: any) {
	const membersPayload = {
		group_id: groupId,
		user_id: session.user.id,
		role: 'member'
	};

	const { error: insertMemberError, data: newMember } = await supabase
		.from('members')
		.insert(membersPayload);

	handleError(insertMemberError, 'Error creating member row');

	console.log('New Member', newMember);
}
