<script lang="ts">
	export let icon: any | null = undefined;
	export let label: String;
	export let clickAction: Function;
</script>

<button
	type="button"
	on:click={() => clickAction()}
	class="btn lg:max-h-10 max-h-6 variant-ringed-primary"
>
	{#if icon}
		<span>{icon}</span>
	{/if}
	<span>{label}</span>
</button>
