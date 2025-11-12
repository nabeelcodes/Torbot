import type { TorboxCreateResponse, TorboxTorrentlistResponse, EnvBindings } from '../types';
import { TorboxCreateSchema, TorboxMylistSchema, TorBoxDownloadSchema } from '../validators';

const getDownloadLink = async (env: EnvBindings, torrentId: string | undefined): Promise<string | undefined> => {
	try {
		if (!torrentId) throw new Error('Missing torrentId!');
		const url = `${env.TORBOX_API_BASE_URL}/api/torrents/requestdl?token=${env.TORBOX_API_KEY}&torrent_id=${torrentId}&zip_link=true&redirect=false`;
		const responseFromTorBox = await fetch(url);
		const jsonData = await responseFromTorBox.json();
		const parsedData = TorBoxDownloadSchema.parse(jsonData);
		return parsedData?.data || undefined;
	} catch (error) {
		console.error('Failed to fetch ZIP download link:', error);
		return undefined;
	}
};

const fetchTorrentlist = async (env: EnvBindings): Promise<TorboxTorrentlistResponse> => {
	const response = await fetch(`${env.TORBOX_API_BASE_URL}/api/torrents/mylist`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${env.TORBOX_API_KEY}` },
	});
	const json = await response.json();
	const parsed = TorboxMylistSchema.parse(json);
	return parsed;
};

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

		if (!parsedData.success && parsedData.error) {
			throw new Error(parsedData.error);
		}

		// Add download link for convenience
		const torrentId = parsedData.data?.torrent_id.toString();
		const downloadLink = await getDownloadLink(env, torrentId);

		return {
			...parsedData,
			message: '✅ Torrent added successfully!',
			download_url: downloadLink ? downloadLink : "Can't fetch download url!",
		};
	} catch (error) {
		console.error(error);
		return {
			success: false,
			error: '❌ Failed! Torrent not added.',
		};
	}
};

export { createTorrent, fetchTorrentlist, getDownloadLink };
