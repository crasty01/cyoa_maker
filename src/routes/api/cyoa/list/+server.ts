import { json } from '@sveltejs/kit';
import { cyoaDatabase, cyoaDrive } from '$lib/services/database';

export async function GET(event) {
	const last = event.url.searchParams.get('last') ?? undefined;

	const list = await cyoaDatabase.fetch(
		{},
		{
			last,
			limit: 20
		}
	);

	const parsedList = list.items.map((item) => {
		return {
			// file: item.file,
			// hash: item.hash,
			isShared: item.isShared,
			key: item.key,
			name: item.name
		};
	});

	return json({
		items: parsedList,
		last: list.last,
		count: list.count
	});
}
