// src/routes/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import DataParser from '$lib/helpers/API-helpers';

export const load = (async ({ url, locals: { supabase, getSession } }) => {
	const session = await getSession();

	// if the user is already logged in return them to the account page
	if (session) {
		throw redirect(303, '/account');
	}

	return { url: url.origin };
}) satisfies PageServerLoad;

export const actions = {
	signInGoogle: async ({ locals: { supabase, getSession } }) => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google'
		});

		if (error) {
			console.log('Error', error);

			return fail(500, {
				data
			});
		} else {
			throw redirect(303, '/');
		}
	}
} satisfies Actions;
