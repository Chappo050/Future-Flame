import type { RequestHandler } from './$types';
import { handleError } from '$lib/helpers/APIHelpers.js';
import { json, error } from '@sveltejs/kit';
import supabaseServer from '$lib/helpers/backend/supabase.js';
import { Permissions } from '$lib/helpers/backend/permissions';

export const PUT: RequestHandler = async ({ request, locals: { getSession } }) => {
	const incomingData = await request.json();
	console.log(incomingData, 'FORM');

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });

	const isAdmin = await Permissions.isGroupAdmin(session, supabaseServer, incomingData.groupId);
	if (!isAdmin) throw error(401, { message: 'Unauthorized' });

	const { error: updateLocationError, data: updatedLocation } = await supabaseServer
		.from('locations')
		.upsert([{ group_id: incomingData.groupId, data: incomingData.locations }], {
			onConflict: 'group_id'
		});

	handleError(updateLocationError, 'Error updating Group location');

	return json({ success: true });
};

export const GET: RequestHandler = async ({ url, locals: { getSession } }) => {
	const groupId = url.searchParams.get('groupId');
	const session = await getSession();
	if (!groupId) throw error(404, { message: 'Group Not Found' });
	if (!session) throw error(401, { message: 'Unauthorized' });

	const isMember = await Permissions.isGroupMember(session, supabaseServer, groupId);
	if (!isMember) throw error(401, { message: 'Unauthorized' });

	const { error: selectLocationError, data: selectLocations } = await supabaseServer
		.from('locations')
		.select('*')
		.eq('group_id', groupId)
		.single();

	handleError(selectLocationError, 'Error updating Group group');

	console.log('new Group', selectLocations);
	return json({ success: true, data: selectLocations?.data });
};
