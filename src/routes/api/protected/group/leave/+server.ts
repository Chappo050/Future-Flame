import type { RequestHandler } from './$types';
import { handleError } from '$lib/helpers/APIHelpers.js';
import { json, error } from '@sveltejs/kit';
import supabaseServer from '$lib/helpers/backend/supabase.js';
import { Permissions } from '$lib/helpers/backend/permissions';

export const PUT: RequestHandler = async ({ request, locals: { getSession } }) => {
	const { groupSlug, action } = await request.json();

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });

	//Slug to uuid
	const { error: selectGroupError, data: groupFromSlug } = await supabaseServer
		.from('groups')
		.select('id')
		.eq('slug', groupSlug)
		.single();

	const groupId = groupFromSlug?.id;

	handleError(selectGroupError, 'Error selecting group row');
	const isAdmin = await Permissions.isGroupAdmin(session, supabaseServer, groupId);
	const isMember = await Permissions.isGroupMember(session, supabaseServer, groupId);

	if (!isMember && !isAdmin) throw error(401, { message: 'Unauthorized' });

	let success;
	if (isAdmin) {
		success = await leaveGroupAdmin(groupId, session, supabaseServer);
	} else if (isMember) {
		success = await leaveGroup(groupId, session, supabaseServer);
	}

	return json({ success: success });
};

///////////////////Delete member record///////////////
async function leaveGroup(groupId: string, session: any, supabase: any) {
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
	return true;
}

///////////////////Delete admin record with check///////////////
async function leaveGroupAdmin(groupId: string, session: any, supabase: any) {
	const { error: selectAdminsError, data: selectedAdmins } = await supabase
		.from('members')
		.select('id')
		.eq('role', 'admin')
		.eq('group_id', groupId);

	//Return false as success false
	if (selectedAdmins.length <= 1) {
		return false;
	}

	handleError(selectAdminsError, 'Error selecting admins row');

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
	return true;
}
