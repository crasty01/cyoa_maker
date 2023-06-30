<script lang="ts">
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { dataStore } from '$lib/stores/data';

	import {
		createBasicRow,
		createBasicPoint,
		createBasicFlag
	} from '$lib/functions/basicDataGeneration';
	import { createChooseTreeRow } from '$lib/functions/advancedDataGeneration';

	let showmenu = true;
</script>

<div class="fixed bottom-0 right-0 z-10 flex items-end gap-4 p-4">
	{#if showmenu}
		<div in:fade out:fade class="w-min min-w-[16rem]">
			<Accordion class="card px-2 py-4 text-token">
				<AccordionItem open>
					<svelte:fragment slot="lead">
						<Icon class="text-2xl" icon="material-symbols:create-new-folder-rounded" />
					</svelte:fragment>
					<svelte:fragment slot="summary">rows</svelte:fragment>
					<svelte:fragment slot="content">
						<div class="list">
							<button
								type="button"
								class="btn variant-filled-primary w-full"
								on:click={() => createBasicRow()}
							>
								add basic row
							</button>
							<button
								type="button"
								class="btn variant-filled-primary w-full"
								on:click={() => createChooseTreeRow()}
							>
								add choose 3
							</button>
						</div>
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem open>
					<svelte:fragment slot="lead">
						<Icon class="text-2xl" icon="material-symbols:monetization-on-rounded" />
					</svelte:fragment>
					<svelte:fragment slot="summary">points</svelte:fragment>
					<svelte:fragment slot="content">
						<div class="list">
							<button
								type="button"
								class="btn variant-filled-primary w-full"
								on:click={() => createBasicPoint()}
							>
								add basic point
							</button>
							<button
								type="button"
								class="btn variant-filled-primary w-full"
								on:click={() => createBasicPoint({ visible: false })}
							>
								add invisible point
							</button>
						</div>
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem open>
					<svelte:fragment slot="lead">
						<Icon class="text-2xl" icon="material-symbols:monetization-on-rounded" />
					</svelte:fragment>
					<svelte:fragment slot="summary">flags</svelte:fragment>
					<svelte:fragment slot="content">
						<div class="list">
							<button
								type="button"
								class="btn variant-filled-primary w-full"
								on:click={() => createBasicFlag()}
							>
								add basic flag
							</button>
						</div>
					</svelte:fragment>
				</AccordionItem>
			</Accordion>
		</div>
	{/if}

	<div class="fab flex flex-col gap-4">
		<a
			href="https://github.com/crasty01"
			target="_blank"
			class="btn-icon btn-icon-lg variant-filled-surface"
		>
			<Icon icon="mdi:github" class="text-2xl" />
		</a>
		<button
			on:click={() => {
				console.log($dataStore);
			}}
			type="button"
			class="btn-icon btn-icon-lg variant-filled-surface"
		>
			<Icon icon="material-symbols:bug-report-rounded" class="text-2xl" />
		</button>
		<button
			on:click={() => (showmenu = !showmenu)}
			type="button"
			class="btn-icon btn-icon-lg variant-filled-primary"
		>
			<Icon icon="material-symbols:add-rounded" class="text-2xl" />
		</button>
	</div>
</div>
