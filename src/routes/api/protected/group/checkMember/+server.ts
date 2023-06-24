// src/routes/api/protected-route/+server.ts
import { handleError } from '$lib/helpers/APIHelpers.js';
import { json, error } from '@sveltejs/kit';
import supabaseServer from '$lib/helpers/backend/supabase.js';
import type { RequestHandler } from './$types';
import { Permissions } from '$lib/helpers/backend/permissions';

export const GET: RequestHandler = async ({ url, locals: { getSession } }) => {
	const groupId = await url.searchParams.get('groupId');

	if (!groupId) return json({ success: false });
	const session = await getSession();

	if (!session) throw error(401, { message: 'Unauthorized' });

	const isMember = await Permissions.isGroupMember(session, supabaseServer, groupId);

	return json({ success: isMember });
};
