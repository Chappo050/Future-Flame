interface GroupData {
	id: number;
	title: string;
	mission: string;
	bannerImage: string;
	user_id: string;
	members?: ProfileData[];
	memberCount?: number;
}

interface ProfileData {
	id: string;
	updated_at: Date;
	username: string;
	avatar_url: string;
	website: string;
	role?: string;
}

interface MembersData {
	id: number;
	group_id: number;
	user_id: string;
}
