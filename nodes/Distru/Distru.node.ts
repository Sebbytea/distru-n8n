import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeHelperFunctions,
} from 'n8n-workflow';

type EndpointMap = { [key: string]: string };

interface BaseItem {
	product_id?: string;
	quantity?: number;
	price?: number;
	location_id?: string;
	batch_id?: string;
	id?: string;
}

interface PurchaseItem extends BaseItem {
	product_id: string;
	quantity: number;
	price: number;
	location_id: string;
	batch_id: string;
	id: string;
}

interface PurchasePaymentItem extends BaseItem {
	product_id: string;
	quantity: number;
	price: number
	location_id: string;
	batch_id: string;
	id: string;
}

type Item = PurchaseItem | PurchasePaymentItem;

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
				required: true,
				default: 'getAssembly',
				options: [
					{ name: 'Create Batch', value: 'createBatch' },
					{ name: 'Create Product', value: 'createProduct' },
					{ name: 'Get Assembly', value: 'getAssembly' },
					{ name: 'Get Batch', value: 'getBatch' },
					{ name: 'Get Company', value: 'getCompany' },
					{ name: 'Get Contact', value: 'getContact' },
					{ name: 'Get Inventory', value: 'getInventory' },
					{ name: 'Get Invoice', value: 'getInvoice' },
					{ name: 'Get Location', value: 'getLocation' },
					{ name: 'Get Package', value: 'getPackage' },
					{ name: 'Get Payment Method', value: 'getPaymentMethod' },
					{ name: 'Get Product', value: 'getProduct' },
					{ name: 'Get Purchase', value: 'getPurchase' },
					{ name: 'Get Sales Order', value: 'getOrder' },
					{ name: 'Get Stock Adjustment', value: 'getStockAdjustment' },
					{ name: 'Get Strain', value: 'getStrain' },
					{ name: 'Get User', value: 'getUser' },
					{ name: 'Invoice Payment', value: 'invoicePayment' },
					{ name: 'Purchase Payment', value: 'purchasePayment' },
					{ name: 'Update Product', value: 'updateProduct' },
					{ name: 'Upsert Invoice', value: 'upsertInvoice' },
					{ name: 'Upsert Purchase', value: 'upsertPurchase' },
					{ name: 'Upsert Sales Order', value: 'upsertOrder' },
				],
			},

			// ------- GET ENDPOINTS additionalFields -----------
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getAssembly'] } },
				options: [
					{ displayName: 'ID', name: 'id', type: 'string', default: '' },
					{ displayName: 'Inserted Datetime', name: 'inserted_datetime', type: 'string', default: '' },
					{ displayName: 'Updated Datetime', name: 'updated_datetime', type: 'string', default: '' },
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1 },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 5000 },
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getBatch'] } },
				options: [
					{
						name: 'ID',
						value: 'id',
						type: 'string',
						default: '',
						description: 'Batch ID',
					},
					{
						name: 'Inserted Datetime',
						value: 'inserted_datetime',
						type: 'string',
						default: '',
					},
					{
						name: 'Page Number',
						value: 'page_number',
						type: 'number',
						default: 1,
					},
					{
						name: 'Page Size',
						value: 'page_size',
						type: 'number',
						default: 5000,
					},
					{
						name: 'Updated Datetime',
						value: 'updated_datetime',
						type: 'string',
						default: '',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getCompany'] } },
				options: [
					{ displayName: 'ID', name: 'id', type: 'string', default: '' },
					{ displayName: 'Inserted Datetime', name: 'inserted_datetime', type: 'string', default: '' },
					{ displayName: 'Updated Datetime', name: 'updated_datetime', type: 'string', default: '' },
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1 },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 5000 },
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getContact'] } },
				options: [
					{ name: 'ID', value: 'id', type: 'string', default: '', description: 'Contact ID' },
					{ name: 'Inserted Datetime', value: 'inserted_datetime', type: 'string', default: '', description: 'Filter by creation datetime' },
					{ name: 'Page Number', value: 'page_number', type: 'number', default: 1 },
					{ name: 'Page Size', value: 'page_size', type: 'number', default: 1000 },
					{ name: 'Updated Datetime', value: 'updated_datetime', type: 'string', default: '', description: 'Filter by last updated datetime' },
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getInvoice'] } },
				options: [
					{ displayName: 'ID', name: 'id', type: 'string', default: '' },
					{ displayName: 'Inserted Datetime', name: 'inserted_datetime', type: 'string', default: '' },
					{ displayName: 'Updated Datetime', name: 'updated_datetime', type: 'string', default: '' },
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1 },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 5000 },
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getInventory'] } },
				options: [
					{
						displayName: 'Grouping',
						name: 'grouping',
						type: 'multiOptions',
						options: [
							{ name: 'PRODUCT', value: 'PRODUCT' },
							{ name: 'LOCATION', value: 'LOCATION' },
							{ name: 'BATCH_NUMBER', value: 'BATCH_NUMBER' },
						],
						default: ['PRODUCT', 'LOCATION'],
						description: 'Attributes to group inventory by. PRODUCT required in list.',
					},
					{
						displayName: 'Product IDs',
						name: 'product_ids',
						type: 'string',
						typeOptions: {
							multipleValues: true,
							multipleValueButtonText: 'Add Product ID',
						},
						default: [],
						description: 'Filter by product IDs',
					},
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1 },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 5000 },
					{ displayName: 'Updated Datetime', name: 'updated_datetime', type: 'string', default: '' },
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getLocation'] } },
				options: [
					{ displayName: 'ID', name: 'id', type: 'string', default: '' },
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1 },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 1000 },
					{ displayName: 'Inserted Datetime', name: 'inserted_datetime', type: 'string', default: '' },
					{ displayName: 'Updated Datetime', name: 'updated_datetime', type: 'string', default: '' },
				],
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
						name: 'ID',
						value: 'id',
						type: 'string',
						default: '',
						description: 'Order ID',
					},
					{
						name: 'Inserted Datetime',
						value: 'inserted_datetime',
						type: 'string',
						default: '',
					},
					{
						name: 'Page Number',
						value: 'page_number',
						type: 'number',
						default: 1,
					},
					{
						name: 'Page Size',
						value: 'page_size',
						type: 'number',
						default: 500,
					},
					{
						name: 'Status',
						value: 'status',
						type: 'multiOptions',
						options: [
							{ name: 'CANCELED', value: 'CANCELED' },
							{ name: 'COMPLETED', value: 'COMPLETED' },
							{ name: 'DELIVERED', value: 'DELIVERED' },
							{ name: 'DELIVERING', value: 'DELIVERING' },
							{ name: 'PENDING', value: 'PENDING' },
							{ name: 'PROCESSING', value: 'PROCESSING' },
							{ name: 'READY_TO_SHIP', value: 'READY_TO_SHIP' },
						],
						default: [],
					},
					{
						name: 'Updated Datetime',
						value: 'updated_datetime',
						type: 'string',
						default: '',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getPackage'] } },
				options: [
					{
						name: 'ID',
						value: 'id',
						type: 'string',
						default: '',
					},
					{
						name: 'Inserted Datetime',
						value: 'inserted_datetime',
						type: 'string',
						default: '',
					},
					{
						name: 'Page Number',
						value: 'page_number',
						type: 'number',
						default: 1,
					},
					{
						name: 'Page Size',
						value: 'page_size',
						type: 'number',
						default: 500,
					},
					{
						name: 'Updated Datetime',
						value: 'updated_datetime',
						type: 'string',
						default: '',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getProduct'] } },
				options: [
					{ displayName: 'ID', name: 'id', type: 'string', default: '' },
					{ displayName: 'Inserted Datetime', name: 'inserted_datetime', type: 'string', default: '' },
					{ displayName: 'Updated Datetime', name: 'updated_datetime', type: 'string', default: '' },
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1 },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 5000 },
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getPurchase'] } },
				options: [
					{
						name: 'Company ID',
						value: 'company_id',
						type: 'string',
						default: '',
					},
					{
						name: 'ID',
						value: 'id',
						type: 'string',
						default: '',
					},
					{
						name: 'Inserted Datetime',
						value: 'inserted_datetime',
						type: 'string',
						default: '',
					},
					{
						name: 'Page Number',
						value: 'page_number',
						type: 'number',
						default: 1,
					},
					{
						name: 'Page Size',
						value: 'page_size',
						type: 'number',
						default: 5000,
					},
					{
						name: 'Updated Datetime',
						value: 'updated_datetime',
						type: 'string',
						default: '',
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getStockAdjustment'] } },
				options: [
					{ name: 'ID', value: 'id', type: 'string', default: '' },
					{ name: 'Inserted Datetime', value: 'inserted_datetime', type: 'string', default: '' },
					{ name: 'Page Number', value: 'page_number', type: 'number', default: 1 },
					{ name: 'Page Size', value: 'page_size', type: 'number', default: 5000 },
					{ name: 'Updated Datetime', value: 'updated_datetime', type: 'string', default: '' },
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getStrain'] } },
				options: [
					{ name: 'ID', value: 'id', type: 'string', default: '' },
					{ name: 'Inserted Datetime', value: 'inserted_datetime', type: 'string', default: '' },
					{ name: 'Page Number', value: 'page_number', type: 'number', default: 1 },
					{ name: 'Page Size', value: 'page_size', type: 'number', default: 5000 },
					{ name: 'Updated Datetime', value: 'updated_datetime', type: 'string', default: '' },
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getUser'] } },
				options: [
					{ name: 'ID', value: 'id', type: 'string', default: '' },
					{ name: 'Inserted Datetime', value: 'inserted_datetime', type: 'string', default: '' },
					{ name: 'Page Number', value: 'page_number', type: 'number', default: 1 },
					{ name: 'Page Size', value: 'page_size', type: 'number', default: 500 },
					{ name: 'Updated Datetime', value: 'updated_datetime', type: 'string', default: '' },
				],
			},

			// --------- CREATE/UPSERT/UPDATE ENDPOINTS -------------
			// createBatch
			{
				displayName: 'Product ID',
				name: 'product_id',
				type: 'string',
				default: '',
				required: true,
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
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['createBatch'] } },
			},
			// createProduct & updateProduct
			{
				displayName: 'Product ID',
				name: 'id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['updateProduct'] } },
				description: 'Product ID to update (update only)',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
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
				displayName: 'Units per Case',
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
					{ name: 'INCLUDE_IN_ALL', value: 'INCLUDE_IN_ALL' },
					{ name: 'INCLUDE_IN_SELECT', value: 'INCLUDE_IN_SELECT' },
					{ name: 'NONE', value: 'NONE' },
				],
				default: 'INCLUDE_IN_ALL',
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Menus',
				name: 'menus',
				type: 'string',
				typeOptions: { multipleValues: true, multipleValueButtonText: 'Add Menu' },
				default: [],
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				typeOptions: { multipleValues: true, multipleValueButtonText: 'Add Tag' },
				default: [],
				displayOptions: { show: { operation: ['createProduct', 'updateProduct'] } },
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
					{ name: 'PERCENT', value: 'PERCENT' },
					{ name: 'MG_PER_SERVING', value: 'MG_PER_SERVING' },
					{ name: 'MG_PER_CONTAINER', value: 'MG_PER_CONTAINER' },
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
				displayName: 'Unit Net Weight and Serving Size Unit Type ID',
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
			// -------- End Product Fields --------

			// upsertOrder (Upsert Sales Order)
			{
				displayName: 'Company ID',
				name: 'company_id',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { operation: ['upsertOrder'] } },
			},
			{
				displayName: 'Billing Location ID',
				name: 'billing_location_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertOrder'] } },
			},
			{
				displayName: 'Shipping Location ID',
				name: 'shipping_location_id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertOrder'] } },
			},
			{
				displayName: 'Due Datetime',
				name: 'due_datetime',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertOrder'] } },
			},
			{
				displayName: 'Delivery Datetime',
				name: 'delivery_datetime',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertOrder'] } },
			},
			{
				displayName: 'Blaze Payment Type',
				name: 'blaze_payment_type',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertOrder'] } },
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'CANCELED', value: 'CANCELED' },
					{ name: 'COMPLETED', value: 'COMPLETED' },
					{ name: 'DELIVERED', value: 'DELIVERED' },
					{ name: 'DELIVERING', value: 'DELIVERING' },
					{ name: 'PENDING', value: 'PENDING' },
					{ name: 'PROCESSING', value: 'PROCESSING' },
					{ name: 'READY_TO_SHIP', value: 'READY_TO_SHIP' },
				],
				default: 'PENDING',
				displayOptions: { show: { operation: ['upsertOrder'] } },
			},
			{
				displayName: 'Internal Notes',
				name: 'internal_notes',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertOrder'] } },
			},
			{
				displayName: 'External Notes',
				name: 'external_notes',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertOrder'] } },
			},
			{
				displayName: 'Order Items',
				name: 'items',
				type: 'fixedCollection',
				placeholder: 'Add Order Item',
				typeOptions: { multipleValues: true },
				displayOptions: { show: { operation: ['upsertOrder'] } },
				default: [],
				options: [
					{
						displayName: 'Order Item',
						name: 'item',
						values: [
							{ displayName: 'Product ID', name: 'product_id', type: 'string', default: '' },
							{ displayName: 'Quantity', name: 'quantity', type: 'number', default: 1 },
							{ displayName: 'Base Price', name: 'price_base', type: 'number', default: 0 },
							{ displayName: 'Location ID', name: 'location_id', type: 'string', default: '' },
							{ displayName: 'Batch ID', name: 'batch_id', type: 'string', default: '' },
							{ displayName: 'Package ID', name: 'package_id', type: 'string', default: '' },
						],
					},
				],
			},

			// ----------- Invoice Payment ---------
			{
				displayName: 'Invoice ID',
				name: 'invoice_id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},
			{
				displayName: 'Payment Method ID',
				name: 'payment_method_id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},
			{
				displayName: 'Payment Datetime',
				name: 'payment_datetime',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
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

			// ----------- Purchase Payment ---------
			{
				displayName: 'Purchase ID',
				name: 'purchase_id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},
			{
				displayName: 'Payment Method ID',
				name: 'payment_method_id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},
			{
				displayName: 'Payment Date',
				name: 'payment_datetime',
				type: 'string',
				default: '',
				required: true,
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
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

			// -------- Upsert Invoice ---------
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertInvoice'] } },
			},
			{
				displayName: 'Order ID',
				name: 'order_id',
				type: 'string',
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
			{
				displayName: 'Invoice Number',
				name: 'invoice_number',
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
				displayName: 'Due Datetime',
				name: 'due_datetime',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertInvoice'] } },
			},
			{
				displayName: 'Items',
				name: 'items',
				type: 'fixedCollection',
				placeholder: 'Add Item',
				typeOptions: { multipleValues: true },
				displayOptions: { show: { operation: ['upsertInvoice'] } },
				default: [],
				options: [
					{
						displayName: 'Item',
						name: 'item',
						values: [
							{ 
								displayName: 'Order Item ID',
								name: 'order_item_id', 
								type: 'string', 
								default: '', 
								description: 'Associated Order Item ID',
							},
							{ 
								displayName: 'Quantity',
								name: 'quantity', 
								type: 'number', 
								default: 0,
							},
							{ 
								displayName: 'ID',
								name: 'id', 
								type: 'string', 
								default: '', 
								description: 'Invoice Item ID if exists',
							},
						],
					},
				],
			},
			{
				displayName: 'Charges',
				name: 'charges',
				type: 'fixedCollection',
				placeholder: 'Add Charge',
				typeOptions: { multipleValues: true },
				displayOptions: { show: { operation: ['upsertInvoice'] } },
				default: [],
				options: [
					{
						displayName: 'Charge',
						name: 'charge',
						values: [
							{ displayName: 'Name', name: 'name', type: 'string', default: '' },
							{ displayName: 'Type', name: 'type', type: 'options', options: [
								{ name: 'CHARGE', value: 'CHARGE' },
								{ name: 'DISCOUNT', value: 'DISCOUNT' },
								{ name: 'TAX', value: 'TAX' }
							], default: 'CHARGE' },
							{ displayName: 'Price', name: 'price', type: 'number', default: 0, description: 'Flat Price' },
							{ displayName: 'Percentage', name: 'percentage', type: 'number', default: 0, description: 'Percentage amount' },
							{ displayName: 'Unit Type', name: 'unit_type', type: 'string', default: '', description: 'E.g. PERCENT or PRICE.' },
							{ displayName: 'ID', name: 'id', type: 'string', default: '', description: 'Charge ID if updating' },
						],
					},
				],
			},

			// ---- Upsert Purchase  ----
			{
				displayName: 'ID',
				name: 'id',
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
				displayName: 'Billing Location ID',
				name: 'billing_location_id',
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
				displayName: 'Order Datetime',
				name: 'order_datetime',
				type: 'string',
				default: '',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Items',
				name: 'items',
				type: 'fixedCollection',
				placeholder: 'Add Item',
				typeOptions: { multipleValues: true },
				displayOptions: { show: { operation: ['upsertPurchase'] } },
				default: [],
				options: [
					{
						displayName: 'Item',
						name: 'item',
						values: [
							{ displayName: 'Product ID', name: 'product_id', type: 'string', default: '' },
							{ displayName: 'Quantity', name: 'quantity', type: 'number', default: 1 },
							{ displayName: 'Price', name: 'price', type: 'number', default: 0 },
							{ displayName: 'Location ID', name: 'location_id', type: 'string', default: '' },
							{ displayName: 'Batch ID', name: 'batch_id', type: 'string', default: '' },
							{ displayName: 'ID', name: 'id', type: 'string', default: '', description: 'Purchase item ID if updating' },
						],
					},
				],
			},
			{
				displayName: 'Charges',
				name: 'charges',
				type: 'fixedCollection',
				placeholder: 'Add Charge',
				typeOptions: { multipleValues: true },
				displayOptions: { show: { operation: ['upsertPurchase'] } },
				default: [],
				options: [
					{
						displayName: 'Charge',
						name: 'charge',
						values: [
							{ displayName: 'Name', name: 'name', type: 'string', default: '' },
							{ displayName: 'Type', name: 'type', type: 'options', options: [
								{ name: 'CHARGE', value: 'CHARGE' },
								{ name: 'DISCOUNT', value: 'DISCOUNT' },
								{ name: 'TAX', value: 'TAX' }
							], default: 'CHARGE' },
							{ displayName: 'Price', name: 'price', type: 'number', default: 0, description: 'Flat Price' },
							{ displayName: 'Percentage', name: 'percentage', type: 'number', default: 0, description: 'Percentage amount' },
							{ displayName: 'Unit Type', name: 'unit_type', type: 'string', default: '', description: 'E.g. PERCENT or PRICE.' },
							{ displayName: 'ID', name: 'id', type: 'string', default: '', description: 'Charge ID if updating' },
						],
					},
				],
			},
			// ---- End Properties -----
		],
	};

	private static async getEntityOrList(
		context: IExecuteFunctions & { helpers: NodeHelperFunctions },
		baseUrl: string,
		endpoint: string,
		id: string | undefined,
		query: Record<string, any>,
		credentials: any,
	): Promise<any[]> {
		let uri: string;
		const qs: Record<string, any> = { ...query };

		// Map n8n-like pagination keys to API format
		if (qs.page_number !== undefined) {
			qs['page[number]'] = qs.page_number;
			delete qs.page_number;
		}
		if (qs.page_size !== undefined) {
			qs['page[size]'] = qs.page_size;
			delete qs.page_size;
		}

		// Endpoints that support GET by ID
		const supportsIdFetch = new Set([
			'companies',
			'products',
			'orders',
			'contacts',
			'batches',
			'assemblies',
			'invoices',
			'locations',
			'packages',
			'purchases',
			'adjustments',
			'strains',
			'users',
		]);

		try {
			if (id && supportsIdFetch.has(endpoint)) {
				uri = `${baseUrl}/${endpoint}/${id}`;
				const response = await context.helpers.request({
					method: 'GET',
					uri,
					headers: { Authorization: `Bearer ${credentials.apiToken}` },
					json: true,
				});
				return [response.data ?? response];
			}
			// No id or no direct ID fetching support -> list & filter
			uri = `${baseUrl}/${endpoint}`;
			if ('id' in qs) delete qs.id;
			const response = await context.helpers.request({
				method: 'GET',
				uri,
				qs,
				headers: { Authorization: `Bearer ${credentials.apiToken}` },
				json: true,
			});
			if (Array.isArray(response.data)) {
				if (id) {
					return response.data.filter((item: { id: string | number }) => String(item.id) === id);
				}
				return response.data;
			} else {
				return [response.data ?? response];
			}
		} catch (error: any) {
			if (error.statusCode === 404 && id) {
				// fallback to list and filter by id if single get failed
				uri = `${baseUrl}/${endpoint}`;
				if ('id' in qs) delete qs.id;
				const response = await context.helpers.request({
					method: 'GET',
					uri,
					qs,
					headers: { Authorization: `Bearer ${credentials.apiToken}` },
					json: true,
				});
				if (Array.isArray(response.data)) {
					return response.data.filter((item: { id: string | number }) => String(item.id) === id);
				}
				return [response.data].filter((item) => item?.id === id);
			}
			throw error;
		}
	}

	async execute(this: IExecuteFunctions & { helpers: NodeHelperFunctions }): Promise<INodeExecutionData[][]> {
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
					const id = (additionalFields.id?.toString() || undefined) as string | undefined;
					const filters = { ...additionalFields };
					delete filters.id;

					const endpointMap: Record<string, string> = {
						getCompany: 'companies',
						getProduct: 'products',
						getOrder: 'orders',
						getContact: 'contacts',
						getBatch: 'batches',
						getAssembly: 'assemblies',
						getInventory: 'inventory',
						getInvoice: 'invoices',
						getLocation: 'locations',
						getPackage: 'packages',
						getPurchase: 'purchases',
						getStockAdjustment: 'adjustments',
						getStrain: 'strains',
						getUser: 'users',
					};
					const endpoint = endpointMap[operation];

					const entities = await Distru.getEntityOrList(this, baseUrl, endpoint, id, filters, credentials);

					for (const entity of entities) {
						results.push({ json: entity });
					}
				} else if (operation === 'getPaymentMethod') {
					// No ID for payment methods endpoint
					const uri = `${baseUrl}/payment/methods`;
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						headers: { Authorization: `Bearer ${credentials.apiToken}` },
						json: true,
					});
					if (Array.isArray(response.data)) {
						for (const pm of response.data) {
							results.push({ json: pm });
						}
					} else {
						results.push({ json: response.data });
					}
				} else if (operation === 'createBatch') {
					const ownerId = this.getNodeParameter('owner_id', i, '') as string;
					const productId = this.getNodeParameter('product_id', i, '') as string;
					const batchNumber = this.getNodeParameter('batch_number', i, '') as string;
					const expirationDate = this.getNodeParameter('expiration_date', i, '') as string;
					const description = this.getNodeParameter('description', i, '') as string;

					const body: any = { product_id: productId };
					if (ownerId) body.owner_id = ownerId;
					if (batchNumber) body.batch_number = batchNumber;
					if (expirationDate) body.expiration_date = expirationDate;
					if (description) body.description = description;

					const uri = `${baseUrl}/batches`;
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
				} else if (operation === 'createProduct' || operation === 'updateProduct') {
					const isUpdate = operation === 'updateProduct';
					const id = isUpdate ? (this.getNodeParameter('id', i, '') as string) : undefined;
					if (isUpdate && !id) {
						throw new NodeOperationError(this.getNode(), 'Product ID is required for update operation.');
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

					const uri = isUpdate ? `${baseUrl}/products/${id}` : `${baseUrl}/products`;
					const response = await this.helpers.request({
						method: 'POST', // API uses POST for both create and update
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
					const companyId = this.getNodeParameter('company_id', i, '') as string;
					const billingLocationId = this.getNodeParameter('billing_location_id', i, '') as string;
					const shippingLocationId = this.getNodeParameter('shipping_location_id', i, '') as string;
					const dueDatetime = this.getNodeParameter('due_datetime', i, '') as string;
					const deliveryDatetime = this.getNodeParameter('delivery_datetime', i, '') as string;
					const blazePaymentType = this.getNodeParameter('blaze_payment_type', i, '') as string;
					const status = this.getNodeParameter('status', i, '') as string;
					const internalNotes = this.getNodeParameter('internal_notes', i, '') as string;
					const externalNotes = this.getNodeParameter('external_notes', i, '') as string;
					const itemsParameter = this.getNodeParameter('items', i, []) as any[];

					if (!itemsParameter.length) {
						throw new NodeOperationError(this.getNode(), 'At least one order item must be provided');
					}

					const body: any = {
						company_id: companyId,
						status,
						items: itemsParameter.map((item) => {
							const itemBody: any = {
								product_id: item.product_id,
								quantity: item.quantity,
								price_base: item.price_base,
								location_id: item.location_id,
							};
							if (item.batch_id) itemBody.batch_id = item.batch_id;
							if (item.package_id) itemBody.package_id = item.package_id;
							return itemBody;
						}),
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
				} else if (operation === 'invoicePayment') {
					const invoiceId = this.getNodeParameter('invoice_id', i, '') as string;
					const paymentMethodId = this.getNodeParameter('payment_method_id', i, '') as string;
					const amount = this.getNodeParameter('amount', i, 0) as number;
					const paymentDatetime = this.getNodeParameter('payment_datetime', i, '') as string;
					const description = this.getNodeParameter('description', i, '') as string;
					const quickbooksDepositAccountId = this.getNodeParameter('quickbooks_deposit_account_id', i, '') as string;
					const quickbooksDepositAccountName = this.getNodeParameter('quickbooks_deposit_account_name', i, '') as string;

					const uri = `${baseUrl}/invoices/${invoiceId}/payments`;

					const body: any = {
						payment_method_id: paymentMethodId,
						amount,
						payment_datetime: paymentDatetime,
						description,
					};
					if (quickbooksDepositAccountId) body.quickbooks_deposit_account_id = quickbooksDepositAccountId;
					if (quickbooksDepositAccountName) body.quickbooks_deposit_account_name = quickbooksDepositAccountName;

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
				} else if (operation === 'upsertInvoice') {
					// Upsert invoice parameters extraction and POST call (fill per your param structure)
					throw new NodeOperationError(this.getNode(), 'Upsert Invoice operation is not yet implemented');
				} else if (operation === 'purchasePayment') {
					// Purchase payment parameters extraction and POST call
					throw new NodeOperationError(this.getNode(), 'Purchase Payment operation is not yet implemented');
				} else if (operation === 'upsertPurchase') {
					const purchaseData = this.getNodeParameter('purchaseData', i) as Record<string, any>;
					const items = this.getNodeParameter('items', i) as PurchaseItem[];
					const charges = this.getNodeParameter('charges', i) as Record<string, any>[];
					
					for (const item of items) {
						// Process each item
						const itemData: PurchaseItem = {
							product_id: item.product_id,
							quantity: item.quantity,
							price: item.price,
							location_id: item.location_id,
							batch_id: item.batch_id,
							id: item.id,
						};
						// ... rest of the code ...
					}
				} else if (operation === 'upsertPurchasePayment') {
					const purchaseData = this.getNodeParameter('purchaseData', i) as Record<string, any>;
					const items = this.getNodeParameter('items', i) as PurchasePaymentItem[];
					
					for (const item of items) {
						// Process each item
						const itemData: PurchasePaymentItem = {
							product_id: item.product_id,
							quantity: item.quantity,
							price: item.price,
							location_id: item.location_id,
							batch_id: item.batch_id,
							id: item.id,
						};
						// ... rest of the code ...
					}
				} else {
					throw new NodeOperationError(this.getNode(), `Operation "${operation}" not supported`);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					results.push({
						json: {
							error: error.message,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [results];
	}
}