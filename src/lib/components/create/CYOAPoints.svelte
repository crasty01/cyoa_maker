<script lang="ts">
	import { dataStore } from '$lib/stores/data';

	import CYOAPoint from './CYOAPoint.svelte';

	let showInvisible = true;
</script>

{#if $dataStore.points.size > 0}
	<div class="card variant-ghost-primary min-w-[16rem] flex-auto bg-primary-300 px-4 py-4">
		<label class="label mb-4 flex select-none content-between gap-2 px-2">
			<span>show invisible points</span>
			<input type="checkbox" class="input w-4" bind:checked={showInvisible} />
		</label>
		<div class="flex max-h-96 flex-col gap-2 overflow-y-scroll overscroll-contain pr-2">
			{#each $dataStore.points as [pointIndex, point]}
				{#if point.visible || showInvisible}
					<CYOAPoint {point} />
				{/if}
			{/each}
		</div>
	</div>
{/if}
