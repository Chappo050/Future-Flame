// src/routes/profile/+page.ts
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent }) => {
	const { supabase, session } = await parent(); //Get session

	//redirect if no user
	if (!session) {
		throw redirect(303, '/');
	}

	//Grab data
	const { data: tableData } = await supabase.from('test').select('*');

	console.log(tableData);

	//Refercened as data in +page.ts
	return {
		tableData
	};
};
