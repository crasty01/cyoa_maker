import {
	dataStore,
	type CardInfo,
	type PointInfo,
	type RowInfo,
	type FlagInfo,
	type Condition,
	type CardCondition,
	type StaticCondition,
	type PointCondition,
	type EvaluationType
} from '$lib/stores/data';
import { get } from 'svelte/store';

export const createBasicRow = ({
	name = `Row_${(get(dataStore).rows.length + 1).toFixed(0).padStart(2, '0')}`,
	description = 'a blank row',
	cardCreationFn = undefined as ((row: RowInfo, card: CardInfo) => CardInfo) | undefined
} = {}): RowInfo => {
	const id = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
	const row: RowInfo = {
		id,
		name,
		description,
		cardCreationFn,
		cards: [],
		flags: []
	};

	dataStore.update((store) => {
		store.rows.push(row);
		return store;
	});

	return row;
};

export const createBasicCard = (
	rowIndex: number,
	{
		name = 'New Card',
		description = 'a blank card',
		price = 0,
		selected = 0,
		max_stack = 1,
		show_price = true,
		pointId = undefined as string | undefined
	} = {}
): CardInfo => {
	const id = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
	const _card: CardInfo = {
		id,
		name,
		description,
		price,
		show_price,
		pointId,
		selected,
		max_stack,
		rowIndex
	};

	const row = get(dataStore).rows[rowIndex];
	const card = row.cardCreationFn ? row.cardCreationFn(row, _card) : _card;

	dataStore.update((store) => {
		store.cards.set(id, card);
		return store;
	});

	return card;
};

export const createBasicPoint = ({
	name = 'New Point',
	starting = 0,
	min = -Number.MAX_SAFE_INTEGER,
	max = Number.MAX_SAFE_INTEGER,
	visible = true
} = {}): PointInfo => {
	const id = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
	const point: Omit<PointInfo, 'value'> = {
		id,
		name,
		starting,
		min,
		max,
		visible
	};

	dataStore.update((store) => {
		store.points.set(id, point);
		return store;
	});

	return point;
};

export const createBasicFlag = ({
	name = 'New Flag',
	conditions = [],
	type = 'AND' as 'AND' | 'OR' | 'NOT'
} = {}): FlagInfo => {
	const id = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
	const flag: FlagInfo = {
		id,
		name,
		conditions,
		type
	};

	dataStore.update((store) => {
		store.flags.set(id, flag);
		return store;
	});

	return flag;
};

export const createBasicStaticCondition = ({ value = false } = {}): StaticCondition => {
	const condition: StaticCondition = {
		condition_type: 'static_condition',
		value
	};

	return condition;
};

export const createBasicCardCondition = (
	cardId: string,
	{ type = 'equal' as EvaluationType, value = 0 } = {}
): CardCondition => {
	const condition: CardCondition = {
		condition_type: 'card_condition',
		cardId,
		type,
		value
	};

	return condition;
};

export const createBasicPointCondition = (
	pointId: string,
	{ type = 'equal' as EvaluationType, value = 0 } = {}
): PointCondition => {
	const condition: PointCondition = {
		condition_type: 'point_condition',
		pointId,
		type,
		value
	};

	return condition;
};

export const getPointValue = (point: PointInfo): number => {
	let v = point.starting;
	const cards = get(dataStore).cards;
	for (const [_, card] of cards) {
		if (card.pointId !== point.id) continue;
		v += card.selected * card.price;
	}
	console.log('getPointValue', point.id, v);
	return v;
};

const evaluateCondition = (
	evaluatingValue: number,
	type: EvaluationType,
	evaluatorValue: number
): boolean => {
	switch (type) {
		case 'equal':
			return evaluatingValue === evaluatorValue;
		case 'greater':
			return evaluatingValue > evaluatorValue;
		case 'greater_or_equal':
			return evaluatingValue >= evaluatorValue;
		case 'less':
			return evaluatingValue < evaluatorValue;
		case 'less_or_equal':
			return evaluatingValue <= evaluatorValue;
		default:
			console.error('unknown evaluation type', type);
			return false;
	}
};

export const getConditionValue = (condition: Condition): boolean => {
	switch (condition.condition_type) {
		case 'card_condition':
			const card = get(dataStore).cards.get(condition.cardId);
			if (!card) {
				console.warn('card not found', condition.cardId);
				return false;
			}
			return evaluateCondition(card.selected, condition.type, condition.value);
		case 'point_condition':
			const point = get(dataStore).points.get(condition.pointId);
			if (!point) {
				console.warn('point not found', condition.pointId);
				return false;
			}
			return evaluateCondition(getPointValue(point), condition.type, condition.value);
		case 'static_condition':
			return condition.value;
		default:
			console.error('unknown condition type', condition);
			return false;
	}
};

export const getFlagValue = (flag: FlagInfo): boolean => {
	const values = flag.conditions.map(getConditionValue);
	switch (flag.type) {
		case 'AND':
			return values.every((v) => v);
		case 'OR':
			return values.some((v) => v);
		case 'NOT':
			return !values[0];
		default:
			console.error('unknown flag type', flag);
			return false;
	}
};
