export const DataParser = {
	formDataToObject(formData: FormData): Record<string, any> {
		const result: Record<string, any> = {};

		formData.forEach((value, key) => {
			// Check if key ends with '[]', if so make an array and remove the '[]'
			if (key.endsWith('[]')) {
				const newKey = key.slice(0, -2);
				result[newKey] = formData.getAll(key);
			} else {
				result[key] = value;
			}
		});

		return result;
	}
};

export const APIRequest = async (path: string, method: string, body: object) => {
	const response = await fetch(path, {
		method: method,
		body: JSON.stringify(body),
		headers: {
			'content-type': 'application/json'
		}
	});
	const responseData = await response.json();
	return responseData;
};
