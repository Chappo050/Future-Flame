<script lang="ts">
	interface Option {
		value: String;
		text: String;
	}

	export let selectArray: Array<Option> = [];
</script>

<label class="label">
	<span>Select</span>
	<select class="select">
		{#each selectArray as option}
			<option value={option.value}>{option.text}</option>
		{/each}
	</select>
</label>
