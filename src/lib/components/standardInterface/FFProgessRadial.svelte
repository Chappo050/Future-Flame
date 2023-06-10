<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	export let size: string = 'w-20';
</script>

<div class="flex justify-center">
	<ProgressRadial
		width={size}
		stroke={150}
		meter="stroke-primary-500"
		track="stroke-primary-500/30"
	/>
</div>
