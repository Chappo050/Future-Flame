import type { RequestHandler } from './$types';
import { handleError } from '$lib/helpers/APIHelpers.js';
import { json, error } from '@sveltejs/kit';
import supabaseServer from '$lib/helpers/backend/supabase.js';
import { Permissions } from '$lib/helpers/backend/permissions';

export const PUT: RequestHandler = async ({ request, locals: { getSession } }) => {
	const incomingData = await request.json();
	console.log(incomingData, 'FORM');
	const form = incomingData;

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });

	const isAdmin = await Permissions.isGroupAdmin(session, supabaseServer, form.id);
	if (!isAdmin) throw error(401, { message: 'Unauthorized' });

	const { error: updateGroupError, data: updatedGroup } = await supabaseServer
		.from('groups')
		.update({ mission: form.mission })
		.eq('id', form.id);

	handleError(updateGroupError, 'Error updating Group group');

	console.log('new Group', updatedGroup);

	return json({ success: true });
};
