// src/routes/profile/+page.ts
import type { PageLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent }) => {
	const { supabase, session } = await parent(); //Get session

	//redirect if no user
	if (!session) {
		throw redirect(303, '/');
	}
	const { error: createPostError, data: posts } = await supabase.from('posts').select('*');

	if (createPostError) {
		return fail(500, {
			supabaseErrorMessage: createPostError.message
		});
	}

	//Clean tags??
	// Parse the JSON string in tags property to an array
	const parsedPosts = posts.map((post) => {
		return {
			...post,
			tags: JSON.parse(post.tags)
		};
	});

	return {
		posts: parsedPosts
	};
};
