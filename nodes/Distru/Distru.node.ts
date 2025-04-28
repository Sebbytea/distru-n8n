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
		description: 'Interact with the Distru API',
		defaults: {
			name: 'Distru',
		},
		// eslint-disable-next-line n8n-nodes-base/node-class-description-inputs-wrong-regular-node
		inputs: [NodeConnectionType.Main],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
		outputs: [NodeConnectionType.Main],
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
					{ name: 'Company: Get', value: 'getCompany' },
					{ name: 'Product: Create', value: 'createProduct' },
					{ name: 'Product: Get', value: 'getProduct' },
					{ name: 'Product: Update', value: 'updateProduct' },
					{ name: 'Sales Order: Get', value: 'getOrder' },
					{ name: 'Sales Order: Upsert', value: 'upsertOrder' },
				],
				default: 'getCompany',
			},

			// -------------------- COMPANY OPERATIONS --------------------
			// Get All Companies properties
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				default: '',
				description: 'If set, only fetch the company with this ID',
				displayOptions: { show: { operation: ['getCompany'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getCompany'] } },
				options: [
					{
						displayName: 'Inserted Datetime',
						name: 'inserted_datetime',
						type: 'string',
						default: '',
						description: 'Filter companies by their creation datetime',
					},
					{
						displayName: 'Updated Datetime',
						name: 'updated_datetime',
						type: 'string',
						default: '',
						description: 'Filter companies by the datetime they were most recently modified',
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'string',
						default: '',
						description: 'Pagination information',
					},
				],
			},

			// -------------------- PRODUCT OPERATIONS --------------------
			// Get All Products properties
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				default: '',
				description: 'If set, only fetch the product with this ID',
				displayOptions: { show: { operation: ['getProduct'] } },
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getProduct'] } },
				options: [
					{
						displayName: 'Inserted Datetime',
						name: 'inserted_datetime',
						type: 'string',
						default: '',
						description: 'Filter products by their creation datetime',
					},
					{
						displayName: 'Updated Datetime',
						name: 'updated_datetime',
						type: 'string',
						default: '',
						description: 'Filter products by the datetime they were most recently modified',
					},
					{
						displayName: 'Page',
						name: 'page',
						type: 'string',
						default: '',
						description: 'Pagination information',
					},
				],
			},

			// Upsert Product properties
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				description: 'Name of the product',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'SKU',
				name: 'sku',
				type: 'string',
				default: '',
				description: 'Stock Keeping Unit',
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
				description:
					'Tracking method: PACKAGE, PRODUCT, or BATCH. Cannot be changed after set.',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Category ID',
				name: 'category_id',
				type: 'string',
				default: '',
				description: 'ID of the product category',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Subcategory ID',
				name: 'subcategory_id',
				type: 'string',
				default: '',
				description: 'ID of the product subcategory (must belong to category)',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Group ID',
				name: 'group_id',
				type: 'string',
				default: '',
				description: 'Product group ID',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Brand ID',
				name: 'brand_id',
				type: 'string',
				default: '',
				description: 'Brand (company) ID associated with this product',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Vendor ID',
				name: 'vendor_id',
				type: 'string',
				default: '',
				description: 'Vendor company ID',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Unit Price',
				name: 'unit_price',
				type: 'number',
				default: 0,
				description: 'Sale price per unit',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Unit Cost',
				name: 'unit_cost',
				type: 'number',
				default: 0,
				description: 'Cost per unit',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'MSRP',
				name: 'msrp',
				type: 'number',
				default: 0,
				description:
					'Manufacturer Suggested Retail Price; may sync to POS if integrated',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Wholesale Unit Price',
				name: 'wholesale_unit_price',
				type: 'number',
				default: 0,
				description: 'Wholesale price per unit',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'UPC',
				name: 'upc',
				type: 'string',
				default: '',
				description: 'Universal Product Code',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Units Per Case',
				name: 'units_per_case',
				type: 'number',
				default: 0,
				description: 'Number of units in a case',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Is Featured',
				name: 'is_featured',
				type: 'boolean',
				default: false,
				description: 'Whether product is featured',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Is Inactive',
				name: 'is_inactive',
				type: 'boolean',
				default: false,
				description: 'Whether product is inactive',
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
				description: 'Controls menus where product is displayed',
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
				description:
					'Menu IDs where product will be included (only if menu_visibility is INCLUDE_IN_SELECT)',
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
				description: 'Total THC content',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Total CBD',
				name: 'total_cbd',
				type: 'number',
				default: 0,
				description: 'Total CBD content',
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
				description: 'Unit of THC/CBD content',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Unit Type ID',
				name: 'unit_type_id',
				type: 'string',
				default: '',
				description: 'ID of the unit type',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Unit Net Weight',
				name: 'unit_net_weight',
				type: 'number',
				default: 0,
				description: 'Net weight per unit',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Unit Serving Size',
				name: 'unit_serving_size',
				type: 'number',
				default: 0,
				description: 'Serving size per unit',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Unit Net Weight & Serving Size Unit Type ID',
				name: 'unit_net_weight_and_serving_size_unit_type_id',
				type: 'string',
				default: '',
				description:
					'Unit type for net weight and serving size (required if unit type is count-based)',
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
				description: 'User ID who owns this product',
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
				description: 'Associated tag IDs',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},

			// -------------------- ORDER OPERATIONS --------------------
			// Get All Orders properties
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				default: '',
				description: 'If set, only fetch the order with this ID',
				displayOptions: { show: { operation: ['getOrder'] } },
			},
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
						displayName: 'Page',
						name: 'page',
						type: 'string',
						default: '',
						description: 'Pagination information',
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
				if (operation === 'getCompany') {
					const id = this.getNodeParameter('id', i, '') as string;
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, string>;
					let uri: string;
					let qs: Record<string, string> = {};
					if (id) {
						uri = `${baseUrl}/companies/${id}`;
					} else {
						uri = `${baseUrl}/companies`;
						qs = { ...additionalFields };
					}
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						qs,
						headers: { Authorization: `Bearer ${credentials.apiToken}` },
						json: true,
					});
					if (id) {
						results.push({ json: response.data });
					} else {
						const first = Array.isArray(response.data) ? response.data[0] : response.data;
						results.push({ json: first });
					}
				} else if (operation === 'getProduct') {
					const id = this.getNodeParameter('id', i, '') as string;
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, string>;
					let uri: string;
					let qs: Record<string, string> = {};
					if (id) {
						uri = `${baseUrl}/products/${id}`;
					} else {
						uri = `${baseUrl}/products`;
						qs = { ...additionalFields };
					}
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						qs,
						headers: { Authorization: `Bearer ${credentials.apiToken}` },
						json: true,
					});
					if (id) {
						results.push({ json: response.data });
					} else {
						const first = Array.isArray(response.data) ? response.data[0] : response.data;
						results.push({ json: first });
					}
				} else if (operation === 'getOrder') {
					const id = this.getNodeParameter('id', i, '') as string;
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, string>;
					let uri: string;
					let qs: Record<string, string> = {};
					if (id) {
						uri = `${baseUrl}/orders/${id}`;
					} else {
						uri = `${baseUrl}/orders`;
						qs = { ...additionalFields };
					}
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						qs,
						headers: { Authorization: `Bearer ${credentials.apiToken}` },
						json: true,
					});
					if (id) {
						results.push({ json: response.data });
					} else {
						const first = Array.isArray(response.data) ? response.data[0] : response.data;
						results.push({ json: first });
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

					const menuVisibility = body.menu_visibility;
					if (menuVisibility === 'INCLUDE_IN_SELECT') {
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

					const menuVisibility = body.menu_visibility;
					if (menuVisibility === 'INCLUDE_IN_SELECT') {
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