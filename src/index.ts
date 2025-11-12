import { Hono } from 'hono';
import { isMagnet, handleBotStart, sendMessage, handleBotHelp } from './controllers/telegramControllers';
import { createTorrent, fetchTorrentlist, getDownloadLink } from './controllers/torboxControllers';
import type { EnvBindings, TelegramUpdate } from './types';

const app = new Hono<{ Bindings: EnvBindings }>();

app.get('/health', (context) => context.text('ok'));

app.post('/webhook', async (context) => {
	const env = context.env;

	try {
		const update = (await context.req.json()) as TelegramUpdate;
		const msg = update.message;

		if (!msg) return context.json({ ok: true });

		const text = msg.text?.trim();
		const chatId = msg.chat.id;

		if (!text) {
			await sendMessage(env, chatId, 'I only process commands and magnet links.');
			return context.json({ ok: true });
		}

		if (text === '/start') {
			await handleBotStart(env, msg);
			return context.json({ ok: true });
		}

		if (text === '/help') {
			await handleBotHelp(env, msg);
			return context.json({ ok: true });
		}

		if (text === '/stats') {
			try {
				const response = await fetchTorrentlist(env);

				if (!response.success) {
					await sendMessage(env, chatId, `Failed to fetch stats: ${response.detail || 'unknown'}`);
					return context.json({ ok: true });
				}

				const data = response.data || [];
				const totalCount = data.length;

				const latestFive = data.slice(0, 5).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

				const formatBytes = (bytes?: number): string => {
					if (!bytes || bytes <= 0) return 'unknown';
					const units = ['B', 'KB', 'MB', 'GB', 'TB'];
					const i = Math.floor(Math.log(bytes) / Math.log(1024));
					return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
				};

				const timeAgo = (iso?: string): string => {
					if (!iso) return 'unknown';
					const diff = Date.now() - new Date(iso).getTime();
					const seconds = Math.floor(diff / 1000);
					if (seconds < 60) return `${seconds}s ago`;
					const minutes = Math.floor(seconds / 60);
					if (minutes < 60) return `${minutes}m ago`;
					const hours = Math.floor(minutes / 60);
					if (hours < 24) return `${hours}h ${minutes % 60}m ago`;
					const days = Math.floor(hours / 24);
					return `${days}d ${hours % 24}h ago`;
				};

				if (latestFive.length === 0) {
					await sendMessage(env, chatId, `Total Torrents: ${totalCount}\n\nNo torrents to show.`);
				} else {
					const lines = latestFive.map((torrent, index) => {
						const id = torrent.id;
						const name = torrent.name || 'unnamed';
						const size = formatBytes(torrent.size);
						const added = timeAgo(torrent.created_at);
						const finished = torrent.download_finished ? 'Yes' : 'No';
						const cached = torrent.cached ? 'Yes' : 'No';
						return `${index + 1}. ${name}\nID: ${id}\nSize: ${size}\nAdded: ${added}\nFinished: ${finished}\nCached: ${cached}`;
					});
					const message = `Total Torrents: ${totalCount}\n\nLast ${lines.length} Torrents:\n${lines.join('\n\n')}`;
					await sendMessage(env, chatId, message);
				}
			} catch (err: any) {
				await sendMessage(env, chatId, `Error fetching stats: ${err.message}`);
			}
			return context.json({ ok: true });
		}

		if (text.startsWith('/add ')) {
			const magnet = text.replace('/add', '').trim();

			if (!isMagnet(magnet)) {
				await sendMessage(env, chatId, 'Please provide a valid magnet link, e.g. /add magnet:?xt=urn:btih:...');
				return context.json({ ok: true });
			}

			await sendMessage(env, chatId, 'Adding torrent to TorBox... 🔁');

			try {
				const response = await createTorrent(env, magnet);
				if (response.success) {
					await sendMessage(
						env,
						chatId,
						`${response.message}\nTorrent Id: ${response.data?.torrent_id}\nDownload: ${response.download_url}`,
					);
				} else {
					await sendMessage(env, chatId, `TorBox rejected it: ${response.detail || 'unknown'}`);
				}
			} catch (err: any) {
				await sendMessage(env, chatId, `Error adding torrent: ${err.message}`);
			}

			return context.json({ ok: true });
		}

		// fallback
		await sendMessage(env, chatId, 'Unrecognized command!');
		return context.json({ ok: true });
	} catch (err: any) {
		console.error(err);
		return context.json({ ok: false, error: err.message }, 500);
	}
});

export default app;
