<script lang="ts">
	import CYOARow from './CYOARow.svelte';
	import CYOAPoints from './CYOAPoints.svelte';
	import { dataStore } from '$lib/stores/data';
</script>

<div class="flex flex-col py-4 px-8 gap-4">
	{#each $dataStore.rowsArray as rowId}
		{@const row = $dataStore.rows.get(rowId)}
		{#if row}
			<CYOARow {row} {rowId} />
		{/if}
	{/each}
</div>

<div class="fixed bottom-4 left-4 flex max-w-xs flex-wrap gap-4 md:max-w-xl">
	<CYOAPoints />
</div>
