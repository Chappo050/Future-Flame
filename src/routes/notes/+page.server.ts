import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import DataParser from '$lib/helpers/API-helpers';

export const actions = {
	delete: async ({ request, locals: { supabase, getSession } }) => {
		//Data parser
		console.log('DELETING');

		const session = await getSession();
		const formData = await request.formData();
		const data = DataParser.formDataToObject(formData);

		if (!session) {
			throw redirect(303, '/signin');
		}

		console.log('data', data);

		const { error: deleteError } = await supabase.from('posts').delete().eq('id', data.id);

		if (deleteError) {
			console.log('Error', deleteError);

			return fail(500, {
				success: false
			});
		}

		return {
			success: true
		};
	}
} satisfies Actions;
