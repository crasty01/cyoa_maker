<script lang="ts">
	import { type RowInfo, dataStore } from '$lib/stores/data';
	import { getFlagValue } from '$lib/functions/basicDataGeneration';
	import CYOACard from './CYOACard.svelte';

	export let row: RowInfo;
	export let rowId: string;

	$: connectedflagValue = row.flagId ? getFlagValue($dataStore.flags.get(row.flagId)!) : true;
</script>

<div
	class="cyoa_row relative p-4 {connectedflagValue ? '' : 'opacity-40'}"
>
	<h2 class="h2 pb-2 font-extrabold">{row.name}</h2>
	<p class="max-w-xl">{row.description}</p>

	{#if row.cards.length > 0}
		<div class="mt-4 flex flex-wrap gap-2">
			{#each row.cards as cardId}
				{@const card = $dataStore.cards.get(cardId)}
				{#if card}
					<CYOACard {card} />
				{:else}
					<p>CardInfo [{cardId}] not found</p>
				{/if}
			{/each}
		</div>
	{/if}
</div>
