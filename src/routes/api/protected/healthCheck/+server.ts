import type { RequestHandler } from './$types';
import { handleError } from '$lib/helpers/APIHelpers.js';
import { json, error } from '@sveltejs/kit';
import supabaseServer from '$lib/helpers/backend/supabase.js';
import { Permissions } from '$lib/helpers/backend/permissions';

export const POST: RequestHandler = async ({ request, locals: { getSession } }) => {
	const { data } = await request.json();

	console.log('DATA', data);

	return json({ success: data });
};

export const GET: RequestHandler = async ({ url, locals: { getSession } }) => {
	console.log('GET');
	return json({ success: true });
};
