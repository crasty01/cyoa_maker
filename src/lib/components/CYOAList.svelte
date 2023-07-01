<script lang="ts">
	import { goto } from '$app/navigation';
	import { getNamesFromBackend, getDataFromBackend } from '$lib/functions/save';
	import { dataStore } from '$lib/stores/data';
	import Icon from '@iconify/svelte';
	import {
		Stepper,
		Step,
		ListBox,
		ListBoxItem,
		modalStore,
		Paginator,
		RadioGroup,
		RadioItem
	} from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	let list: Awaited<ReturnType<typeof getNamesFromBackend>>['items'] = [];
	let last: string | undefined = undefined;

	let redirect: 'create' | 'view' = 'create';
	let error: string | undefined = undefined;
	let loading = false;

	let lock = false;

	let key: string | undefined = undefined;
	let password: string | undefined = undefined;

	const complete = async () => {
		loading = true;
		try {
			const name = list.find((item) => item.key === key)?.name;
			if (!name) throw new Error('No name was provided');
			if (!password) throw new Error('No password was provided');

			const data = await getDataFromBackend(name, password);
			dataStore.set(data);
			// error = undefined;

			goto(`/${redirect}`);
			modalStore.close();
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	};

	const fetchNext = async () => {
		if (lock) return;
		const res = await getNamesFromBackend(last);
		list.push(...res.items);
		list = list; // force update
		last = res.last;
		page.size = list.length;
		if (!last) lock = true;

		console.log('set size:', new Set(list.map((item) => item.key)).size);
	};

	let page = {
		offset: 0,
		limit: 5,
		size: 0,
		amounts: []
	};

	$: slicedList = list.slice(page.offset * page.limit, (page.offset + 1) * page.limit);
	$: validPassword = password !== undefined && password.length > 5 && password.length < 100;

	const pageChanged = ({ detail: offset }: { detail: number }) => {
		console.log('offset:', offset);
		if ((offset + 1) * page.limit >= list.length && !lock) fetchNext();
	};

	onMount(async () => {
		await fetchNext();
	});
</script>

<div class="card min-w-[30rem] bg-primary-300 p-4">
	<Stepper on:complete={() => complete()}>
		<Step locked={key === undefined}>
			<svelte:fragment slot="header">choose your cyoa</svelte:fragment>
			<div class="min-h-[14rem]">
				<ListBox>
					{#each slicedList as item}
						<ListBoxItem bind:group={key} name="medium" value={item.key}>
							<span>{item.name}</span>
							<svelte:fragment slot="trail"
								>{item.isShared ? 'shared' : 'not shared'}</svelte:fragment
							>
						</ListBoxItem>
					{/each}
				</ListBox>
			</div>
			<Paginator
				bind:settings={page}
				showFirstLastButtons={false}
				showPreviousNextButtons={true}
				on:page={pageChanged}
			/>
		</Step>
		<Step locked={!validPassword}>
			<svelte:fragment slot="header">enter your password</svelte:fragment>
			<form class="modal-form space-y-4 border border-surface-500 p-4 rounded-container-token">
				<label class="label">
					<span>password</span>
					<input
						class="input variant-filled"
						type="password"
						bind:value={password}
						placeholder="Enter password..."
					/>
				</label>
			</form>

			{#if error}
				<span class="text-error">{error}</span>
			{/if}
		</Step>
		<Step>
			<svelte:fragment slot="header">DO you want to edit or view the cyoa?</svelte:fragment>
			<RadioGroup
				background="bg-primary-300"
				active="variant-filled-primary"
				hover="hover:variant-soft-primary"
			>
				<RadioItem bind:group={redirect} name="justify" value={'view'}>view</RadioItem>
				<RadioItem bind:group={redirect} name="justify" value={'create'}>edit</RadioItem>
			</RadioGroup>
		</Step>
	</Stepper>

	{#if error !== undefined}
		<div class="card mt-4 flex items-center justify-between bg-error-400 px-4 py-2">
			<span>{error}</span>
			<button
				on:click={() => {
					error = undefined;
				}}
				class="btn btn-icon btn-icon-sm hover:bg-error-500"
			>
				<Icon icon="material-symbols:close-rounded" class="text-xl" />
			</button>
		</div>
	{/if}
</div>
