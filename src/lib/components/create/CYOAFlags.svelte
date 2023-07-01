<script lang="ts">
	import { dataStore } from '$lib/stores/data';
	import CYOAFlag from './CYOAFlag.svelte';
</script>

{#if $dataStore.flags.size > 0}
	<div class="card variant-ghost-primary bg-primary-300 min-w-[16rem] flex-auto px-4 py-4">
		<div class="flex max-h-96 flex-col gap-2 overflow-y-scroll overscroll-contain pr-2">
			{#each $dataStore.flags as [pointIndex, flag]}
				<CYOAFlag {flag} />
			{/each}
		</div>
	</div>
{/if}
