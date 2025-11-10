import { z } from 'zod';

export const TorboxDataSchema = z.object({
	hash: z.string(),
	torrent_id: z.number().int().positive(),
	auth_id: z.uuid(),
});

export const TorboxCreateSchema = z.object({
	success: z.boolean(),
	error: z.string().nullable(),
	detail: z.string().optional(),
	data: TorboxDataSchema.optional(),
});

export const TorboxMylistSchema = z.object({
	success: z.boolean(),
	detail: z.string().optional(),
	data: z.any().optional(),
});
