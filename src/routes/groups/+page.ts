// src/routes/profile/+page.ts
import type { PageLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent }) => {
	const { supabase, session } = await parent(); //Get session

	if (!session) {
		throw redirect(303, '/');
	}

	const { data, error } = await supabase.from('groups').select('*');

	const groups = data as GroupData[];

	if (error) {
		return fail(500, {
			supabaseErrorMessage: error.message
		});
	}

	return { session, groups };
};
