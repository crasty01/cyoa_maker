<script lang="ts">
	import { dataStore, type Condition } from '$lib/stores/data';
	import Icon from '@iconify/svelte';
	import { modalStore } from '@skeletonlabs/skeleton';

	export let condition_type: Condition['condition_type'];

	// let formData: RowInfo = row;
	let formData = {
		id: undefined
	};

	$: options =
		condition_type === 'point_condition'
			? [...$dataStore.points.values()].map((e) => ({
					value: e.id,
					label: e.name
			  }))
			: [...$dataStore.cards.values()].map((e) => ({
					value: e.id,
					label: e.name
			  }));

	// Handle Form Submission
	const onFormSubmit = (): void => {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	};

	const onClose = (): void => {
		modalStore.close();
	};
</script>

{#if $modalStore[0]}
	<div class="modal-example-form card w-modal space-y-4 p-4 shadow-xl">
		<pre>{JSON.stringify(formData, null, 2)}</pre>
		<form class="modal-form space-y-4 border border-surface-500 p-4 rounded-container-token">
			<label>
				<span>{condition_type === 'point_condition' ? 'choose point' : 'choose card'}</span>
				<select class="input" bind:value={formData.id}>
					{#each options as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
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
