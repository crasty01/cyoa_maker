<script lang="ts">
	import Icon from '@iconify/svelte';
	import { dataStore, type CardInfo } from '$lib/stores/data';
	import { getFlagValue, getPointValue } from '$lib/functions/basicDataGeneration';

	export let card: CardInfo;

	$: connectedflagValue = card.flagId ? getFlagValue($dataStore.flags.get(card.flagId)!) : true;
	$: parentRowFlagId = $dataStore.rows.get(card.rowId)!.flagId;
	$: connectedflagValueRow = parentRowFlagId
		? getFlagValue($dataStore.flags.get(parentRowFlagId)!)
		: true;
	$: pointName = card.pointId ? $dataStore.points.get(card.pointId)!.name : '';

	const selectCard = (toAdd?: -1 | 1) => {
		// if (!card?.pointId) return;

		let oldSelected = card.selected;
		if (toAdd) {
			card.selected = Math.min(card.max_stack, Math.max(0, card.selected + toAdd));
		} else {
			card.selected = card.selected === 0 ? 1 : 0;
		}

		// if new point value is lower than min and higher than max, revert to old value
		if (card.pointId) {
			const point = $dataStore.points.get(card.pointId)!;
			const value = getPointValue(point);
			console.log('value:', value);
			if (value < point.min || value > point.max) {
				card.selected = oldSelected;
			}
		}

		$dataStore = $dataStore; // trigger update
	};
</script>

<div
	class="card relative flex flex-col flex-grow p-4 border-2 ring-0 border-transparent shadow-primary-300 {card.selected > 0
		? 'bg-primary-300 border-primary-500'
		: 'bg-primary-100'} {connectedflagValue || !connectedflagValueRow ? '' : 'opacity-40'}"
>
	<div class="flex items-baseline gap-4">
		<h3 class="h3 pb-2 font-bold">{card.name}</h3>
		{#if card.show_price}
			<div>price: {card.price} {pointName}</div>
		{/if}
	</div>
	<p class="max-w-xl">{card.description}</p>

	<div class="card__footer mt-4 flex-grow flex flex-col justify-end">
		{#if card.max_stack > 1}
			<div class="flex justify-center items-center gap-4">
				<button type="button" class="btn variant-filled-primary" on:click={() => selectCard(+1)}>
					<Icon icon="material-symbols:add-rounded" />
					<span>add</span>
				</button>
				<span class="card px-4 py-2">{card.selected} / {card.max_stack}</span>
				<button type="button" class="btn variant-filled-primary" on:click={() => selectCard(-1)}>
					<Icon icon="material-symbols:remove-rounded" />
					<span>remove</span>
				</button>
			</div>
		{:else}
			<button type="button" class="btn variant-filled-primary w-full" on:click={() => selectCard()}>
				<span>select</span>
			</button>
		{/if}
	</div>
</div>
