<script lang="ts">
	import CYOARow from './CYOARow.svelte';
	import CYOAPoints from './CYOAPoints.svelte';
	import CYOAFlags from './CYOAFlags.svelte';
	import { dataStore } from '$lib/stores/data';
</script>

<div class="list p-4">
	{#each $dataStore.rows.entries() as [index, row]}
		<CYOARow {row} rowIndex={index} />
	{/each}
</div>

<div class="fixed bottom-4 left-4 flex max-w-xs flex-wrap gap-4 md:max-w-xl">
	<CYOAPoints />
	<CYOAFlags />
</div>
