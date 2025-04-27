import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const results: INodeExecutionData[] = [];

	const credentials = await this.getCredentials('distruApi');
	if (!credentials?.apiToken) {
		throw new NodeOperationError(this.getNode(), 'Distru API token is not set!');
	}
	const useStaging = (credentials.useStaging ?? false) as boolean;
	const baseUrl = useStaging
		? 'https://staging.distru.com/public/v1'
		: 'https://app.distru.com/public/v1';

	for (let i = 0; i < items.length; i++) {
		const operation = this.getNodeParameter('operation', i) as string;

		try {
			if (operation === 'getAll') {
				const insertedDatetime = this.getNodeParameter('insertedDatetime', i, '') as string;
				const updatedDatetime = this.getNodeParameter('updatedDatetime', i, '') as string;

				let queryParams = new URLSearchParams();
				if (insertedDatetime) queryParams.set('inserted_datetime', insertedDatetime);
				if (updatedDatetime) queryParams.set('updated_datetime', updatedDatetime);

				let pageNumber = 1;
				const pageSize = 5000;
				let fetchedCount = 0;
				let continueFetching = true;

				while (continueFetching) {
					queryParams.set('page[number]', pageNumber.toString());
					const uri = `${baseUrl}/products?${queryParams.toString()}`;

					const response = await this.helpers.request({
						method: 'GET',
						uri,
						headers: {
							Authorization: `Bearer ${credentials.apiToken}`,
						},
						json: true,
					});

					const data = response.data ?? [];
					for (const product of data) {
						results.push({ json: product });
					}

					fetchedCount += data.length;

					if (data.length < pageSize) {
						continueFetching = false;
					} else {
						pageNumber++;
					}
				}
			} else if (operation === 'upsert') {
				const id = this.getNodeParameter('id', i, '') as string;

				const body: any = {};

				const fields = [
					'name',
					'sku',
					'description',
					'inventory_tracking_method',
					'category_id',
					'subcategory_id',
					'group_id',
					'brand_id',
					'vendor_id',
					'unit_price',
					'unit_cost',
					'msrp',
					'wholesale_unit_price',
					'upc',
					'units_per_case',
					'is_featured',
					'is_inactive',
					'menu_visibility',
					'total_thc',
					'total_cbd',
					'total_cannabinoid_unit',
					'unit_type_id',
					'unit_net_weight',
					'unit_serving_size',
					'unit_net_weight_and_serving_size_unit_type_id',
					'strain_id',
					'owner_id',
				];

				for (const field of fields) {
					const val = this.getNodeParameter(field as any, i, undefined);
					if (val !== undefined && val !== '') {
						body[field] = val;
					}
				}

				// tags: array handled separately
				const tags = this.getNodeParameter('tags', i, []) as string[];
				if (tags.length) {
					body.tags = tags;
				}

				// menus: only if menu_visibility === INCLUDE_IN_SELECT
				const menuVisibility = body.menu_visibility;
				if (menuVisibility === 'INCLUDE_IN_SELECT') {
					const menus = this.getNodeParameter('menus', i, []) as string[];
					body.menus = menus;
				}

				const uri = id
					? `${baseUrl}/products` // Distru uses POST for create AND update by id
					: `${baseUrl}/products`;

				// Include 'id' in body if exists for update
				if (id) {
					body.id = id;
				}

				const response = await this.helpers.request({
					method: 'POST',
					uri,
					headers: {
						Authorization: `Bearer ${credentials.apiToken}`,
						'Content-Type': 'application/json',
					},
					body,
					json: true,
				});

				results.push({ json: response.data ?? response });
			}
		} catch (error) {
			if (this.continueOnFail()) {
				results.push({ json: { error: error.message } });
			} else {
				throw error;
			}
		}
	}

	return this.prepareOutputData(results);
} 