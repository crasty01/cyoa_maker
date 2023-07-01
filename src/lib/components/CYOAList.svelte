<script lang="ts">
	import { goto } from '$app/navigation';
	import { getNamesFromBackend, getDataFromBackend } from '$lib/functions/save';
	import { dataStore } from '$lib/stores/data';
	import { Stepper, Step, ListBox, ListBoxItem, modalStore } from '@skeletonlabs/skeleton';

	const rawData = getNamesFromBackend();
	let name: string | undefined = undefined;
	let password: string | undefined = undefined;
	let loading = false;
	let error: string | undefined = undefined;

	const complete = async () => {
		loading = true;
		try {
			const data = await getDataFromBackend(name!, password!);
			dataStore.set(data);
			goto('/create');
		} catch (error: any) {
			loading = false;
			error = error.message;
		} finally {
			modalStore.close();
		}
	}
</script>

<div class="card p-4 bg-primary-300 min-w-[30rem]">
	<Stepper on:complete={() => complete()}>
		<Step locked={name === undefined}>
			<svelte:fragment slot="header">choose your cyoa</svelte:fragment>
			{#await rawData}
				<span>loading...</span>
			{:then data}
				<ListBox>
					{#each data.items as item}
						<ListBoxItem bind:group={name} name="medium" value={item.key}>
							<span>{item.name}</span>
							<svelte:fragment slot="trail">{item.isShared ? 'shared' : 'not shared'}</svelte:fragment>
						</ListBoxItem>
					{/each}
				</ListBox>
			{:catch error}
				<pre>{error}</pre>
			{/await}
		</Step>
		<Step>
			<svelte:fragment slot="header">enter your password</svelte:fragment>
			{#if !loading}
				<form class="modal-form space-y-4 border border-surface-500 p-4 rounded-container-token">
					<label class="label">
						<span>password</span>
						<input class="input variant-filled" type="password" bind:value={password} placeholder="Enter password..." />
					</label>
				</form>

				{#if error}
					<span class="text-error">{error}</span>
				{/if}
			{:else}
				<span>loading...</span>
			{/if}
		</Step>
		<!-- ... -->
	</Stepper>
</div>