import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

export class Distru implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Distru',
		name: 'distru',
		icon: 'file:distru.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Distru API',
		defaults: {
			name: 'Distru',
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
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				default: 'getCompany',
				required: true,
				options: [
					{
						name: 'Create Batch',
						value: 'createBatch',
					},
					{
						name: 'Create Product',
						value: 'createProduct',
					},
					{
						name: 'Get Assembly',
						value: 'getAssembly',
					},
					{
						name: 'Get Batch',
						value: 'getBatch',
					},
					{
						name: 'Get Company',
						value: 'getCompany',
					},
					{
						name: 'Get Contact',
						value: 'getContact',
					},
					{
						name: 'Get Inventory',
						value: 'getInventory',
					},
					{
						name: 'Get Invoice',
						value: 'getInvoice',
					},
					{
						name: 'Get Location',
						value: 'getLocation',
					},
					{
						name: 'Get Order',
						value: 'getOrder',
					},
					{
						name: 'Get Package',
						value: 'getPackage',
					},
					{
						name: 'Get Payment Method',
						value: 'getPaymentMethod',
					},
					{
						name: 'Get Product',
						value: 'getProduct',
					},
					{
						name: 'Get Purchase',
						value: 'getPurchase',
					},
					{
						name: 'Get Stock Adjustment',
						value: 'getStockAdjustment',
					},
					{
						name: 'Get Strain',
						value: 'getStrain',
					},
					{
						name: 'Get User',
						value: 'getUser',
					},
					{
						name: 'Invoice Payment',
						value: 'invoicePayment',
					},
					{
						name: 'Purchase Payment',
						value: 'purchasePayment',
					},
					{
						name: 'Update Product',
						value: 'updateProduct',
					},
					{
						name: 'Upsert Invoice',
						value: 'upsertInvoice',
					},
					{
						name: 'Upsert Order',
						value: 'upsertOrder',
					},
					{
						name: 'Upsert Purchase',
						value: 'upsertPurchase',
					},
				],
			},

			// -- Additional Fields collections for each GET operation --

			// getCompany
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: { show: { operation: ['getCompany'] } },
				options: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the company to retrieve',
					},
					{
						displayName: 'Include Inactive',
						name: 'include_inactive',
						type: 'boolean',
						default: false,
						description: 'Whether to include inactive companies',
					},
				],
			},

			// getProduct
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: { show: { operation: ['getProduct'] } },
				options: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the product to retrieve',
					},
					{
						displayName: 'Include Inactive',
						name: 'include_inactive',
						type: 'boolean',
						default: false,
						description: 'Whether to include inactive products',
					},
				],
			},

			// getOrder
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: { show: { operation: ['getOrder'] } },
				options: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the order to retrieve',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'string',
						default: '',
						description: 'Filter orders by status',
					},
					{
						displayName: 'Customer ID',
						name: 'customer_id',
						type: 'string',
						default: '',
						description: 'Filter orders by customer ID',
					},
				],
			},

			// getContact
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: { show: { operation: ['getContact'] } },
				options: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the contact to retrieve',
					},
					{
						displayName: 'Include Inactive',
						name: 'include_inactive',
						type: 'boolean',
						default: false,
						description: 'Whether to include inactive contacts',
					},
					{
						displayName: 'Company ID',
						name: 'company_id',
						type: 'string',
						default: '',
						description: 'Filter contacts by company ID',
					},
				],
			},

			// getBatch
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: { show: { operation: ['getBatch'] } },
				options: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the batch to retrieve',
					},
				],
			},

			// getAssembly
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: { show: { operation: ['getAssembly'] } },
				options: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the assembly to retrieve',
					},
				],
			},

			// getInventory
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: { show: { operation: ['getInventory'] } },
				options: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the inventory to retrieve',
					},
				],
			},

			// getInvoice
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: { show: { operation: ['getInvoice'] } },
				options: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the invoice to retrieve',
					},
				],
			},

			// getLocation
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: { show: { operation: ['getLocation'] } },
				options: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the location to retrieve',
					},
				],
			},

			// getPackage
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: { show: { operation: ['getPackage'] } },
				options: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the package to retrieve',
					},
				],
			},

			// getPurchase
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: { show: { operation: ['getPurchase'] } },
				options: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the purchase to retrieve',
					},
				],
			},

			// getStockAdjustment
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: { show: { operation: ['getStockAdjustment'] } },
				options: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the stock adjustment to retrieve',
					},
				],
			},

			// getStrain
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: { show: { operation: ['getStrain'] } },
				options: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the strain to retrieve',
					},
				],
			},

			// getUser
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				typeOptions: {
					multipleValues: false,
				},
				displayOptions: { show: { operation: ['getUser'] } },
				options: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'The ID of the user to retrieve',
					},
				],
			},

			// Invoice payment parameters
			{
				displayName: 'Invoice ID',
				name: 'invoice_id',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},
			{
				displayName: 'Payment Method ID',
				name: 'payment_method_id',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},
			{
				displayName: 'Payment Datetime',
				name: 'payment_datetime',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},
			{
				displayName: 'Quickbooks Deposit Account ID',
				name: 'quickbooks_deposit_account_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},
			{
				displayName: 'Quickbooks Deposit Account Name',
				name: 'quickbooks_deposit_account_name',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},

			// Upsert invoice parameters
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertInvoice'] } },
			},
			{
				displayName: 'Due Datetime',
				name: 'due_datetime',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertInvoice'] } },
			},
			{
				displayName: 'Invoice Datetime',
				name: 'invoice_datetime',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertInvoice'] } },
			},
			{
				displayName: 'Charges',
				name: 'charges',
				type: 'json',
				default: '',
				displayOptions: { show: { operation: ['upsertInvoice'] } },
			},
			{
				displayName: 'Items',
				name: 'items',
				type: 'json',
				default: '',
				displayOptions: { show: { operation: ['upsertInvoice'] } },
			},
			{
				displayName: 'Billing Location ID',
				name: 'billing_location_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertInvoice'] } },
			},

			// Purchase payment parameters
			{
				displayName: 'Purchase ID',
				name: 'purchase_id',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},
			{
				displayName: 'Payment Method ID',
				name: 'payment_method_id',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},
			{
				displayName: 'Payment Datetime',
				name: 'payment_datetime',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},
			{
				displayName: 'Quickbooks Deposit Account ID',
				name: 'quickbooks_deposit_account_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},
			{
				displayName: 'Quickbooks Deposit Account Name',
				name: 'quickbooks_deposit_account_name',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},

			// Upsert purchase parameters
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Location ID',
				name: 'location_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Billing Location ID',
				name: 'billing_location_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Company ID',
				name: 'company_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Order Datetime',
				name: 'order_datetime',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Due Datetime',
				name: 'due_datetime',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Charges',
				name: 'charges',
				type: 'json',
				default: '',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Items',
				name: 'items',
				type: 'json',
				default: '',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},

			// Create Batch
			{
				displayName: 'Product ID',
				name: 'product_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createBatch'] } },
			},
			{
				displayName: 'Batch Number',
				name: 'batch_number',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createBatch'] } },
			},
			{
				displayName: 'Expiration Date',
				name: 'expiration_date',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createBatch'] } },
			},
			{
				displayName: 'Owner ID',
				name: 'owner_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createBatch'] } },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createBatch'] } },
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

		const getEntityOrList = async (
			endpointBase: string,
			id: string | undefined,
			query: Record<string, any>,
		): Promise<any[]> => {
			let uri: string;
			let qs = { ...query };

			if (qs.page_number !== undefined) {
				qs['page[number]'] = qs.page_number;
				delete qs.page_number;
			}
			if (qs.page_size !== undefined) {
				qs['page[size]'] = qs.page_size;
				delete qs.page_size;
			}

			try {
				if (id) {
					uri = `${baseUrl}/${endpointBase}/${id}`;
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						headers: { Authorization: `Bearer ${credentials.apiToken}` },
						json: true,
					});
					return [response.data || response];
				} else {
					uri = `${baseUrl}/${endpointBase}`;
					delete qs.id;
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						qs,
						headers: { Authorization: `Bearer ${credentials.apiToken}` },
						json: true,
					});
					if (Array.isArray(response.data)) {
						return response.data;
					}
					return [response.data || response];
				}
			} catch (error: any) {
				if (error.statusCode === 404 && id) {
					uri = `${baseUrl}/${endpointBase}`;
					delete qs.id;
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						qs,
						headers: { Authorization: `Bearer ${credentials.apiToken}` },
						json: true,
					});
					if (Array.isArray(response.data)) {
						return response.data.filter((item: any) => String(item.id) === id);
					}
					return [response.data].filter((item: any) => item && String(item.id) === id);
				}
				throw error;
			}
		};

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;

			try {
				if (
					[
						'getCompany',
						'getProduct',
						'getOrder',
						'getContact',
						'getBatch',
						'getAssembly',
						'getInventory',
						'getInvoice',
						'getLocation',
						'getPackage',
						'getPurchase',
						'getStockAdjustment',
						'getStrain',
						'getUser',
					].includes(operation)
				) {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					const id = additionalFields.id || undefined;
					const filters = { ...additionalFields };
					delete filters.id;

					const endpoint = operation.replace(/^get/, '').toLowerCase() + (operation === 'getOrder' ? 's' : '');

					const entities = await getEntityOrList(endpoint, id, filters);

					for (const entity of entities) {
						results.push({ json: entity });
					}
				} else if (operation === 'getPaymentMethod') {
					const uri = `${baseUrl}/payment/methods`;
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						headers: { Authorization: `Bearer ${credentials.apiToken}` },
						json: true,
					});
					if (Array.isArray(response.data)) {
						for (const item of response.data) {
							results.push({ json: item });
						}
					} else {
						results.push({ json: response.data });
					}
				} else if (operation === 'createProduct') {
					const body: any = {
						name: this.getNodeParameter('name', i, ''),
						sku: this.getNodeParameter('sku', i, ''),
						description: this.getNodeParameter('description', i, ''),
						inventory_tracking_method: this.getNodeParameter('inventory_tracking_method', i, 'PACKAGE'),
						category_id: this.getNodeParameter('category_id', i, ''),
						subcategory_id: this.getNodeParameter('subcategory_id', i, ''),
						group_id: this.getNodeParameter('group_id', i, ''),
						brand_id: this.getNodeParameter('brand_id', i, ''),
						vendor_id: this.getNodeParameter('vendor_id', i, ''),
						unit_price: this.getNodeParameter('unit_price', i, 0),
						unit_cost: this.getNodeParameter('unit_cost', i, 0),
						msrp: this.getNodeParameter('msrp', i, 0),
						wholesale_unit_price: this.getNodeParameter('wholesale_unit_price', i, 0),
						upc: this.getNodeParameter('upc', i, ''),
						units_per_case: this.getNodeParameter('units_per_case', i, 0),
						is_featured: this.getNodeParameter('is_featured', i, false),
						is_inactive: this.getNodeParameter('is_inactive', i, false),
						menu_visibility: this.getNodeParameter('menu_visibility', i, 'INCLUDE_IN_ALL'),
						total_thc: this.getNodeParameter('total_thc', i, 0),
						total_cbd: this.getNodeParameter('total_cbd', i, 0),
						total_cannabinoid_unit: this.getNodeParameter('total_cannabinoid_unit', i, 'PERCENT'),
						unit_type_id: this.getNodeParameter('unit_type_id', i, ''),
						unit_net_weight: this.getNodeParameter('unit_net_weight', i, 0),
						unit_serving_size: this.getNodeParameter('unit_serving_size', i, 0),
						unit_net_weight_and_serving_size_unit_type_id: this.getNodeParameter('unit_net_weight_and_serving_size_unit_type_id', i, ''),
						strain_id: this.getNodeParameter('strain_id', i, ''),
						owner_id: this.getNodeParameter('owner_id', i, ''),
					};

					const tags = this.getNodeParameter('tags', i, []) as string[];
					if (tags.length) {
						body.tags = tags;
					}

					if (body.menu_visibility === 'INCLUDE_IN_SELECT') {
						const menus = this.getNodeParameter('menus', i, []) as string[];
						body.menus = menus;
					}

					const uri = `${baseUrl}/products`;

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
				} else if (operation === 'updateProduct') {
					const id = this.getNodeParameter('id', i, '') as string;

					if (!id) {
						throw new NodeOperationError(this.getNode(), 'Product ID must be provided to update a product.');
					}

					const body: any = {
						name: this.getNodeParameter('name', i, ''),
						sku: this.getNodeParameter('sku', i, ''),
						description: this.getNodeParameter('description', i, ''),
						inventory_tracking_method: this.getNodeParameter('inventory_tracking_method', i, 'PACKAGE'),
						category_id: this.getNodeParameter('category_id', i, ''),
						subcategory_id: this.getNodeParameter('subcategory_id', i, ''),
						group_id: this.getNodeParameter('group_id', i, ''),
						brand_id: this.getNodeParameter('brand_id', i, ''),
						vendor_id: this.getNodeParameter('vendor_id', i, ''),
						unit_price: this.getNodeParameter('unit_price', i, 0),
						unit_cost: this.getNodeParameter('unit_cost', i, 0),
						msrp: this.getNodeParameter('msrp', i, 0),
						wholesale_unit_price: this.getNodeParameter('wholesale_unit_price', i, 0),
						upc: this.getNodeParameter('upc', i, ''),
						units_per_case: this.getNodeParameter('units_per_case', i, 0),
						is_featured: this.getNodeParameter('is_featured', i, false),
						is_inactive: this.getNodeParameter('is_inactive', i, false),
						menu_visibility: this.getNodeParameter('menu_visibility', i, 'INCLUDE_IN_ALL'),
						total_thc: this.getNodeParameter('total_thc', i, 0),
						total_cbd: this.getNodeParameter('total_cbd', i, 0),
						total_cannabinoid_unit: this.getNodeParameter('total_cannabinoid_unit', i, 'PERCENT'),
						unit_type_id: this.getNodeParameter('unit_type_id', i, ''),
						unit_net_weight: this.getNodeParameter('unit_net_weight', i, 0),
						unit_serving_size: this.getNodeParameter('unit_serving_size', i, 0),
						unit_net_weight_and_serving_size_unit_type_id: this.getNodeParameter('unit_net_weight_and_serving_size_unit_type_id', i, ''),
						strain_id: this.getNodeParameter('strain_id', i, ''),
						owner_id: this.getNodeParameter('owner_id', i, ''),
					};

					const tags = this.getNodeParameter('tags', i, []) as string[];
					if (tags.length) {
						body.tags = tags;
					}

					if (body.menu_visibility === 'INCLUDE_IN_SELECT') {
						const menus = this.getNodeParameter('menus', i, []) as string[];
						body.menus = menus;
					}

					const uri = `${baseUrl}/products/${id}`;

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
				} else if (operation === 'upsertOrder') {
					const companyId = this.getNodeParameter('companyId', i) as string;
					const billingLocationId = this.getNodeParameter('billingLocationId', i) as string;
					const shippingLocationId = this.getNodeParameter('shippingLocationId', i) as string;
					const dueDatetime = this.getNodeParameter('dueDatetime', i) as string;
					const deliveryDatetime = this.getNodeParameter('deliveryDatetime', i) as string;
					const blazePaymentType = this.getNodeParameter('blazePaymentType', i) as string;
					const status = this.getNodeParameter('status', i) as string;
					const internalNotes = this.getNodeParameter('internalNotes', i) as string;
					const externalNotes = this.getNodeParameter('externalNotes', i) as string;
					const itemsParameter = this.getNodeParameter('items.item', i, []) as any[];

					if (!itemsParameter.length) {
						throw new NodeOperationError(this.getNode(), 'At least one order item must be provided');
					}

					const body: any = {
						company_id: companyId,
						status,
						items: itemsParameter.map((item) => ({
							product_id: item.productId,
							quantity: item.quantity,
							price_base: item.priceBase,
							location_id: item.locationId,
						})),
					};
					if (billingLocationId) body.billing_location_id = billingLocationId;
					if (shippingLocationId) body.shipping_location_id = shippingLocationId;
					if (dueDatetime) body.due_datetime = dueDatetime;
					if (deliveryDatetime) body.delivery_datetime = deliveryDatetime;
					if (blazePaymentType) body.blaze_payment_type = blazePaymentType;
					if (internalNotes) body.internal_notes = internalNotes;
					if (externalNotes) body.external_notes = externalNotes;

					const uri = `${baseUrl}/orders`;

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
					results.push({ json: response });
				}

				// Implement similarly for other create/upsert/update/payment operations (createBatch, upsertPurchase, purchasePayment, upsertInvoice, invoicePayment) in the same style.

				else {
					throw new NodeOperationError(this.getNode(), `Operation "${operation}" not supported`);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					results.push({ json: { error: (error as Error).message } });
				} else {
					throw error;
				}
			}
		}

		return [results];
	}
}