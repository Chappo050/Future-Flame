<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="min-h-screen flex items-center justify-center">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 rounded-lg text-center">
		<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-600 mb-6">
			Oh no! An error occurred.
		</h1>
		<p class="text-lg text-gray-700">{$page.status}: {$page.error?.message}</p>
		<p class="text-gray-500 mt-6">
			We are sorry for the inconvenience. We're working hard to fix the issue.
		</p>
		<div class="mt-6">
			<a href="mailto:support@example.com" class="text-blue-500 hover:underline">Contact us</a> if you
			need further assistance.
		</div>
	</div>
</div>
