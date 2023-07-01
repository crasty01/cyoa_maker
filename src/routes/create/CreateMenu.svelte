<script lang="ts">
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { Accordion, AccordionItem, modalStore } from '@skeletonlabs/skeleton';
	import { clearDataStore, dataStore } from '$lib/stores/data';

	import {
		createAndSaveBasicRow,
		createAndSaveBasicPoint,
		createAndSaveBasicFlag
	} from '$lib/functions/basicDataGeneration';
	import { createChooseTreeRow } from '$lib/functions/advancedDataGeneration';
	import { sendDataToBackend } from '$lib/functions/save';

	let showmenu = true;

	const clear = async () => {
		const response = await new Promise<boolean>((resolve) =>
			modalStore.trigger({
				type: 'confirm',
				title: 'Please Confirm',
				body: `Are you cure you want to completly clear out current state?`,
				response: resolve
			})
		);

		if (response !== true) return;
		else clearDataStore();
	};

	const save = async () => {
		const name = await new Promise<string>((resolve) =>
			modalStore.trigger({
				type: 'prompt',
				title: 'Write the name of the cyoa',
				value: '',
				valueAttr: {
					required: true,
					type: 'text',
					minlength: 5,
					maxlength: 50,
				},
				response: resolve
			})
		);
		console.log('name:', name);
		if (!name) return;

		const pasword = await new Promise<string>((resolve) =>
			modalStore.trigger({
				type: 'prompt',
				title: 'Write the password for the cyoa',
				value: '',
				valueAttr: {
					required: true,
					type: 'password',
					minlength: 5,
					maxlength: 50,
				},
				response: resolve
			})
		);
		console.log('pasword:', pasword);

		if (!pasword) return;
		
		
		await sendDataToBackend($dataStore, name, pasword, true);
	};
</script>

<div class="fixed bottom-0 right-0 z-10 flex items-end gap-4 p-4">
	{#if showmenu}
		<div in:fade out:fade class="w-min min-w-[20rem]">
			<Accordion class="card px-2 py-4 text-token" regionControl="bg-surface-300-600-token">
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
								on:click={() => createAndSaveBasicRow()}
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
								on:click={() => createAndSaveBasicPoint()}
							>
								add basic point
							</button>
							<button
								type="button"
								class="btn variant-filled-primary w-full"
								on:click={() => createAndSaveBasicPoint({ visible: false })}
							>
								add invisible point
							</button>
						</div>
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem open>
					<svelte:fragment slot="lead">
						<Icon class="text-2xl" icon="material-symbols:flag-rounded" />
					</svelte:fragment>
					<svelte:fragment slot="summary">flags</svelte:fragment>
					<svelte:fragment slot="content">
						<div class="list">
							<button
								type="button"
								class="btn variant-filled-primary w-full"
								on:click={() => createAndSaveBasicFlag()}
							>
								add basic flag
							</button>
						</div>
					</svelte:fragment>
				</AccordionItem>
				<AccordionItem>
					<svelte:fragment slot="lead">
						<Icon class="text-2xl" icon="ic:round-settings" />
					</svelte:fragment>
					<svelte:fragment slot="summary">others & danger</svelte:fragment>
					<svelte:fragment slot="content">
						<div class="list">
							<button
								type="button"
								class="btn variant-filled-error w-full"
								on:click={() => clear()}
							>
								clear
							</button>
							<button
								type="button"
								class="btn variant-filled-error w-full"
								on:click={() => save()}
							>
								save
							</button>
						</div>
					</svelte:fragment>
				</AccordionItem>
			</Accordion>
		</div>
	{/if}

	<div class="fab flex flex-col gap-4">
		<a
			href="/"
			class="btn-icon btn-icon-lg variant-filled-surface"
		>
			<Icon icon="material-symbols:home-rounded" class="text-2xl" />
		</a>
		<a
			href="https://github.com/crasty01/cyoa_maker"
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
