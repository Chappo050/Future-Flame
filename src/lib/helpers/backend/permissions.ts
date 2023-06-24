import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { handleError } from '../APIHelpers';
import { json } from '@sveltejs/kit';

export const Permissions = {
	isGroupMember: async (session: Session, supabaseServer: SupabaseClient, group_id: string) => {
		const user_id = session.user.id;

		const { data: userData, error: userError } = await supabaseServer
			.from('members')
			.select('*')
			.eq('user_id', user_id)
			.eq('group_id', group_id);

		handleError(userError, 'Error checking group members');
		if (userData?.length) {
			console.log('Is group member', userData);

			return true;
		} else {
			return false;
		}
	},

	isGroupAdmin: async (session: Session, supabaseServer: SupabaseClient, group_id: string) => {
		const user_id = session.user.id;

		const { data: userData, error: userError } = await supabaseServer
			.from('members')
			.select('*')
			.eq('user_id', user_id)
			.eq('role', 'admin')
			.eq('group_id', group_id);

		handleError(userError, 'Error checking group admins');
		if (userData?.length) {
			console.log('Is group Admin', userData);

			return true;
		} else {
			return false;
		}
	}
};
