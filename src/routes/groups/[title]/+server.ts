// src/routes/api/protected-route/+server.ts
import { json, error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, locals: { supabase, getSession } }) {
	const { groupId, action } = await request.json();

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });

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

	if (selectMemberError) {
		console.log('Error selecting member row', selectMemberError);
		// the user is not signed in
		throw error(500, { message: 'Error selecting member row' });
	}
	console.log('New Member', selectedMember);

	const { error: deleteError, data: deleteData } = await supabase
		.from('members')
		.delete()
		.eq('id', selectedMember.id)
		.eq('group_id', groupId);

	if (deleteError) {
		console.log('Error deleting member row', deleteError);
		// the user is not signed in
		throw error(500, { message: 'Error deleting member row' });
	}
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

	if (insertMemberError) {
		console.log('Error creating member row', insertMemberError);
		// the user is not signed in
		throw error(500, { message: 'Error creating member row' });
	}
	console.log('New Member', newMember);
}
