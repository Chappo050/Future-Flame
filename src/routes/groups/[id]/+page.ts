// src/routes/profile/+page.ts
import type { PageLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent, params }) => {
	const { supabase, session } = await parent(); //Get session
	const groupId = params.id;

	if (!session) {
		throw redirect(303, '/');
	}

	const { data, error } = await supabase.from('groups').select('*').eq('id', groupId).single();

	const group = data as GroupData;

	if (error) {
		return fail(500, {
			supabaseErrorMessage: error.message
		});
	}

	return { session, group };
};
