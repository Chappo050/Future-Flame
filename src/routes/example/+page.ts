// src/routes/profile/+page.ts
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent }) => {
	const { supabase, session } = await parent(); //Get session

	//redirect if no user
	if (!session) {
		throw redirect(303, '/');
	}
};
