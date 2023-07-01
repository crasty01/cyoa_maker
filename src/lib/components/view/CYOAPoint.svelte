<script lang="ts">
	import { getPointValue } from '$lib/functions/basicDataGeneration';
	import type { PointInfo } from '$lib/stores/data';

	export let point: PointInfo;

	$: value = getPointValue(point);
</script>

<div
	class="card flex items-center gap-2 border-2 border-surface-900 {!point.visible &&
		'border-dashed'} px-4 py-2"
>
	<span>{point.name}:</span>
	<span>{value}</span>
</div>
