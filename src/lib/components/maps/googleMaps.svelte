<script lang="ts">
	import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';

	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	//import mapStyles from './map-styles'; // optional
	export let locations: any = [];
	export let globally = true;
	export let map;
	export let isAdmin = false;
	let src = '';

	// @ts-ignore
	let container;
	let zoom = 10;
	//California default center
	let center = { lat: 36.7783, lng: -119.4179 };

	// Array for markers
	let markers: MarkerData[] = [];

	// Counter for the number of pins
	let pinCounter = 0;
	const getCurrentLocation = async () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					center = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};
					// Initialize map after getting location
					await initMap();
				},
				async (error) => {
					zoom = 3;
					// If user denies location or error occurs, initialize map with default center
					console.error('Error occurred getting location: ', error);
					await initMap();
				}
			);
		} else {
			// Browser doesn't support Geolocation, initialize map with default center
			await initMap();
		}
	};

	const initMap = async () => {
		map = new google.maps.Map(container, {
			zoom,
			center
		});

		if (isAdmin) {
			// Add a click listener to the map
			map.addListener('click', (e) => {
				let marker = new google.maps.Marker({
					position: e.latLng,
					map: map,
					label: `${markers.length + 1}` // Assigning the label here
				});
				// Instantiate a geocoder
				let geocoder = new google.maps.Geocoder();

				// Use the geocoder to get the address of the clicked location
				geocoder.geocode({ location: e.latLng }, function (results, status) {
					if (status === 'OK') {
						if (results[0]) {
							let address = results[0].formatted_address;

							// Store the marker, address and pinCounter in the markers array
							markers.push({
								marker: marker, // Make sure to store the marker object itself
								location: { lat: e.latLng.lat(), lng: e.latLng.lng() },
								address: address,
								pinNumber: markers.length + 1
							});

							dispatch('markers', markers);
							console.log(`Address: ${address}`);
						} else {
							window.alert('No results found');
						}
					} else {
						window.alert('Geocoder failed due to: ' + status);
					}
				});

				// Add a click listener to the marker
				marker.addListener('click', () => {
					marker.setMap(null); // remove the marker

					// Remove the marker from the array
					markers = markers.filter((m) => m.marker !== marker);

					// Reassign labels for remaining markers
					markers.forEach((m, index) => {
						m.marker.setLabel(`${index + 1}`);
					});
					dispatch('markers', markers);
				});
			});
		}

		dispatch('load', true);
		if (globally) {
			Object.assign(window, { map });
		}

		await placeMarkers();
	};

	function placeMarkers() {
		locations.forEach((location) => {
			console.log(location.location);

			let marker = new google.maps.Marker({
				position: location.location,
				map: map,
				label: `${markers.length + 1}`
			});

			// Add a click listener to the marker
			marker.addListener('click', () => {
				marker.setMap(null); // remove the marker

				// Remove the marker from the array
				markers = markers.filter((m) => m.marker !== marker);

				// Reassign labels for remaining markers
				markers.forEach((m, index) => {
					m.marker.setLabel(`${index + 1}`);
				});
				dispatch('markers', markers);
			});

			// Store the marker, address, and pinCounter in the markers array
			markers.push({
				marker: marker, // Make sure to store the marker object itself
				address: location.address,
				location: location.location,
				pinNumber: markers.length + 1
			});
		});
	}

	onMount(async () => {
		Object.assign(window, {
			mapLoaded: async function () {
				await getCurrentLocation();
			}
		});

		src = `https://maps.googleapis.com/maps/api/js?key=${PUBLIC_GOOGLE_MAPS_API_KEY}&callback=mapLoaded`;
	});
</script>

<!-- This is tailwind css class change with whatever fits to your case. -->
<div class="lg:w-1/2 w-full h-72 lg:ml-auto" bind:this={container} />
<svelte:head>
	{#if src}
		<script {src}></script>
	{/if}
</svelte:head>
