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
				type: 'string',
				default: '',
				required: true,
				options: [
					{
						name: 'Get Company',
						value: 'getCompany',
					},
					{
						name: 'Get Product',
						value: 'getProduct',
					},
					{
						name: 'Get Order',
						value: 'getOrder',
					},
					{
						name: 'Get Contact',
						value: 'getContact',
					},
					{
						name: 'Get Batch',
						value: 'getBatch',
					},
					{
						name: 'Get Assembly',
						value: 'getAssembly',
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
						name: 'Get Package',
						value: 'getPackage',
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
				],
			},

			// AdditionalFields and parameters for 'getCompany' operation
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getCompany'] } },
				options: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'If set, fetch the company with this ID',
					},
					{
						displayName: 'Inserted Datetime',
						name: 'inserted_datetime',
						type: 'string',
						default: '',
						description: 'Filter companies by their creation datetime',
					},
					{
						displayName: 'Page Number',
						name: 'page_number',
						type: 'number',
						default: 1,
						description: 'Page number for pagination',
					},
					{
						displayName: 'Page Size',
						name: 'page_size',
						type: 'number',
						default: 5000,
						description: 'Number of records per page (max 5000)',
					},
					{
						displayName: 'Updated Datetime',
						name: 'updated_datetime',
						type: 'string',
						default: '',
						description: 'Filter companies by the datetime they were most recently modified',
					},
				],
			},

			// AdditionalFields and parameters for getProduct operation
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getProduct'] } },
				options: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'If set, fetch the product with this ID',
					},
					{
						displayName: 'Inserted Datetime',
						name: 'inserted_datetime',
						type: 'string',
						default: '',
						description: 'Filter products by their creation datetime',
					},
					{
						displayName: 'Page Number',
						name: 'page_number',
						type: 'number',
						default: 1,
						description: 'Page number for pagination',
					},
					{
						displayName: 'Page Size',
						name: 'page_size',
						type: 'number',
						default: 5000,
						description: 'Number of records per page (max 5000)',
					},
					{
						displayName: 'Updated Datetime',
						name: 'updated_datetime',
						type: 'string',
						default: '',
						description: 'Filter products by the datetime they were most recently modified',
					},
				],
			},

			// Product creation and update parameters (simplified for brevity)
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'SKU',
				name: 'sku',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Inventory Tracking Method',
				name: 'inventory_tracking_method',
				type: 'options',
				options: [
					{ name: 'PACKAGE', value: 'PACKAGE' },
					{ name: 'PRODUCT', value: 'PRODUCT' },
					{ name: 'BATCH', value: 'BATCH' },
				],
				default: 'PACKAGE',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Category ID',
				name: 'category_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Subcategory ID',
				name: 'subcategory_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Group ID',
				name: 'group_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Brand ID',
				name: 'brand_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Vendor ID',
				name: 'vendor_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Unit Price',
				name: 'unit_price',
				type: 'number',
				default: 0,
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Unit Cost',
				name: 'unit_cost',
				type: 'number',
				default: 0,
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'MSRP',
				name: 'msrp',
				type: 'number',
				default: 0,
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Wholesale Unit Price',
				name: 'wholesale_unit_price',
				type: 'number',
				default: 0,
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'UPC',
				name: 'upc',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Units Per Case',
				name: 'units_per_case',
				type: 'number',
				default: 0,
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Is Featured',
				name: 'is_featured',
				type: 'boolean',
				default: false,
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Is Inactive',
				name: 'is_inactive',
				type: 'boolean',
				default: false,
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Menu Visibility',
				name: 'menu_visibility',
				type: 'options',
				options: [
					{ name: 'DO_NOT_INCLUDE', value: 'DO_NOT_INCLUDE' },
					{ name: 'INCLUDE_IN_ALL', value: 'INCLUDE_IN_ALL' },
					{ name: 'INCLUDE_IN_SELECT', value: 'INCLUDE_IN_SELECT' },
				],
				default: 'INCLUDE_IN_ALL',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Menus (if INCLUDE_IN_SELECT)',
				name: 'menus',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				placeholder: 'Enter menu IDs',
				displayOptions: {
					show: {
						operation: ['createProduct', 'updateProduct'],
						menu_visibility: ['INCLUDE_IN_SELECT'],
					},
				},
			},
			{
				displayName: 'Total THC',
				name: 'total_thc',
				type: 'number',
				default: 0,
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Total CBD',
				name: 'total_cbd',
				type: 'number',
				default: 0,
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Total Cannabinoid Unit',
				name: 'total_cannabinoid_unit',
				type: 'options',
				options: [
					{ name: 'MG', value: 'MG' },
					{ name: 'PERCENT', value: 'PERCENT' },
				],
				default: 'PERCENT',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Unit Type ID',
				name: 'unit_type_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Unit Net Weight',
				name: 'unit_net_weight',
				type: 'number',
				default: 0,
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Unit Serving Size',
				name: 'unit_serving_size',
				type: 'number',
				default: 0,
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Unit Net Weight & Serving Size Unit Type ID',
				name: 'unit_net_weight_and_serving_size_unit_type_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Strain ID',
				name: 'strain_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Owner ID',
				name: 'owner_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				placeholder: 'Enter tag IDs',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},

			// AdditionalFields and parameters for getOrder operation
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getOrder'] } },
				options: [
					{
						displayName: 'Delivery Datetime',
						name: 'delivery_datetime',
						type: 'string',
						default: '',
						description: 'Filter orders by the delivery datetime',
					},
					{
						displayName: 'Due Datetime',
						name: 'due_datetime',
						type: 'string',
						default: '',
						description: 'Filter orders by the due datetime',
					},
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						default: '',
						description: 'If set, fetch the order with this ID',
					},
					{
						displayName: 'Inserted Datetime',
						name: 'inserted_datetime',
						type: 'string',
						default: '',
						description: 'Filter orders by their creation datetime',
					},
					{
						displayName: 'Order Datetime',
						name: 'order_datetime',
						type: 'string',
						default: '',
						description: 'Filter orders by the order datetime',
					},
					{
						displayName: 'Page Number',
						name: 'page_number',
						type: 'number',
						default: 1,
						description: 'Page number for pagination',
					},
					{
						displayName: 'Page Size',
						name: 'page_size',
						type: 'number',
						default: 500,
						description: 'Number of records per page (max 500)',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'string',
						default: '',
						description: 'Filter orders by their status',
					},
					{
						displayName: 'Updated Datetime',
						name: 'updated_datetime',
						type: 'string',
						default: '',
						description: 'Filter orders by the datetime they were most recently modified',
					},
				],
			},

			// More AdditionalFields collectors for other GET operations: getAssembly, getBatch, getContact, getInventory, getInvoice, getLocation, getPackage, getPurchase, getStockAdjustment, getStrain, getUser (strings omitted here for brevity, they follow similarly)...

			// Create / Update / Upsert and Payment operation parameters similarly defined as you had in your original code 
			// For brevity, these are omitted in this snippet, but you should include ALL as in your original code.
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
		const baseUrl = useStaging ? 'https://staging.distru.com/public/v1' : 'https://app.distru.com/public/v1';

		// Helper function to get an entity by ID or list entities filtered by query params
		const getEntityOrList = async (
			endpointBase: string,
			id: string | undefined,
			query: Record<string, any>,
		): Promise<any[]> => {
			let uri: string;
			let qs = { ...query };

			// Map pagination parameters
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
					// Fallback to listing and filtering by id
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
				// -------------- Operations with ID support using getEntityOrList helper --------------

				if (operation === 'getCompany') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					const id = additionalFields.id || undefined;
					const filters = { ...additionalFields };
					delete filters.id;

					const companies = await getEntityOrList('companies', id, filters);

					for (const company of companies) {
						results.push({ json: company });
					}
				} else if (operation === 'getProduct') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					const id = additionalFields.id || undefined;
					const filters = { ...additionalFields };
					delete filters.id;

					const products = await getEntityOrList('products', id, filters);

					for (const product of products) {
						results.push({ json: product });
					}
				} else if (operation === 'getOrder') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					const id = additionalFields.id || undefined;
					const filters = { ...additionalFields };
					delete filters.id;

					const orders = await getEntityOrList('orders', id, filters);

					for (const order of orders) {
						results.push({ json: order });
					}
				} else if (operation === 'getContact') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					const id = additionalFields.id || undefined;
					const filters = { ...additionalFields };
					delete filters.id;

					const contacts = await getEntityOrList('contacts', id, filters);

					for (const contact of contacts) {
						results.push({ json: contact });
					}
				} else if (operation === 'getBatch') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					const id = additionalFields.id || undefined;
					const filters = { ...additionalFields };
					delete filters.id;

					const batches = await getEntityOrList('batches', id, filters);

					for (const batch of batches) {
						results.push({ json: batch });
					}
				} else if (operation === 'getAssembly') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					const id = additionalFields.id || undefined;
					const filters = { ...additionalFields };
					delete filters.id;

					const assemblies = await getEntityOrList('assemblies', id, filters);

					for (const assembly of assemblies) {
						results.push({ json: assembly });
					}
				} else if (operation === 'getInventory') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					const id = additionalFields.id || undefined;
					const filters = { ...additionalFields };
					delete filters.id;

					const inventories = await getEntityOrList('inventory', id, filters);

					for (const inventory of inventories) {
						results.push({ json: inventory });
					}
				} else if (operation === 'getInvoice') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					const id = additionalFields.id || undefined;
					const filters = { ...additionalFields };
					delete filters.id;

					const invoices = await getEntityOrList('invoices', id, filters);

					for (const invoice of invoices) {
						results.push({ json: invoice });
					}
				} else if (operation === 'getLocation') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					const id = additionalFields.id || undefined;
					const filters = { ...additionalFields };
					delete filters.id;

					const locations = await getEntityOrList('locations', id, filters);

					for (const location of locations) {
						results.push({ json: location });
					}
				} else if (operation === 'getPackage') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					const id = additionalFields.id || undefined;
					const filters = { ...additionalFields };
					delete filters.id;

					const packages = await getEntityOrList('packages', id, filters);

					for (const pkg of packages) {
						results.push({ json: pkg });
					}
				} else if (operation === 'getPurchase') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					const id = additionalFields.id || undefined;
					const filters = { ...additionalFields };
					delete filters.id;

					const purchases = await getEntityOrList('purchases', id, filters);

					for (const purchase of purchases) {
						results.push({ json: purchase });
					}
				} else if (operation === 'getStockAdjustment') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					const id = additionalFields.id || undefined;
					const filters = { ...additionalFields };
					delete filters.id;

					const adjustments = await getEntityOrList('adjustments', id, filters);

					for (const adjustment of adjustments) {
						results.push({ json: adjustment });
					}
				} else if (operation === 'getStrain') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					const id = additionalFields.id || undefined;
					const filters = { ...additionalFields };
					delete filters.id;

					const strains = await getEntityOrList('strains', id, filters);

					for (const strain of strains) {
						results.push({ json: strain });
					}
				} else if (operation === 'getUser') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					const id = additionalFields.id || undefined;
					const filters = { ...additionalFields };
					delete filters.id;

					const users = await getEntityOrList('users', id, filters);

					for (const user of users) {
						results.push({ json: user });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					results.push({ json: { error: error.message } });
					continue;
				}
				throw error;
			}
		}

		return [results];
	}
}