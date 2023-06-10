import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { formDataToObject } from '$lib/helpers/APIHelpers';

export const load = (async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/');
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select(`username, website, avatar_url`)
		.eq('id', session.user.id)
		.single();

	return { session, profile };
}) satisfies PageServerLoad;

export const actions = {
	update: async ({ request, locals: { supabase, getSession } }) => {
		//Data parser
		const formData = await request.formData();
		console.log(formData);

		const data = formDataToObject(formData);

		const session = await getSession();
		console.log('data', data);

		const { error } = await supabase.from('profiles').upsert({
			id: session?.user.id,
			...data,
			updated_at: new Date()
		});

		if (error) {
			console.log('Error', error);

			return fail(500, {
				data
			});
		}

		return {
			data
		};
	},
	signout: async ({ locals: { supabase, getSession } }) => {
		const session = await getSession();
		if (session) {
			console.log('Signing Out', session);

			await supabase.auth.signOut();
			throw redirect(303, '/');
		}
	}
} satisfies Actions;
