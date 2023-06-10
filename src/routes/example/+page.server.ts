// src/routes/posts/+page.server.ts
import DataParser from '$lib/helpers/APIHelpers';
import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';

export const actions: Actions = {
	createPost: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();
		console.log('Hello');

		//Serverside RLS
		if (!session) {
			// the user is not signed in
			throw error(401, { message: 'Unauthorized' });
		}
		// we are safe, let the user create the post
		//Data parser
		const formData = await request.formData();
		const data = DataParser.formDataToObject(formData);

		const { error: createPostError, data: newPost } = await supabase.from('posts').insert(data);
		console.log(createPostError);

		if (createPostError) {
			return fail(500, {
				supabaseErrorMessage: createPostError.message
			});
		}
		return {
			success: true,
			newPost
		};
	}
};
