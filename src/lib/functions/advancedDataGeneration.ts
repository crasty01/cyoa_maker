import type { CardCondition, CardInfo, PointInfo, RowInfo } from '$lib/stores/data';
import {
	createAndSaveBasicCard,
	createAndSaveBasicPoint,
	createAndSaveBasicRow,
	getPointValue
} from '$lib/functions/basicDataGeneration';

export const createChooseTreeRow = () => {
	const row: RowInfo = createAndSaveBasicRow({
		description: 'Choose up to 3 cards',
		cardDefault: {
			max_stack: 1,
			price: -1,
			pointId: undefined,
			show_price: false
		}
	});
	const point: PointInfo = createAndSaveBasicPoint({
		name: `row-${row.id}-point`,
		visible: false,
		min: 0,
		max: 3,
		starting: 3
	});

	row.cardDefault.pointId = point.id;
};
