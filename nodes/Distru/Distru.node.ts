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
					{ name: 'Assembly: Get', value: 'getAssembly' },
					{ name: 'Batch: Create', value: 'createBatch' },
					{ name: 'Batch: Get', value: 'getBatch' },
					{ name: 'Company: Get', value: 'getCompany' },
					{ name: 'Contact: Get', value: 'getContact' },
					{ name: 'Inventory: Get', value: 'getInventory' },
					{ name: 'Invoice: Get', value: 'getInvoice' },
					{ name: 'Invoice: Upsert', value: 'upsertInvoice' },
					{ name: 'Invoice: Payment', value: 'invoicePayment' },
					{ name: 'Location: Get', value: 'getLocation' },
					{ name: 'Package: Get', value: 'getPackage' },
					{ name: 'Payment Method: Get', value: 'getPaymentMethod' },
					{ name: 'Product: Create', value: 'createProduct' },
					{ name: 'Product: Get', value: 'getProduct' },
					{ name: 'Product: Update', value: 'updateProduct' },
					{ name: 'Purchase: Get', value: 'getPurchase' },
					{ name: 'Purchase: Upsert', value: 'upsertPurchase' },
					{ name: 'Purchase: Payment', value: 'purchasePayment' },
					{ name: 'Sales Order: Get', value: 'getOrder' },
					{ name: 'Sales Order: Upsert', value: 'upsertOrder' },
					{ name: 'Stock Adjustment: Get', value: 'getStockAdjustment' },
					{ name: 'Strain: Get', value: 'getStrain' },
					{ name: 'User: Get', value: 'getUser' },
				],
				default: 'getCompany',
			},

			// -------------------- COMPANY OPERATIONS --------------------
			// Get All Companies properties
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

			// -------------------- PRODUCT OPERATIONS --------------------
			// Get All Products properties
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

			// -------------------- ASSEMBLY OPERATIONS --------------------
			// Get All Assemblies properties
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getAssembly'] } },
				options: [
					{ displayName: 'Completion Datetime', name: 'completion_datetime', type: 'string', default: '', description: 'Filter assemblies by their completion datetime' },
					{ displayName: 'Creation Source', name: 'creation_source', type: 'string', default: '', description: 'Filter assemblies by their creation source. Options: MANUALLY_CREATED, SPLIT_PACKAGE, SALES_ORDER, LAB_TESTING' },
					{ displayName: 'License Number', name: 'license_number', type: 'string', default: '', description: 'Filter assemblies by their license number' },
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1, description: 'Page number for pagination' },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 500, description: 'Number of records per page (max 500)' },
				],
			},

			// -------------------- BATCH OPERATIONS --------------------
			// Get All Batches properties
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getBatch'] } },
				options: [
					{ displayName: 'Inserted Datetime', name: 'inserted_datetime', type: 'string', default: '', description: 'Filter batches by their creation datetime' },
					{ displayName: 'Updated Datetime', name: 'updated_datetime', type: 'string', default: '', description: 'Filter batches by the datetime they were most recently modified' },
					{ displayName: 'Batch Number', name: 'batch_number', type: 'string', default: '', description: 'Filter by batch number' },
					{ displayName: 'Product ID', name: 'product_id', type: 'string', default: '', description: 'Filter by product ID' },
					{ displayName: 'Owner ID', name: 'owner_id', type: 'string', default: '', description: 'Filter by owner ID' },
					{ displayName: 'Description', name: 'description', type: 'string', default: '', description: 'Filter by description' },
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1, description: 'Page number for pagination' },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 5000, description: 'Number of records per page (max 5000)' },
				],
			},

			// Batch Create properties
			{
				displayName: 'Product ID',
				name: 'product_id',
				type: 'string',
				required: false,
				default: '',
				description: 'The ID of the product that this batch belongs to.',
				displayOptions: { show: { operation: ['createBatch'] } },
			},
			{
				displayName: 'Batch Number',
				name: 'batch_number',
				type: 'string',
				required: false,
				default: '',
				description: 'The batch number of the batch.',
				displayOptions: { show: { operation: ['createBatch'] } },
			},
			{
				displayName: 'Expiration Date',
				name: 'expiration_date',
				type: 'string',
				required: false,
				default: '',
				description: 'The expiration date of the batch.',
				displayOptions: { show: { operation: ['createBatch'] } },
			},
			{
				displayName: 'Owner ID',
				name: 'owner_id',
				type: 'string',
				required: false,
				default: '',
				description: 'The ID of the user that is the designated owner of this batch.',
				displayOptions: { show: { operation: ['createBatch'] } },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				required: false,
				default: '',
				description: 'The description of the batch.',
				displayOptions: { show: { operation: ['createBatch'] } },
			},

			// -------------------- CONTACT OPERATIONS --------------------
			// Get All Contacts properties
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getContact'] } },
				options: [
					{ displayName: 'Inserted Datetime', name: 'inserted_datetime', type: 'string', default: '', description: 'Filter contacts by their creation datetime' },
					{ displayName: 'Updated Datetime', name: 'updated_datetime', type: 'string', default: '', description: 'Filter contacts by the datetime they were most recently modified' },
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1, description: 'Page number for pagination' },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 1000, description: 'Number of records per page (max 1000)' },
				],
			},

			// -------------------- INVENTORY OPERATIONS --------------------
			// Get All Inventory properties
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getInventory'] } },
				options: [
					{ displayName: 'Grouping', name: 'grouping', type: 'string', default: '["PRODUCT"]', description: 'Attributes to group inventory by. PRODUCT is required. Options: "BATCH_NUMBER", "LOCATION", "PRODUCT"' },
					{ displayName: 'Product IDs', name: 'product_ids', type: 'string', default: '', description: 'Filter inventory levels by product IDs' },
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1, description: 'Page number for pagination' },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 5000, description: 'Number of records per page (max 5000)' },
				],
			},

			// -------------------- INVOICE OPERATIONS --------------------
			// Get All Invoices properties
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getInvoice'] } },
				options: [
					{ displayName: 'Due Datetime', name: 'due_datetime', type: 'string', default: '', description: 'Filter invoices by the due datetime' },
					{ displayName: 'Inserted Datetime', name: 'inserted_datetime', type: 'string', default: '', description: 'Filter invoices by their creation datetime' },
					{ displayName: 'Invoice Datetime', name: 'invoice_datetime', type: 'string', default: '', description: 'Filter invoices by the invoice datetime' },
					{ displayName: 'Invoice Number', name: 'invoice_number', type: 'string', default: '', description: 'Filter invoices by invoice number' },
					{ displayName: 'Order IDs', name: 'order_id', type: 'string', default: '', description: 'Filter invoices by order IDs' },
					{ displayName: 'Status', name: 'status', type: 'string', default: '', description: 'Filter invoices by status. Options: "Not Paid", "Over Paid", "Fully Paid", "Partially Paid"' },
					{ displayName: 'Updated Datetime', name: 'updated_datetime', type: 'string', default: '', description: 'Filter invoices by the datetime they were most recently modified' },
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1, description: 'Page number for pagination' },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 500, description: 'Number of records per page (max 500)' },
				],
			},

			// Invoice Payment properties
			{
				displayName: 'Invoice ID',
				name: 'invoice_id',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the invoice to add payment to',
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},
			{
				displayName: 'Payment Method ID',
				name: 'payment_method_id',
				type: 'string',
				required: true,
				default: '',
				description: 'Payment method ID',
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				required: true,
				default: 0,
				description: 'Amount of the payment. Will round to 2 decimal places',
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},
			{
				displayName: 'Payment Datetime',
				name: 'payment_datetime',
				type: 'string',
				required: true,
				default: '',
				description: 'Payment date',
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				required: true,
				default: '',
				description: 'Description of the payment',
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},
			{
				displayName: 'Quickbooks Deposit Account ID',
				name: 'quickbooks_deposit_account_id',
				type: 'string',
				required: false,
				default: '',
				description: 'Quickbooks deposit account ID. Cannot include both this and quickbooks_deposit_account_name',
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},
			{
				displayName: 'Quickbooks Deposit Account Name',
				name: 'quickbooks_deposit_account_name',
				type: 'string',
				required: false,
				default: '',
				description: 'Quickbooks deposit account name. Cannot include both this and quickbooks_deposit_account_id',
				displayOptions: { show: { operation: ['invoicePayment'] } },
			},

			// Upsert Invoice properties
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				required: false,
				default: '',
				description: 'Unique ID for this invoice. If it exists, an update will be performed',
				displayOptions: { show: { operation: ['upsertInvoice'] } },
			},
			{
				displayName: 'Due Datetime',
				name: 'due_datetime',
				type: 'string',
				required: false,
				default: '',
				description: 'The datetime at which the invoice is due',
				displayOptions: { show: { operation: ['upsertInvoice'] } },
			},
			{
				displayName: 'Invoice Datetime',
				name: 'invoice_datetime',
				type: 'string',
				required: false,
				default: '',
				description: 'The datetime on which the invoice was placed',
				displayOptions: { show: { operation: ['upsertInvoice'] } },
			},
			{
				displayName: 'Charges',
				name: 'charges',
				type: 'json',
				required: false,
				default: '',
				description: 'The additional lines of Charge, Discount, or Tax added to this invoice',
				displayOptions: { show: { operation: ['upsertInvoice'] } },
			},
			{
				displayName: 'Items',
				name: 'items',
				type: 'json',
				required: false,
				default: '',
				description: 'The invoice items present on this order',
				displayOptions: { show: { operation: ['upsertInvoice'] } },
			},
			{
				displayName: 'Billing Location ID',
				name: 'billing_location_id',
				type: 'string',
				required: false,
				default: '',
				description: 'The billing location\'s ID',
				displayOptions: { show: { operation: ['upsertInvoice'] } },
			},

			// -------------------- LOCATION OPERATIONS --------------------
			// Get All Locations properties
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getLocation'] } },
				options: [
					{ displayName: 'Inserted Datetime', name: 'inserted_datetime', type: 'string', default: '', description: 'Filter locations by their creation datetime' },
					{ displayName: 'Updated Datetime', name: 'updated_datetime', type: 'string', default: '', description: 'Filter locations by the datetime they were most recently modified' },
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1, description: 'Page number for pagination' },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 1000, description: 'Number of records per page (max 1000)' },
				],
			},

			// -------------------- PACKAGE OPERATIONS --------------------
			// Get All Packages properties
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getPackage'] } },
				options: [
					{ displayName: 'Inserted Datetime', name: 'inserted_datetime', type: 'string', default: '', description: 'Filter packages by their creation datetime' },
					{ displayName: 'Location IDs', name: 'location_ids', type: 'string', default: '', description: 'A list of location UUIDs to filter packages by' },
					{ displayName: 'License Number', name: 'license_number', type: 'string', default: '', description: 'Filter packages by license number' },
					{ displayName: 'Statuses', name: 'statuses', type: 'string', default: '', description: 'Filter packages by their status. Options: active, selling, sold' },
					{ displayName: 'Updated Datetime', name: 'updated_datetime', type: 'string', default: '', description: 'Filter packages by the datetime they were most recently modified' },
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1, description: 'Page number for pagination' },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 5000, description: 'Number of records per page (max 5000)' },
				],
			},

			// -------------------- PURCHASE OPERATIONS --------------------
			// Get All Purchases properties
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getPurchase'] } },
				options: [
					{ displayName: 'Due Datetime', name: 'due_datetime', type: 'string', default: '', description: 'Filter purchases by the due datetime' },
					{ displayName: 'Inserted Datetime', name: 'inserted_datetime', type: 'string', default: '', description: 'Filter purchases by their creation datetime' },
					{ displayName: 'Order Datetime', name: 'order_datetime', type: 'string', default: '', description: 'Filter purchases by the order datetime' },
					{ displayName: 'Status', name: 'status', type: 'string', default: '', description: 'Filter purchases by status. Options: Completed, Delivering, Partially Received, Pending, Processing' },
					{ displayName: 'Updated Datetime', name: 'updated_datetime', type: 'string', default: '', description: 'Filter purchases by the datetime they were most recently modified' },
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1, description: 'Page number for pagination' },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 500, description: 'Number of records per page (max 500)' },
				],
			},

			// Purchase Payment properties
			{
				displayName: 'Purchase ID',
				name: 'purchase_id',
				type: 'string',
				required: true,
				default: '',
				description: 'The ID of the purchase to add payment to',
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},
			{
				displayName: 'Payment Method ID',
				name: 'payment_method_id',
				type: 'string',
				required: true,
				default: '',
				description: 'Payment method ID',
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'number',
				required: true,
				default: 0,
				description: 'Amount of the payment. Will round to 2 decimal places',
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},
			{
				displayName: 'Payment Datetime',
				name: 'payment_datetime',
				type: 'string',
				required: true,
				default: '',
				description: 'Payment date',
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				required: true,
				default: '',
				description: 'Description of the payment',
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},
			{
				displayName: 'Quickbooks Deposit Account ID',
				name: 'quickbooks_deposit_account_id',
				type: 'string',
				required: false,
				default: '',
				description: 'Quickbooks deposit account ID. Cannot include both this and quickbooks_deposit_account_name',
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},
			{
				displayName: 'Quickbooks Deposit Account Name',
				name: 'quickbooks_deposit_account_name',
				type: 'string',
				required: false,
				default: '',
				description: 'Quickbooks deposit account name. Cannot include both this and quickbooks_deposit_account_id',
				displayOptions: { show: { operation: ['purchasePayment'] } },
			},

			// Upsert Purchase properties
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				required: false,
				default: '',
				description: 'Unique ID for this purchase order. If it exists, an update will be performed',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				required: false,
				default: '',
				description: 'A description of the purchase order',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Location ID',
				name: 'location_id',
				type: 'string',
				required: false,
				default: '',
				description: 'The location into which the inventory in this purchase will be received',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Billing Location ID',
				name: 'billing_location_id',
				type: 'string',
				required: false,
				default: '',
				description: 'The billing address for this purchase order',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Company ID',
				name: 'company_id',
				type: 'string',
				required: false,
				default: '',
				description: 'The company that is the supplier for this purchase order',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Order Datetime',
				name: 'order_datetime',
				type: 'string',
				required: false,
				default: '',
				description: 'The datetime on which the purchase order was placed',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Due Datetime',
				name: 'due_datetime',
				type: 'string',
				required: false,
				default: '',
				description: 'The datetime by which the purchase order should be paid',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Charges',
				name: 'charges',
				type: 'json',
				required: false,
				default: '',
				description: 'The additional lines of Charge, Discount, or Tax added to this purchase order',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},
			{
				displayName: 'Items',
				name: 'items',
				type: 'json',
				required: false,
				default: '',
				description: 'The items present on this purchase order',
				displayOptions: { show: { operation: ['upsertPurchase'] } },
			},

			// -------------------- STOCK ADJUSTMENT OPERATIONS --------------------
			// Get All Stock Adjustments properties
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getStockAdjustment'] } },
				options: [
					{ displayName: 'Inserted Datetime', name: 'inserted_datetime', type: 'string', default: '', description: 'Filter stock adjustments by their creation datetime' },
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1, description: 'Page number for pagination' },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 5000, description: 'Number of records per page (max 5000)' },
				],
			},

			// -------------------- STRAIN OPERATIONS --------------------
			// Get All Strains properties
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getStrain'] } },
				options: [
					{ displayName: 'Inserted Datetime', name: 'inserted_datetime', type: 'string', default: '', description: 'Filter strains by their creation datetime' },
					{ displayName: 'Updated Datetime', name: 'updated_datetime', type: 'string', default: '', description: 'Filter strains by the datetime they were most recently modified' },
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1, description: 'Page number for pagination' },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 50000, description: 'Number of records per page (max 50000)' },
				],
			},

			// -------------------- USER OPERATIONS --------------------
			// Get All Users properties
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: { show: { operation: ['getUser'] } },
				options: [
					{ displayName: 'Inserted Datetime', name: 'inserted_datetime', type: 'string', default: '', description: 'Filter users by their creation datetime' },
					{ displayName: 'Updated Datetime', name: 'updated_datetime', type: 'string', default: '', description: 'Filter users by the datetime they were most recently modified' },
					{ displayName: 'Page Number', name: 'page_number', type: 'number', default: 1, description: 'Page number for pagination' },
					{ displayName: 'Page Size', name: 'page_size', type: 'number', default: 1000, description: 'Number of records per page (max 1000)' },
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
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					let uri: string;
					let qs: Record<string, any> = { ...additionalFields };
					if (qs.page_number !== undefined) {
						qs['page[number]'] = qs.page_number;
						delete qs.page_number;
					}
					if (qs.page_size !== undefined) {
						qs['page[size]'] = qs.page_size;
						delete qs.page_size;
					}
					let response;
					if (additionalFields.id) {
						uri = `${baseUrl}/companies/${additionalFields.id}`;
						try {
							response = await this.helpers.request({
								method: 'GET',
								uri,
								headers: { Authorization: `Bearer ${credentials.apiToken}` },
								json: true,
							});
							if (Array.isArray(response.data)) {
								const found = response.data.find((item: any) => String(item.id) === String(additionalFields.id));
								if (found) {
									results.push({ json: found });
								}
							} else {
								results.push({ json: response.data });
							}
							continue;
						} catch (error) {
							if (error.statusCode === 404) {
								uri = `${baseUrl}/companies`;
								qs = { ...additionalFields };
								if (qs.page_number !== undefined) {
									qs['page[number]'] = qs.page_number;
									delete qs.page_number;
								}
								if (qs.page_size !== undefined) {
									qs['page[size]'] = qs.page_size;
									delete qs.page_size;
								}
								delete qs.id;
								response = await this.helpers.request({
									method: 'GET',
									uri,
									qs,
									headers: { Authorization: `Bearer ${credentials.apiToken}` },
									json: true,
								});
								if (Array.isArray(response.data)) {
									const filtered = response.data.filter((item: any) => String(item.id) === String(additionalFields.id));
									for (const item of filtered) {
										results.push({ json: item });
									}
								} else {
									results.push({ json: response.data });
								}
								continue;
							}
							throw error;
						}
					} else {
						uri = `${baseUrl}/companies`;
						delete qs.id;
						response = await this.helpers.request({
							method: 'GET',
							uri,
							qs,
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
					}
				} else if (operation === 'getProduct') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					let uri: string;
					let qs: Record<string, any> = { ...additionalFields };
					if (qs.page_number !== undefined) {
						qs['page[number]'] = qs.page_number;
						delete qs.page_number;
					}
					if (qs.page_size !== undefined) {
						qs['page[size]'] = qs.page_size;
						delete qs.page_size;
					}
					let response;
					if (additionalFields.id) {
						uri = `${baseUrl}/products/${additionalFields.id}`;
						try {
							response = await this.helpers.request({
								method: 'GET',
								uri,
								headers: { Authorization: `Bearer ${credentials.apiToken}` },
								json: true,
							});
							if (Array.isArray(response.data)) {
								const found = response.data.find((item: any) => String(item.id) === String(additionalFields.id));
								if (found) {
									results.push({ json: found });
								}
							} else {
								results.push({ json: response.data });
							}
							continue;
						} catch (error) {
							if (error.statusCode === 404) {
								uri = `${baseUrl}/products`;
								qs = { ...additionalFields };
								if (qs.page_number !== undefined) {
									qs['page[number]'] = qs.page_number;
									delete qs.page_number;
								}
								if (qs.page_size !== undefined) {
									qs['page[size]'] = qs.page_size;
									delete qs.page_size;
								}
								delete qs.id;
								response = await this.helpers.request({
									method: 'GET',
									uri,
									qs,
									headers: { Authorization: `Bearer ${credentials.apiToken}` },
									json: true,
								});
								if (Array.isArray(response.data)) {
									const filtered = response.data.filter((item: any) => String(item.id) === String(additionalFields.id));
									for (const item of filtered) {
										results.push({ json: item });
									}
								} else {
									results.push({ json: response.data });
								}
								continue;
							}
							throw error;
						}
					} else {
						uri = `${baseUrl}/products`;
						delete qs.id;
						response = await this.helpers.request({
							method: 'GET',
							uri,
							qs,
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
					}
				} else if (operation === 'getOrder') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					let uri: string;
					let qs: Record<string, any> = { ...additionalFields };
					if (qs.page_number !== undefined) {
						qs['page[number]'] = qs.page_number;
						delete qs.page_number;
					}
					if (qs.page_size !== undefined) {
						qs['page[size]'] = qs.page_size;
						delete qs.page_size;
					}
					let response;
					if (additionalFields.id) {
						uri = `${baseUrl}/orders/${additionalFields.id}`;
						try {
							response = await this.helpers.request({
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
							continue;
						} catch (error) {
							if (error.statusCode === 404) {
								uri = `${baseUrl}/orders`;
								qs = { ...additionalFields };
								if (qs.page_number !== undefined) {
									qs['page[number]'] = qs.page_number;
									delete qs.page_number;
								}
								if (qs.page_size !== undefined) {
									qs['page[size]'] = qs.page_size;
									delete qs.page_size;
								}
								delete qs.id;
								response = await this.helpers.request({
									method: 'GET',
									uri,
									qs,
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
								continue;
							}
							throw error;
						}
					} else {
						uri = `${baseUrl}/orders`;
						delete qs.id;
						response = await this.helpers.request({
							method: 'GET',
							uri,
							qs,
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
				} else if (operation === 'getAssembly') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					let uri = `${baseUrl}/assemblies`;
					let qs: Record<string, any> = { ...additionalFields };
					if (qs.page_number !== undefined) {
						qs['page[number]'] = qs.page_number;
						delete qs.page_number;
					}
					if (qs.page_size !== undefined) {
						qs['page[size]'] = qs.page_size;
						delete qs.page_size;
					}
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						qs,
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
				} else if (operation === 'getBatch') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					let uri = `${baseUrl}/batches`;
					let qs: Record<string, any> = { ...additionalFields };
					if (qs.page_number !== undefined) {
						qs['page[number]'] = qs.page_number;
						delete qs.page_number;
					}
					if (qs.page_size !== undefined) {
						qs['page[size]'] = qs.page_size;
						delete qs.page_size;
					}
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						qs,
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
				} else if (operation === 'createBatch') {
					const body: any = {};
					const fields = ['product_id', 'batch_number', 'expiration_date', 'owner_id', 'description'];
					for (const field of fields) {
						const value = this.getNodeParameter(field, i, '');
						if (value !== '') body[field] = value;
					}
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
				} else if (operation === 'getContact') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					let uri = `${baseUrl}/contacts`;
					let qs: Record<string, any> = { ...additionalFields };
					if (qs.page_number !== undefined) {
						qs['page[number]'] = qs.page_number;
						delete qs.page_number;
					}
					if (qs.page_size !== undefined) {
						qs['page[size]'] = qs.page_size;
						delete qs.page_size;
					}
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						qs,
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
				} else if (operation === 'getInventory') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					let uri = `${baseUrl}/inventory`;
					let qs: Record<string, any> = { ...additionalFields };
					if (qs.page_number !== undefined) {
						qs['page[number]'] = qs.page_number;
						delete qs.page_number;
					}
					if (qs.page_size !== undefined) {
						qs['page[size]'] = qs.page_size;
						delete qs.page_size;
					}
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						qs,
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
				} else if (operation === 'getInvoice') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					let uri = `${baseUrl}/invoices`;
					let qs: Record<string, any> = { ...additionalFields };
					if (qs.page_number !== undefined) {
						qs['page[number]'] = qs.page_number;
						delete qs.page_number;
					}
					if (qs.page_size !== undefined) {
						qs['page[size]'] = qs.page_size;
						delete qs.page_size;
					}
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						qs,
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
				} else if (operation === 'getLocation') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					let uri = `${baseUrl}/locations`;
					let qs: Record<string, any> = { ...additionalFields };
					if (qs.page_number !== undefined) {
						qs['page[number]'] = qs.page_number;
						delete qs.page_number;
					}
					if (qs.page_size !== undefined) {
						qs['page[size]'] = qs.page_size;
						delete qs.page_size;
					}
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						qs,
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
				} else if (operation === 'getPackage') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					let uri = `${baseUrl}/packages`;
					let qs: Record<string, any> = { ...additionalFields };
					if (qs.page_number !== undefined) {
						qs['page[number]'] = qs.page_number;
						delete qs.page_number;
					}
					if (qs.page_size !== undefined) {
						qs['page[size]'] = qs.page_size;
						delete qs.page_size;
					}
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						qs,
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
				} else if (operation === 'getPaymentMethod') {
					let uri = `${baseUrl}/payment/methods`;
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
				} else if (operation === 'getPurchase') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					let uri = `${baseUrl}/purchases`;
					let qs: Record<string, any> = { ...additionalFields };
					if (qs.page_number !== undefined) {
						qs['page[number]'] = qs.page_number;
						delete qs.page_number;
					}
					if (qs.page_size !== undefined) {
						qs['page[size]'] = qs.page_size;
						delete qs.page_size;
					}
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						qs,
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
				} else if (operation === 'getStockAdjustment') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					let uri = `${baseUrl}/adjustments`;
					let qs: Record<string, any> = { ...additionalFields };
					if (qs.page_number !== undefined) {
						qs['page[number]'] = qs.page_number;
						delete qs.page_number;
					}
					if (qs.page_size !== undefined) {
						qs['page[size]'] = qs.page_size;
						delete qs.page_size;
					}
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						qs,
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
				} else if (operation === 'getStrain') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					let uri = `${baseUrl}/strains`;
					let qs: Record<string, any> = { ...additionalFields };
					if (qs.page_number !== undefined) {
						qs['page[number]'] = qs.page_number;
						delete qs.page_number;
					}
					if (qs.page_size !== undefined) {
						qs['page[size]'] = qs.page_size;
						delete qs.page_size;
					}
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						qs,
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
				} else if (operation === 'getUser') {
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as Record<string, any>;
					let uri = `${baseUrl}/users`;
					let qs: Record<string, any> = { ...additionalFields };
					if (qs.page_number !== undefined) {
						qs['page[number]'] = qs.page_number;
						delete qs.page_number;
					}
					if (qs.page_size !== undefined) {
						qs['page[size]'] = qs.page_size;
						delete qs.page_size;
					}
					const response = await this.helpers.request({
						method: 'GET',
						uri,
						qs,
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
				} else if (operation === 'upsertPurchase') {
					const body: any = {};
					const fields = ['id', 'description', 'location_id', 'billing_location_id', 'company_id', 'order_datetime', 'due_datetime', 'charges', 'items'];
					for (const field of fields) {
						const value = this.getNodeParameter(field, i, '');
						if (value !== '') body[field] = value;
					}
					const uri = `${baseUrl}/purchases`;
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
				} else if (operation === 'purchasePayment') {
					const purchaseId = this.getNodeParameter('purchase_id', i, '');
					const body: any = {};
					const fields = ['payment_method_id', 'amount', 'payment_datetime', 'description', 'quickbooks_deposit_account_id', 'quickbooks_deposit_account_name'];
					for (const field of fields) {
						const value = this.getNodeParameter(field, i, '');
						if (value !== '') body[field] = value;
					}
					const uri = `${baseUrl}/purchases/${purchaseId}/payments`;
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
					const body: any = {};
					const fields = ['id', 'due_datetime', 'invoice_datetime', 'charges', 'items', 'billing_location_id'];
					for (const field of fields) {
						const value = this.getNodeParameter(field, i, '');
						if (value !== '') body[field] = value;
					}
					const uri = `${baseUrl}/invoices`;
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
				} else if (operation === 'invoicePayment') {
					const invoiceId = this.getNodeParameter('invoice_id', i, '');
					const body: any = {};
					const fields = ['payment_method_id', 'amount', 'payment_datetime', 'description', 'quickbooks_deposit_account_id', 'quickbooks_deposit_account_name'];
					for (const field of fields) {
						const value = this.getNodeParameter(field, i, '');
						if (value !== '') body[field] = value;
					}
					const uri = `${baseUrl}/invoices/${invoiceId}/payments`;
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