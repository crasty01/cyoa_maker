<script lang="ts">
	import {
		dataStore,
		type Condition,
		type FlagInfo,
		type CardCondition,
		type PointCondition
	} from '$lib/stores/data';
	import {
		createBasicCardCondition,
		createBasicPointCondition,
		createBasicStaticCondition
	} from '$lib/functions/basicDataGeneration';
	import Icon from '@iconify/svelte';
	import { modalStore } from '@skeletonlabs/skeleton';

	export let flag: FlagInfo;

	// let formData: RowInfo = row;
	let formData: FlagInfo = flag && structuredClone(flag);

	type ConditionForm = Partial<{
		condition_type: Condition['condition_type'];
		point_id: string;
		card_id: string;
		static_value: boolean;
		point_value: number;
		card_value: number;
		point_type: PointCondition['type'];
		card_type: CardCondition['type'];
	}>;
	let condition: ConditionForm = {
		card_value: 0,
		point_value: 0
	};

	const createCondition = (condition: ConditionForm): boolean => {
		switch (condition.condition_type) {
			case 'static_condition':
				formData.conditions.push(
					createBasicStaticCondition({
						value: condition.static_value
					})
				);
				break;
			case 'point_condition':
				if (!condition.point_id) return false;
				formData.conditions.push(
					createBasicPointCondition(condition.point_id, {
						value: condition.point_value,
						type: condition.point_type
					})
				);
				break;
			case 'card_condition':
				if (!condition.card_id) return false;
				formData.conditions.push(
					createBasicCardCondition(condition.card_id, {
						value: condition.card_value,
						type: condition.card_type
					})
				);
				break;
		}

		formData.conditions = formData.conditions;
		return true;
	};

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
	<div class="modal-example-form card w-modal max-h-[80vh] space-y-4 overflow-auto p-4 shadow-xl">
		<!-- <pre>{JSON.stringify(formData, null, 2)}</pre> -->
		<form class="modal-form space-y-4 border border-surface-500 p-4 rounded-container-token">
			<label class="label">
				<span>name</span>
				<input class="input" type="text" bind:value={formData.name} placeholder="Enter name..." />
			</label>

			<label class="label">
				<span>type</span>
				<select class="input" bind:value={formData.type}>
					<option value="AND">AND</option>
					<option value="OR">OR</option>
					<option value="NOT">NOT</option>
				</select>
			</label>
		</form>

		<form class="modal-form border border-surface-500 p-4 rounded-container-token">
			<label class="label">
				<span>condition type</span>
				<select class="input" bind:value={condition.condition_type}>
					<option value="static_condition">static condition</option>
					<option value="point_condition">point condition</option>
					<option value="card_condition">card condition</option>
				</select>
			</label>

			{#if condition.condition_type === 'static_condition'}
				<label class="label">
					<span>value</span>
					<select class="input" bind:value={condition.static_value}>
						<option value={true}>true</option>
						<option value={false}>false</option>
					</select>
				</label>
			{/if}

			{#if condition.condition_type === 'point_condition'}
				<label class="label">
					<span>point</span>
					<select class="input" bind:value={condition.point_id}>
						{#each $dataStore.points as [_, point]}
							<option value={point.id}>{point.name}</option>
						{/each}
					</select>
				</label>

				<label class="label">
					<span>type</span>
					<select class="input" bind:value={condition.point_type}>
						<!-- "equal" | "greater" | "greater_or_equal" | "less" | "less_or_equal" -->
						<option value="equal">equal</option>
						<option value="greater">greater</option>
						<option value="greater_or_equal">greater or equal</option>
						<option value="less">less</option>
						<option value="less_or_equal">less or equal</option>
					</select>
				</label>

				<label class="label">
					<span>value</span>
					<input class="input" type="number" bind:value={condition.point_value} />
				</label>
			{/if}

			{#if condition.condition_type === 'card_condition'}
				<label class="label">
					<span>card</span>
					<select class="input" bind:value={condition.card_id}>
						{#each $dataStore.cards as [_, card]}
							<option value={card.id}>{card.name}</option>
						{/each}
					</select>
				</label>

				<label class="label">
					<span>type</span>
					<select class="input" bind:value={condition.card_type}>
						<!-- "equal" | "greater" | "greater_or_equal" | "less" | "less_or_equal" -->
						<option value="equal">equal</option>
						<option value="greater">greater</option>
						<option value="greater_or_equal">greater or equal</option>
						<option value="less">less</option>
						<option value="less_or_equal">less or equal</option>
					</select>
				</label>

				<label class="label">
					<span>value</span>
					<input class="input" type="number" bind:value={condition.card_value} />
				</label>
			{/if}

			<div class="mt-4 flex justify-end">
				<button class="btn variant-filled-primary" on:click={() => createCondition(condition)}>
					<Icon icon="material-symbols:add-rounded" />
					<span>add condition</span>
				</button>
			</div>
		</form>

		<slot />

		<footer class="flex justify-end space-x-2">
			<button class="btn variant-ghost-primary" on:click={() => console.log(formData)}>
				<span>log</span>
			</button>
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
