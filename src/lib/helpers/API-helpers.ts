const DataParser = {
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

export default DataParser;
