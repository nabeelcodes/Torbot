import type { TorboxCreateResponse, TorboxTorrentlistResponse, EnvBindings } from '../types';
import { TorboxCreateSchema, TorboxMylistSchema } from '../validators';

const createTorrent = async (env: EnvBindings, magnet: string): Promise<TorboxCreateResponse> => {
	try {
		const form = new FormData();
		form.append('magnet', magnet);
		const responseFromTorbox = await fetch(`${env.TORBOX_API_BASE_URL}/api/torrents/createtorrent`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${env.TORBOX_API_KEY}` },
			body: form as unknown as BodyInit,
		});
		const jsonData = await responseFromTorbox.json();
		const parsedData = TorboxCreateSchema.parse(jsonData);
		if (!parsedData.success && parsedData.error) throw new Error(parsedData.error);
		return parsedData;
	} catch (error) {
		console.error(error);
		return {
			success: false,
			error: 'Failed! Torrent not added.',
		};
	}
};

const fetchTorrentlist = async (env: EnvBindings): Promise<TorboxTorrentlistResponse> => {
	const responseFromTorbox = await fetch(`${env.TORBOX_API_BASE_URL}/api/torrents/mylist`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${env.TORBOX_API_KEY}` },
	});
	const json = await responseFromTorbox.json();
	const parsed = TorboxMylistSchema.parse(json);
	return parsed;
};

export { createTorrent, fetchTorrentlist };
