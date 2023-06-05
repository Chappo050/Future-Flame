import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';

type Note = {
	id: string;
	title: string;
	selected: string;
	content: string;
	tags: string[];
};

export const noteStore: Writable<Note[]> = localStorageStore('notes', []);
