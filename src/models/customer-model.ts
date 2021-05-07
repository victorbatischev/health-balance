export interface Customer {
	token: string;
	name: string;
	team_id: number;
	role?: number;
	is_captain: boolean;
	phone: string;
	email: string;
	city?: string;
	password: string;
	avatar?: string;
	team: string;
	establishment: string;
	platform_id?: number;
}