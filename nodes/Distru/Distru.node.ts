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
					{ name: 'Create or Update Company', value: 'upsertCompany' },
					{ name: 'Create or Update Product', value: 'upsertProduct' },
					{ name: 'Create Order', value: 'createOrder' },
					{ name: 'Get Many Companies', value: 'getAllCompanies' },
					{ name: 'Get Many Orders', value: 'getAllOrders' },
					{ name: 'Get Many Products', value: 'getAllProducts' },
					{ name: 'Get Order By ID', value: 'getOrderById' },
				],
				default: 'getAllCompanies',
			},

			// -------------------- COMPANY OPERATIONS --------------------
			// Get All Companies properties
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: { show: { operation: ['getAllCompanies'] } },
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
						operation: ['getAllCompanies'],
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
				displayOptions: { show: { operation: ['getAllCompanies'] } },
			},
			{
				displayName: 'Updated After',
				name: 'updatedDatetime',
				type: 'dateTime',
				default: '',
				description: 'Filter companies updated after this datetime',
				displayOptions: { show: { operation: ['getAllCompanies'] } },
			},

			// Upsert Company properties
			{
				displayName: 'Company ID',
				name: 'id',
				type: 'string',
				default: '',
				description:
					'If set, updates the company with this ID. Otherwise, creates a new company.',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				description: 'Legal business name',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},
			{
				displayName: 'Category',
				name: 'category',
				type: 'string',
				default: '',
				description: 'Category of company e.g. Retailer',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},
			{
				displayName: 'Default Email',
				name: 'default_email',
				type: 'string',
				default: '',
				description: 'Default email for the company',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},
			{
				displayName: 'Invoice Email',
				name: 'invoice_email',
				type: 'string',
				default: '',
				description: 'Email where invoices are delivered',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},
			{
				displayName: 'Purchase Order Email',
				name: 'purchase_order_email',
				type: 'string',
				default: '',
				description: 'Email where purchase order slips are delivered',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},
			{
				displayName: 'Sales Order Email',
				name: 'sales_order_email',
				type: 'string',
				default: '',
				description: 'Email where sales order slips are delivered',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},
			{
				displayName: 'Order Shipment Email',
				name: 'order_shipment_email',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},
			{
				displayName: 'Legal Business Name',
				name: 'legal_business_name',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},
			{
				displayName: 'Outstanding Balance Threshold',
				name: 'outstanding_balance_threshold',
				type: 'number',
				default: 0,
				description: 'Threshold warning when exceeded',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},
			{
				displayName: 'Owner ID',
				name: 'owner_id',
				type: 'string',
				default: '',
				description: 'ID of the user who owns this company',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},
			{
				displayName: 'Phone Number',
				name: 'phone_number',
				type: 'string',
				default: '',
				description: 'Phone number for the company',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				description: 'Website URL',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},
			{
				displayName: 'Default Sales Order Notes',
				name: 'default_sales_order_notes',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},
			{
				displayName: 'Default Purchase Order Notes',
				name: 'default_purchase_order_notes',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},
			{
				displayName: 'Relationship Type ID',
				name: 'relationship_type_id',
				type: 'string',
				default: '',
				description: 'ID of the relationship type',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},
			{
				displayName: 'Custom Data',
				name: 'custom_data',
				type: 'json',
				default: '',
				description: 'Custom data as a JSON array of objects with ID, name, value',
				displayOptions: { show: { operation: ['upsertCompany'] } },
			},

			// -------------------- PRODUCT OPERATIONS --------------------
			// Get All Products properties
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: { show: { operation: ['getAllProducts'] } },
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
						operation: ['getAllProducts'],
						returnAll: [false],
					},
				},
			},
			{
				displayName: 'Inserted After',
				name: 'insertedDatetime',
				type: 'dateTime',
				default: '',
				description: 'Filter products inserted after this datetime',
				displayOptions: { show: { operation: ['getAllProducts'] } },
			},
			{
				displayName: 'Updated After',
				name: 'updatedDatetime',
				type: 'dateTime',
				default: '',
				description: 'Filter products updated after this datetime',
				displayOptions: { show: { operation: ['getAllProducts'] } },
			},

			// Upsert Product properties
			{
				displayName: 'Product ID',
				name: 'id',
				type: 'string',
				default: '',
				description:
					'If set, updates the product with this ID. Otherwise, creates a new product.',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				description: 'Name of the product',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'SKU',
				name: 'sku',
				type: 'string',
				default: '',
				description: 'Stock Keeping Unit',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertProduct'] } },
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
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Category ID',
				name: 'category_id',
				type: 'string',
				default: '',
				description: 'ID of the product category',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Subcategory ID',
				name: 'subcategory_id',
				type: 'string',
				default: '',
				description: 'ID of the product subcategory (must belong to category)',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Group ID',
				name: 'group_id',
				type: 'string',
				default: '',
				description: 'Product group ID',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Brand ID',
				name: 'brand_id',
				type: 'string',
				default: '',
				description: 'Brand (company) ID associated with this product',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Vendor ID',
				name: 'vendor_id',
				type: 'string',
				default: '',
				description: 'Vendor company ID',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Unit Price',
				name: 'unit_price',
				type: 'number',
				default: 0,
				description: 'Sale price per unit',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Unit Cost',
				name: 'unit_cost',
				type: 'number',
				default: 0,
				description: 'Cost per unit',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'MSRP',
				name: 'msrp',
				type: 'number',
				default: 0,
				description:
					'Manufacturer Suggested Retail Price; may sync to POS if integrated',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Wholesale Unit Price',
				name: 'wholesale_unit_price',
				type: 'number',
				default: 0,
				description: 'Wholesale price per unit',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'UPC',
				name: 'upc',
				type: 'string',
				default: '',
				description: 'Universal Product Code',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Units Per Case',
				name: 'units_per_case',
				type: 'number',
				default: 0,
				description: 'Number of units in a case',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Is Featured',
				name: 'is_featured',
				type: 'boolean',
				default: false,
				description: 'Whether product is featured',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Is Inactive',
				name: 'is_inactive',
				type: 'boolean',
				default: false,
				description: 'Whether product is inactive',
				displayOptions: { show: { operation: ['upsertProduct'] } },
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
				displayOptions: { show: { operation: ['upsertProduct'] } },
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
						operation: ['upsertProduct'],
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
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Total CBD',
				name: 'total_cbd',
				type: 'number',
				default: 0,
				description: 'Total CBD content',
				displayOptions: { show: { operation: ['upsertProduct'] } },
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
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Unit Type ID',
				name: 'unit_type_id',
				type: 'string',
				default: '',
				description: 'ID of the unit type',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Unit Net Weight',
				name: 'unit_net_weight',
				type: 'number',
				default: 0,
				description: 'Net weight per unit',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Unit Serving Size',
				name: 'unit_serving_size',
				type: 'number',
				default: 0,
				description: 'Serving size per unit',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Unit Net Weight & Serving Size Unit Type ID',
				name: 'unit_net_weight_and_serving_size_unit_type_id',
				type: 'string',
				default: '',
				description:
					'Unit type for net weight and serving size (required if unit type is count-based)',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Strain ID',
				name: 'strain_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},
			{
				displayName: 'Owner ID',
				name: 'owner_id',
				type: 'string',
				default: '',
				description: 'User ID who owns this product',
				displayOptions: { show: { operation: ['upsertProduct'] } },
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
				displayOptions: { show: { operation: ['upsertProduct'] } },
			},

			// -------------------- ORDER OPERATIONS --------------------
			// Get All Orders properties
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				description: 'Whether to return all results or only up to a given limit',
				displayOptions: { show: { operation: ['getAllOrders'] } },
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
						operation: ['getAllOrders'],
						returnAll: [false],
					},
				},
			},

			// Get Order By ID properties
			{
				displayName: 'Order ID',
				name: 'orderId',
				type: 'string',
				default: '',
				required: true,
				description: 'ID of the order to retrieve',
				displayOptions: { show: { operation: ['getOrderById'] } },
			},

			// Create Order properties
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				default: '',
				required: true,
				description: 'Company ID associated with the sales order',
				displayOptions: { show: { operation: ['createOrder'] } },
			},
			{
				displayName: 'Billing Location ID',
				name: 'billingLocationId',
				type: 'string',
				default: '',
				description: 'ID of the billing location',
				displayOptions: { show: { operation: ['createOrder'] } },
			},
			{
				displayName: 'Shipping Location ID',
				name: 'shippingLocationId',
				type: 'string',
				default: '',
				description: 'ID of the shipping location',
				displayOptions: { show: { operation: ['createOrder'] } },
			},
			{
				displayName: 'Due Date',
				name: 'dueDatetime',
				type: 'dateTime',
				default: '',
				description: 'When the order is due',
				displayOptions: { show: { operation: ['createOrder'] } },
			},
			{
				displayName: 'Delivery Date',
				name: 'deliveryDatetime',
				type: 'dateTime',
				default: '',
				description: 'When the order will be delivered',
				displayOptions: { show: { operation: ['createOrder'] } },
			},
			{
				displayName: 'Blaze Payment Type',
				name: 'blazePaymentType',
				type: 'options',
				options: [
					{ name: 'Cash', value: 'CASH' },
					{ name: 'Credit Card', value: 'CREDIT_CARD' },
					{ name: 'Check', value: 'CHECK' },
					{ name: 'Other', value: 'OTHER' },
				],
				default: 'CASH',
				description: 'Required for Blaze retailers',
				displayOptions: { show: { operation: ['createOrder'] } },
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Canceled', value: 'CANCELED' },
					{ name: 'Completed', value: 'COMPLETED' },
					{ name: 'Delivered', value: 'DELIVERED' },
					{ name: 'Delivering', value: 'DELIVERING' },
					{ name: 'Pending', value: 'PENDING' },
					{ name: 'Processing', value: 'PROCESSING' },
					{ name: 'Ready To Ship', value: 'READY_TO_SHIP' },
				],
				default: 'PENDING',
				description: 'Order status',
				displayOptions: { show: { operation: ['createOrder'] } },
			},
			{
				displayName: 'Internal Notes',
				name: 'internalNotes',
				type: 'string',
				default: '',
				description: 'Internal notes for the order',
				displayOptions: { show: { operation: ['createOrder'] } },
			},
			{
				displayName: 'External Notes',
				name: 'externalNotes',
				type: 'string',
				default: '',
				description: 'External notes visible to the customer',
				displayOptions: { show: { operation: ['createOrder'] } },
			},
			{
				displayName: 'Order Items',
				name: 'items',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add Order Item',
				description: 'Items in the sales order',
				displayOptions: { show: { operation: ['createOrder'] } },
				options: [
					{
						displayName: 'Item',
						name: 'item',
						values: [
							{
								displayName: 'Product ID',
								name: 'productId',
								type: 'string',
								default: '',
								required: true,
								description: 'ID of the product',
							},
							{
								displayName: 'Quantity',
								name: 'quantity',
								type: 'number',
								default: 1,
								required: true,
								description: 'Quantity of product',
							},
							{
								displayName: 'Price Base',
								name: 'priceBase',
								type: 'number',
								default: 0,
								description: 'Base price for the item',
							},
							{
								displayName: 'Location ID',
								name: 'locationId',
								type: 'string',
								default: '',
								description: 'Location ID for this item',
							},
						],
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
				if (operation === 'getAllCompanies') {
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
				} else if (operation === 'upsertCompany') {
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
				} else if (operation === 'getAllProducts') {
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

						if (!returnAll && fetchedCount >= limit) {
							continueFetching = false;
						} else if (data.length < pageSize) {
							continueFetching = false;
						} else {
							pageNumber++;
						}
					}
				} else if (operation === 'upsertProduct') {
					const id = this.getNodeParameter('id', i, '') as string;

					const body: any = {};

					// Map all upsert fields if set
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
				} else if (operation === 'getAllOrders') {
					const returnAll = this.getNodeParameter('returnAll', i) as boolean;
					const limit = this.getNodeParameter('limit', i) as number;

					let uri = `${baseUrl}/orders`;

					// If not returnAll, can add limit param (if Distru supports)
					// Distru API docs don't explicitly mention limit param, so get all or paginated accordingly.
					// Implement simple fetch and limit locally:
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						headers: {
							Authorization: `Bearer ${credentials.apiToken}`,
						},
						json: true,
					});
					let data = response.data;

					if (!returnAll) {
						data = data.slice(0, limit);
					}
					for (const order of data) {
						results.push({ json: order });
					}
				} else if (operation === 'getOrderById') {
					const orderId = this.getNodeParameter('orderId', i) as string;
					if (!orderId) {
						throw new NodeOperationError(this.getNode(), 'Order ID is required');
					}

					const response = await this.helpers.request({
						method: 'GET',
						uri: `${baseUrl}/orders/${orderId}`,
						headers: {
							Authorization: `Bearer ${credentials.apiToken}`,
						},
						json: true,
					});
					results.push({ json: response.data });
				} else if (operation === 'createOrder') {
					// Gather create parameters
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

					// POST request
					const response = await this.helpers.request({
						method: 'POST',
						uri: `${baseUrl}/orders`,
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