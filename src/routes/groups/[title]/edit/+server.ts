// src/routes/api/protected-route/+server.ts
import { handleError } from '$lib/helpers/APIHelpers.js';
import { json, error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, locals: { supabase, getSession } }) {
	const incomingData = await request.json();
	console.log(incomingData, 'FORM');
	const form = incomingData;

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });
	const { error: updateGroupError, data: updatedGroup } = await supabase
		.from('groups')
		.update({ mission: form.mission })
		.eq('id', form.id);

	handleError(updateGroupError, 'Error updating Group group');

	console.log('new Group', updatedGroup);

	return json({ success: true });
}

// export const POST: RequestHandler = async ({ request, url,  }) => {
// 	console.log('REQUEST', request);

// };
