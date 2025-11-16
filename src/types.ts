import { z } from 'zod';
import { TorboxCreateSchema, TorBoxDownloadSchema, TorboxMylistSchema } from './validators';

export type EnvBindings = {
	TELEGRAM_BOT_TOKEN: string;
	TORBOX_API_KEY: string;
	TORBOX_API_BASE_URL: string;
	TELEGRAM_ALLOWED_USER_ID: string;
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

export type TelegramUpdate = {
	update_id: number;
	message?: TelegramMessage;
};

export type AppContext = {
	Bindings: EnvBindings;
	Variables: {
		message?: string;
		update?: TelegramUpdate;
	};
};

export type TelegramQueryBody = {
	chat_id: number;
	text: string;
	parse_mode?: string;
};

export type TorboxCreateResponse = z.infer<typeof TorboxCreateSchema>;

export type TorboxTorrentlistResponse = z.infer<typeof TorboxMylistSchema>;

export type TorboxDownloadResponse = z.infer<typeof TorBoxDownloadSchema>;
