export type EnvBindings = {
	TELEGRAM_BOT_TOKEN: string;
	TORBOX_API_KEY: string;
	TORBOX_API_BASE_URL: string;
};

export type TelegramUpdate = {
	update_id: number;
	message?: TelegramMessage;
};

export type TelegramMessage = {
	message_id: number;
	from?: {
		id: number;
		is_bot?: boolean;
		first_name?: string;
		username?: string;
	};
	chat: {
		id: number;
		type?: string;
		title?: string;
	};
	date: number;
	text?: string;
};

export type TelegramQueryBody = {
	chat_id: number;
	text: string;
	parse_mode: string;
};

export type TorboxCreateResponse = {
	success: boolean;
	error: string | null;
	detail?: string;
	data?: {
		hash: string;
		torrent_id: number;
		auth_id: string;
	};
	message?: string;
	download_url?: string;
};

export type TorrentFile = {
	id: number;
	md5: string | null;
	hash: string;
	name: string;
	size: number;
	zipped: boolean;
	s3_path: string;
	infected: boolean;
	mimetype: string;
	short_name: string;
	absolute_path: string;
	opensubtitles_hash: string | null;
};

export type TorrentData = {
	id: number;
	auth_id: string;
	server: number;
	hash: string;
	name: string;
	magnet: string | null;
	size: number;
	active: boolean;
	created_at: string;
	updated_at: string;
	download_state: 'cached' | string;
	seeds: number;
	peers: number;
	ratio: number;
	progress: number;
	download_speed: number;
	upload_speed: number;
	eta: number;
	torrent_file: boolean;
	expires_at: string | null;
	download_present: boolean;
	files: TorrentFile[];
	download_path: string;
	availability: number;
	download_finished: boolean;
	tracker: string | null;
	total_uploaded: number;
	total_downloaded: number;
	cached: boolean;
	owner: string;
	seed_torrent: boolean;
	allow_zipped: boolean;
	long_term_seeding: boolean;
	tracker_message: string | null;
	cached_at: string | null;
	private: boolean;
};

export type TorboxTorrentlistResponse = {
	success: boolean;
	error: string | null;
	detail: string;
	data: TorrentData[];
};
