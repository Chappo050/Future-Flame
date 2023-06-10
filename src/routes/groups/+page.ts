// src/routes/profile/+page.ts
import type { PageLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent }) => {
	const { supabase, session } = await parent(); //Get session
	console.log('loading data');

	const { data, error } = await supabase.from('groups').select('*');

	const groups = data as GroupData[];

	if (error) {
		return fail(500, {
			supabaseErrorMessage: error.message
		});
	}
	console.log('GOT', groups);

	return { session, groups };
};
