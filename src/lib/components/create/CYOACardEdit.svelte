<script lang="ts">
	import { createAndSaveBasicPoint } from '$lib/functions/basicDataGeneration';
	import { dataStore, type CardInfo } from '$lib/stores/data';
	import Icon from '@iconify/svelte';
	import { modalStore } from '@skeletonlabs/skeleton';

	export let card: CardInfo;

	// let formData: RowInfo = row;
	let formData: CardInfo = card && structuredClone(card);

	// Handle Form Submission
	const onFormSubmit = (): void => {
		formData.selected = formData.max_stack > 1 ? formData.selected : Math.min(1, formData.selected);
		formData.price = formData.pointId ? formData.price : 0;
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	};

	const onClose = (): void => {
		modalStore.close();
	};
</script>

{#if $modalStore[0]}
	<div class="modal-example-form card w-modal space-y-4 p-4 shadow-xl">
		<form class="modal-form space-y-4 border border-surface-500 p-4 rounded-container-token">
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

			{#if $dataStore.points.size > 0}
				<label class="label">
					<span>pointId</span>
					<select class="input" bind:value={formData.pointId}>
						<option value={undefined}>-</option>
						{#each $dataStore.points.entries() as [index, point]}
							<option value={point.id}>{point.name}</option>
						{/each}
					</select>
				</label>

				{#if formData.pointId}
					<label class="label">
						<span>price</span>
						<!--(negative number subtracts points, positive ads)-->
						<input
							class="input"
							type="number"
							bind:value={formData.price}
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
					bind:value={formData.max_stack}
					placeholder="Enter max stack..."
				/>
			</label>

			<label class="label">
				<span>show price</span>
				<input type="checkbox" class="input w-4" bind:checked={formData.show_price} />
			</label>
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
