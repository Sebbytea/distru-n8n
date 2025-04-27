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
					const uri = `${baseUrl}/companies?${queryParams.toString()}`;

					const response = await this.helpers.request({
						method: 'GET',
						uri,
						headers: {
							Authorization: `Bearer ${credentials.apiToken}`,
						},
						json: true,
					});

					const data = response.data ?? [];
					for (const company of data) {
						results.push({ json: company });
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
					'category',
					'default_email',
					'invoice_email',
					'purchase_order_email',
					'sales_order_email',
					'order_shipment_email',
					'legal_business_name',
					'outstanding_balance_threshold',
					'owner_id',
					'phone_number',
					'website',
					'default_sales_order_notes',
					'default_purchase_order_notes',
					'relationship_type_id',
				];

				for (const field of fields) {
					const val = this.getNodeParameter(field as any, i, undefined);
					if (val !== undefined && val !== '') {
						body[field] = val;
					}
				}

				// Custom data as JSON string -> parse to send as array
				const customDataStr = this.getNodeParameter('custom_data', i, '') as string;
				if (customDataStr) {
					try {
						body.custom_data = JSON.parse(customDataStr);
					} catch {
						throw new NodeOperationError(
							this.getNode(),
							'Custom Data must be a valid JSON array',
						);
					}
				}

				const uri = id
					? `${baseUrl}/companies`
					: `${baseUrl}/companies`;

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