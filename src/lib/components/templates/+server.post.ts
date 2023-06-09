// src/routes/api/protected-route/+server.ts
import { json, error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals: { supabase, getSession } }) {
	const incomingData = await request.json();

	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });

	const { error: deleteError, data } = await supabase.from('groups').insert(incomingData);
	console.log(data);

	if (deleteError) {
		console.log('Error', deleteError);
		// the user is not signed in
		throw error(500, { message: 'Error deleting' });
	}

	return json({ success: true });
	return json(data);
}

// export const POST: RequestHandler = async ({ request, url,  }) => {
// 	console.log('REQUEST', request);

// };
