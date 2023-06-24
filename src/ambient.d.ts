interface GroupData {
	id: string;
	title: string;
	mission: string;
	bannerImage: string;
	user_id: string;
	posts?: PostData[];
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

interface MarkerData {
	address: string;
	location: object;
	pinNumber: number;
}

interface PostData {
	id?: number;
	created_at?: Date;
	updated_at?: Date;
	group_id: string;
	user_id: string;
	message: string;
	likes: number;
	title: string;
}
