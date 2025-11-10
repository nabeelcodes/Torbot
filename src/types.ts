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
};

export type TorboxTorrentlistResponse = {
	success: boolean;
	detail?: string;
	data?: { torrents?: Array<Record<string, any>> } | any;
};
