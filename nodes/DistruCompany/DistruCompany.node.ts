import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class DistruCompany implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Distru Company',
		name: 'distruCompany',
		icon: 'file:distru-vertical-bright-green.svg',
		group: ['input', 'output'],
		version: 1,
		description: 'Get, create or update companies in Distru',
		defaults: {
			name: 'Distru Company',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'distruApi',
				required: true,
			},
		],
		properties: [
			// Operation selector
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Get Many', value: 'getAll' },
					{ name: 'Create or Update', value: 'upsert' },
				],
				default: 'getAll',
			},

			// ------------ GET ALL properties -------------
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: { show: { operation: ['getAll'] } },
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Max number of results to return',
				typeOptions: { minValue: 1 },
				displayOptions: {
					show: {
						operation: ['getAll'],
						returnAll: [false],
					},
				},
			},
			{
				displayName: 'Inserted After',
				name: 'insertedDatetime',
				type: 'dateTime',
				default: '',
				description: 'Filter companies inserted after this datetime',
				displayOptions: { show: { operation: ['getAll'] } },
			},
			{
				displayName: 'Updated After',
				name: 'updatedDatetime',
				type: 'dateTime',
				default: '',
				description: 'Filter companies updated after this datetime',
				displayOptions: { show: { operation: ['getAll'] } },
			},

			// ------------ UPSERT (create/update) properties -------------
			{
				displayName: 'Company ID',
				name: 'id',
				type: 'string',
				default: '',
				description:
					"If set, updates the company with this ID. Otherwise, creates a new company.",
				displayOptions: { show: { operation: ['upsert'] } },
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				description: 'Legal business name',
				displayOptions: { show: { operation: ['upsert'] } },
			},
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
				description: 'Category of company e.g. Retailer',
				displayOptions: { show: { operation: ['upsert'] } },
			},
			{
				displayName: 'Default Email',
				name: 'default_email',
				type: 'string',
				default: '',
				description: 'Default email for the company',
				displayOptions: { show: { operation: ['upsert'] } },
			},
			{
				displayName: 'Invoice Email',
				name: 'invoice_email',
				type: 'string',
				default: '',
				description: 'Email where invoices are delivered',
				displayOptions: { show: { operation: ['upsert'] } },
			},
			{
				displayName: 'Purchase Order Email',
				name: 'purchase_order_email',
				type: 'string',
				default: '',
				description: 'Email where purchase order slips are delivered',
				displayOptions: { show: { operation: ['upsert'] } },
			},
			{
				displayName: 'Sales Order Email',
				name: 'sales_order_email',
				type: 'string',
				default: '',
				description: 'Email where sales order slips are delivered',
				displayOptions: { show: { operation: ['upsert'] } },
			},
			{
				displayName: 'Order Shipment Email',
				name: 'order_shipment_email',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsert'] } },
			},
			{
				displayName: 'Legal Business Name',
				name: 'legal_business_name',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsert'] } },
			},
			{
				displayName: 'Outstanding Balance Threshold',
				name: 'outstanding_balance_threshold',
				type: 'number',
				default: 0,
				description:
					'Threshold warning when exceeded',
				displayOptions: { show: { operation: ['upsert'] } },
			},
			{
				displayName: 'Owner ID',
				name: 'owner_id',
				type: 'string',
				default: '',
				description: 'ID of the user who owns this company',
				displayOptions: { show: { operation: ['upsert'] } },
			},
			{
				displayName: 'Phone Number',
				name: 'phone_number',
				type: 'string',
				default: '',
				description: 'Phone number for the company',
				displayOptions: { show: { operation: ['upsert'] } },
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				description: 'Website URL',
				displayOptions: { show: { operation: ['upsert'] } },
			},
			{
				displayName: 'Default Sales Order Notes',
				name: 'default_sales_order_notes',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsert'] } },
			},
			{
				displayName: 'Default Purchase Order Notes',
				name: 'default_purchase_order_notes',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsert'] } },
			},
			{
				displayName: 'Relationship Type ID',
				name: 'relationship_type_id',
				type: 'string',
				default: '',
				description: 'ID of the relationship type',
				displayOptions: { show: { operation: ['upsert'] } },
			},
			{
				displayName: 'Custom Data',
				name: 'custom_data',
				type: 'json',
				default: '',
				description:
					'Custom data as a JSON array of objects with id, name, value',
				displayOptions: { show: { operation: ['upsert'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
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
					const returnAll = this.getNodeParameter('returnAll', i) as boolean;
					const limit = this.getNodeParameter('limit', i) as number;
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

						if (!returnAll && fetchedCount >= limit) {
							continueFetching = false;
						} else if (data.length < pageSize) {
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
}