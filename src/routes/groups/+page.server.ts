// src/routes/profile/+page.ts
import type { PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load = (async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

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
}) satisfies PageServerLoad;
