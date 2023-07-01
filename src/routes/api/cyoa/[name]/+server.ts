import { json, error } from '@sveltejs/kit';
import { cyoaDatabase, cyoaDrive } from '$lib/services/database';

export async function GET(event) {
	const name = event.params.name;
	const hash = event.url.searchParams.get('hash');

	const list = await cyoaDatabase.fetch({
		name,
		hash
	});

	if (list.count !== 1) {
		throw error(404, {
			message: 'Invalid name or key'
		});
	}
	console.log(list);

	const file = await cyoaDrive.get(list.items[0].file as string); // blob

	if (!file) {
		throw error(404, {
			message: 'File not found'
		});
	}

	return new Response(file, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
