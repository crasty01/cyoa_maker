<script lang="ts">
	import { createAndSaveBasicPoint } from '$lib/functions/basicDataGeneration';
	import { dataStore, type RowInfo } from '$lib/stores/data';
	import Icon from '@iconify/svelte';
	import { modalStore } from '@skeletonlabs/skeleton';
	import CYOAImageSelector from './CYOAImageSelector.svelte';

	export let row: RowInfo;

	// let formData: RowInfo = row;
	let formData: RowInfo = row && structuredClone(row);

	// Handle Form Submission
	const onFormSubmit = (): void => {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	};

	const onClose = (): void => {
		// console.log('onClose', formData, row);
		// formData = structuredClone(row);

		modalStore.close();
	};
</script>

{#if $modalStore[0]}
	<div class="modal-example-form card w-modal max-h-[80vh] space-y-4 overflow-auto p-4 shadow-xl">
		<h2 class="h2 font-extrabold">row settings</h2>
		<form class="modal-form space-y-4 border border-surface-500 p-4 rounded-container-token">
			<h3 class="h3 font-extrabold">basic row settings</h3>
			<label class="label">
				<span>name</span>
				<input class="input" type="text" bind:value={formData.name} placeholder="Enter name..." />
			</label>
			<label class="label">
				<span>description</span>
				<textarea
					class="input"
					rows="3"
					bind:value={formData.description}
					placeholder="Enter description..."
				/>
			</label>
			<label class="label">
				<span>flag</span>
				<select class="input" bind:value={formData.flagId}>
					<option value={undefined}>-</option>
					{#each $dataStore.flags.entries() as [index, flag]}
						<option value={flag.id}>{flag.name}</option>
					{/each}
				</select>
			</label>
		</form>

		<form class="modal-form space-y-4 border border-surface-500 p-4 rounded-container-token">
			<h3 class="h3 font-extrabold">row's default card settings</h3>
			{#if $dataStore.points.size > 0}
				<label class="label">
					<span>pointId</span>
					<select class="input" bind:value={formData.cardDefault.pointId}>
						<option value={undefined}>-</option>
						{#each $dataStore.points.entries() as [index, point]}
							<option value={point.id}>{point.name}</option>
						{/each}
					</select>
				</label>

				{#if formData.cardDefault.pointId}
					<label class="label">
						<span>price</span>
						<!--(negative number subtracts points, positive ads)-->
						<input
							class="input"
							type="number"
							bind:value={formData.cardDefault.price}
							placeholder="Enter price..."
						/>
					</label>
				{/if}
			{:else}
				<aside class="variant-filled-warning alert">
					<!-- Message -->
					<div class="alert-message">
						<span>no points were created yet</span>
					</div>
					<!-- Actions -->
					<div class="alert-actions">
						<button
							type="button"
							class="btn variant-filled"
							on:click={() => createAndSaveBasicPoint()}
						>
							<span>add point type</span>
						</button>
					</div>
				</aside>
			{/if}

			<label class="label">
				<span>max stack</span>
				<input
					class="input"
					type="number"
					bind:value={formData.cardDefault.max_stack}
					placeholder="Enter max stack..."
				/>
			</label>

			<label class="label">
				<span>show price</span>
				<input type="checkbox" class="input w-4" bind:checked={formData.cardDefault.show_price} />
			</label>
		</form>

		<form class="modal-form space-y-4 border border-surface-500 p-4 rounded-container-token">
			<h3 class="h3 font-extrabold">choose image</h3>
			<CYOAImageSelector bind:selectedImageId={formData.imageId} />
		</form>

		<slot />

		<footer class="flex justify-end space-x-2">
			<button class="btn variant-ghost-primary" on:click={onClose}>
				<Icon icon="material-symbols:close-rounded" />
				<span>close</span>
			</button>
			<button class="btn variant-filled-primary" on:click={onFormSubmit}>
				<Icon icon="material-symbols:save-rounded" />
				<span>save</span>
			</button>
		</footer>
	</div>
{/if}
