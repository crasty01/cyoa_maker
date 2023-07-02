import { error, json } from '@sveltejs/kit';
import { cyoaDatabase, cyoaDrive, cyoaImages } from '$lib/services/database';

const isNull = (value: unknown): value is null => value === null;

export async function GET(event) {
	const data = await cyoaImages.get(event.params.fileName);

	if (isNull(data)) {
		error(404, 'File not found');
	} else {
		return new Response(data, {
			headers: {
				'Content-Type': data.type
			}
		});
	}
}
