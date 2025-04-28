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
					{ name: 'Company: Get', value: 'getAllCompanies' },
					{ name: 'Product: Create or Update', value: 'upsertProduct' },
					{ name: 'Product: Get', value: 'getAllProducts' },
					{ name: 'Sales Order: Create or Update', value: 'upsertOrder' },
					{ name: 'Sales Order: Get', value: 'getAllOrders' },
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
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				default: '',
				description: 'If set, only fetch the record with this ID',
				displayOptions: { show: { operation: ['getAllCompanies'] } },
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
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				default: '',
				description: 'If set, only fetch the record with this ID',
				displayOptions: { show: { operation: ['getAllProducts'] } },
			},

			// Upsert Product properties
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
				displayName: 'ID',
				name: 'id',
				type: 'string',
				default: '',
				description: 'If set, only fetch the record with this ID',
				displayOptions: { show: { operation: ['getAllOrders'] } },
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
					const id = this.getNodeParameter('id', i, '') as string;
					if (id) {
						const uri = `${baseUrl}/companies/${id}`;
						const response = await this.helpers.request({
							method: 'GET',
							uri,
							headers: { Authorization: `Bearer ${credentials.apiToken}` },
							json: true,
						});
						results.push({ json: response.data });
					} else {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
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

							if (!returnAll && fetchedCount >= pageSize) {
								continueFetching = false;
							} else if (data.length < pageSize) {
								continueFetching = false;
							} else {
								pageNumber++;
							}
						}
					}
				} else if (operation === 'getAllProducts') {
					const id = this.getNodeParameter('id', i, '') as string;
					if (id) {
						const uri = `${baseUrl}/products/${id}`;
						const response = await this.helpers.request({
							method: 'GET',
							uri,
							headers: { Authorization: `Bearer ${credentials.apiToken}` },
							json: true,
						});
						results.push({ json: response.data });
					} else {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
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

							if (!returnAll && fetchedCount >= pageSize) {
								continueFetching = false;
							} else if (data.length < pageSize) {
								continueFetching = false;
							} else {
								pageNumber++;
							}
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
					const id = this.getNodeParameter('id', i, '') as string;
					if (id) {
						const uri = `${baseUrl}/orders/${id}`;
						const response = await this.helpers.request({
							method: 'GET',
							uri,
							headers: { Authorization: `Bearer ${credentials.apiToken}` },
							json: true,
						});
						results.push({ json: response.data });
					} else {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						let uri = `${baseUrl}/orders`;
						const pageSize = 5000;
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
							data = data.slice(0, pageSize);
						}
						for (const order of data) {
							results.push({ json: order });
						}
					}
				} else if (operation === 'upsertOrder') {
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