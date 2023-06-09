import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * This function fetches an image from a specified Supabase storage bucket.
 * @param path - The path of the image within the storage bucket.
 * @param table - The name of the Supabase storage bucket.
 * @param sb - An instance of the Supabase client.
 * @returns A promise that resolves to a string representing the URL of the downloaded image.
 * @throws Will throw an error if the image download fails.
 */
export const fetchImage = async (path: string, table: string, sb: SupabaseClient) => {
	try {
		const { data, error } = await sb.storage.from(table).download(path);
		if (error) {
			throw error;
		}

		const url = URL.createObjectURL(data);
		return url;
	} catch (error) {
		if (error instanceof Error) {
			console.log('Error downloading image: ', error.message);
		}
	}
};
/**
 * This function uploads an image to a specified Supabase storage bucket.
 * @param files - The file to be uploaded
 * @param table - The name of the Supabase storage bucket.
 * @param sb - An instance of the Supabase client.
 * @returns A promise that resolves to a string representing the URL of the uploaded image.
 * @throws Will throw an error if the image upload fails.
 */
export const uploadImage = async (files: FileList, table: string, sb: SupabaseClient) => {
	try {
		if (!files || files.length === 0) {
			throw new Error('You must select an image to upload.');
		}

		const file = files[0];
		const fileExt = file.name.split('.').pop();
		const url = `${Math.random()}.${fileExt}`;

		const { data, error } = await sb.storage.from(table).upload(url, file);

		const returnURL = data?.path as string;
		if (error) {
			throw error;
		}
		return returnURL;
	} catch (error) {
		if (error instanceof Error) {
			alert(error.message);
		}
	}
};
/**
 * This function fetches a users profile.
 * @param user_id - The user to load from Supabase
 * @param sb - An instance of the Supabase client.
 * @returns A promise that resolves to an object with an avtar URL and userData object.
 * @throws Will throw an error if the image download fails or userData fails to load.
 */
export const fetchUserProfile = async (user_id: string, sb: SupabaseClient) => {
	try {
		const { data, error: userError } = await sb
			.from('profiles')
			.select('*')
			.eq('id', user_id)
			.single();

		if (userError) {
			throw userError;
		}

		const userData = data as ProfileData;

		const avatarUrl = await fetchImage(userData.avatar_url, 'avatars', sb);

		return { avatarUrl, userData };
	} catch (error) {
		if (error instanceof Error) {
			console.log('Error downloading image: ', error.message);
		}
	}
};
