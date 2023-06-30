import type { CardCondition, CardInfo, PointInfo, RowInfo } from '$lib/stores/data';
import {
	createBasicCard,
	createBasicPoint,
	createBasicRow,
	getPointValue
} from '$lib/functions/basicDataGeneration';
import { get } from 'svelte/store';

export const createChooseTreeRow = () => {
	const row: RowInfo = createBasicRow({
		description: 'Choose up to 3 cards'
	});
	const point: PointInfo = createBasicPoint({
		name: `row-${row.id}-point`,
		visible: false,
		min: 0,
		max: 3,
		starting: 3
	});

	const cardCreationFn = (row: RowInfo, card: CardInfo): CardInfo => ({
		...card,
		price: -1,
		pointId: point.id
	});
	row.cardCreationFn = cardCreationFn;
};
