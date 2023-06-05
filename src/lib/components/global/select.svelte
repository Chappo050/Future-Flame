<script lang="ts">
	let placeHolder = [
		{ value: 1, text: 'Option 1' },
		{ value: 2, text: 'Option 2' },
		{ value: 3, text: 'Option 3' }
	];
</script>

<label class="label">
	<span>Select</span>
	<select class="select">
		{#each placeHolder as option}
			<option value={option.value}>{option.text}</option>
		{/each}
	</select>
</label>
