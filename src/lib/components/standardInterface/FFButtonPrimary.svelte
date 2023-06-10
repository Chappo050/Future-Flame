<script lang="ts">
	export let icon: any | null = undefined;
	export let label: String;
	export let clickAction: Function;
</script>

<button type="button" on:click={() => clickAction()} class="btn variant-filled-primary">
	{#if icon}
		<span>{icon}</span>
	{/if}
	<span>{label}</span>
</button>
