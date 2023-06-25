<script lang="ts">
	import GoogleMaps from '$lib/components/maps/googleMaps.svelte';
	import LocationList from './LocationList.svelte';
	import { APIRequest } from '$lib/helpers/APIHelpers';
	import { onMount } from 'svelte';
	import FfProgessRadial from '$lib/components/standardInterface/FFProgessRadial.svelte';

	let locations: MarkerData[] = [];
	let map: any;
	let loading: boolean = true;
	export let isAdmin: boolean = false;
	export let groupId: string | undefined;
	const listLocations = async (markers: MarkerData[]) => {
		locations = markers;
		console.log(markers);
		if (markers.length) {
			locations = markers.map(({ marker, ...rest }) => rest);
		}

		try {
			console.log('seding location', locations);

			const res = await APIRequest('/api/protected/group/location', 'PUT', { locations, groupId });
		} catch (error) {
			console.log('Error while setting location', error);
		}
	};

	onMount(async () => {
		const res = await APIRequest(`/api/protected/group/location?groupId=${groupId}`, 'GET');
		console.log('GOT LOCATIONS', res);
		if (res.success) {
			locations = res.data;
		}
		loading = false;
	});

	$: locations = locations;
</script>

{#if !loading}
	<div class="flex lg:flex-row flex-col gap-10">
		<LocationList {locations} {isAdmin} on:updateLocation={(e) => listLocations(e.detail)} />
		<GoogleMaps {map} {isAdmin} {locations} globally on:markers={(e) => listLocations(e.detail)} />
	</div>
{:else}
	<FfProgessRadial />
{/if}
