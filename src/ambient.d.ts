interface GroupData {
	id: number;
	title: string;
	description: string;
	bannerImage: string;
	user_id: string;
	members: ProfileData[];
}

interface ProfileData {
	id: string;
	updated_at: Date;
	username: string;
	avatar_url: string;
	website: string;
}

interface MembersData {
	id: number;
	group_id: number;
	user_ids: string[];
}
