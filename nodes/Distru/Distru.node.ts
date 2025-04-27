import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class Distru implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Distru',
    name: 'distru',
    icon: 'file:distru.svg',
    group: ['transform'],
    version: 1,
    description: 'Interact with the Distru API',
    defaults: { name: 'Distru' },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'distruApi',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: '={{ $credentials.useStaging ? "https://staging.distru.com/public/v1" : "https://app.distru.com/public/v1" }}',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer {{$credentials.apiToken}}',
      },
    },
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
								noDataExpression: true,
        options: [
          { name: 'Company', value: 'company' },
          { name: 'Order', value: 'order' },
          { name: 'Product', value: 'product' },
        ],
        default: 'company',
      },

      // --- Company Operations ---
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
								noDataExpression: true,
        displayOptions: { show: { resource: ['company'] } },
        options: [
          {
            name: 'Get Many',
            value: 'getAll',
            routing: {
              request: {
                method: 'GET',
                url: '/companies',
                // Add query parameters if needed
                // You can add insertedDatetime, updatedDatetime as query params here
              },
            },
												action: 'Get many companies',
          },
          {
            name: 'Create or Update',
            value: 'upsert',
            routing: {
              request: {
                method: 'POST',
                url: '/companies',
                body: {
                  properties: {
                    id: '={{ $parameter["id"] }}',
                    name: '={{ $parameter["name"] }}',
                    category: '={{ $parameter["category"] }}',
                    default_email: '={{ $parameter["default_email"] }}',
                    invoice_email: '={{ $parameter["invoice_email"] }}',
                    purchase_order_email: '={{ $parameter["purchase_order_email"] }}',
                    sales_order_email: '={{ $parameter["sales_order_email"] }}',
                    order_shipment_email: '={{ $parameter["order_shipment_email"] }}',
                    legal_business_name: '={{ $parameter["legal_business_name"] }}',
                    outstanding_balance_threshold: '={{ $parameter["outstanding_balance_threshold"] }}',
                    owner_id: '={{ $parameter["owner_id"] }}',
                    phone_number: '={{ $parameter["phone_number"] }}',
                    website: '={{ $parameter["website"] }}',
                    default_sales_order_notes: '={{ $parameter["default_sales_order_notes"] }}',
                    default_purchase_order_notes: '={{ $parameter["default_purchase_order_notes"] }}',
                    relationship_type_id: '={{ $parameter["relationship_type_id"] }}',
                    custom_data: '={{ $parameter["custom_data"] ? JSON.parse($parameter["custom_data"]) : undefined }}',
                  },
                },
              },
            },
												action: 'Upsert a company',
          },
        ],
        default: 'getAll',
      },
      // Company fields for upsert
      { displayName: 'ID', name: 'id', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },
      { displayName: 'Name', name: 'name', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },
      { displayName: 'Category', name: 'category', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },
      { displayName: 'Default Email', name: 'default_email', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },
      { displayName: 'Invoice Email', name: 'invoice_email', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },
      { displayName: 'Purchase Order Email', name: 'purchase_order_email', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },
      { displayName: 'Sales Order Email', name: 'sales_order_email', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },
      { displayName: 'Order Shipment Email', name: 'order_shipment_email', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },
      { displayName: 'Legal Business Name', name: 'legal_business_name', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },
      { displayName: 'Outstanding Balance Threshold', name: 'outstanding_balance_threshold', type: 'number', default: 0, displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },
      { displayName: 'Owner ID', name: 'owner_id', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },
      { displayName: 'Phone Number', name: 'phone_number', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },
      { displayName: 'Website', name: 'website', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },
      { displayName: 'Default Sales Order Notes', name: 'default_sales_order_notes', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },
      { displayName: 'Default Purchase Order Notes', name: 'default_purchase_order_notes', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },
      { displayName: 'Relationship Type ID', name: 'relationship_type_id', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },
      { displayName: 'Custom Data (JSON Array)', name: 'custom_data', type: 'string', default: '', displayOptions: { show: { resource: ['company'], operation: ['upsert'] } } },

      // --- Order Operations ---
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
								noDataExpression: true,
        displayOptions: { show: { resource: ['order'] } },
        options: [
          {
            name: 'Get Many',
            value: 'getAll',
            routing: {
              request: {
                method: 'GET',
                url: '/orders',
              },
            },
												action: 'Get many orders',
          },
          {
            name: 'Create',
            value: 'create',
            routing: {
              request: {
                method: 'POST',
                url: '/orders',
                body: {
                  properties: {
                    company_id: '={{ $parameter["companyId"] }}',
                    billing_location_id: '={{ $parameter["billingLocationId"] }}',
                    shipping_location_id: '={{ $parameter["shippingLocationId"] }}',
                    due_datetime: '={{ $parameter["dueDatetime"] }}',
                    delivery_datetime: '={{ $parameter["deliveryDatetime"] }}',
                    blaze_payment_type: '={{ $parameter["blazePaymentType"] }}',
                    status: '={{ $parameter["status"] }}',
                    internal_notes: '={{ $parameter["internalNotes"] }}',
                    external_notes: '={{ $parameter["externalNotes"] }}',
                    items: '={{ $parameter["items"] }}', // You may want to use a collection for items
                  },
                },
              },
            },
												action: 'Create an order',
          },
          {
            name: 'Get By ID',
            value: 'getById',
            routing: {
              request: {
                method: 'GET',
                url: '=/orders/{{$parameter["orderId"]}}',
              },
            },
												action: 'Get by id an order',
          },
        ],
        default: 'getAll',
      },
      // Order fields for create
      { displayName: 'Company ID', name: 'companyId', type: 'string', default: '', displayOptions: { show: { resource: ['order'], operation: ['create'] } } },
      { displayName: 'Billing Location ID', name: 'billingLocationId', type: 'string', default: '', displayOptions: { show: { resource: ['order'], operation: ['create'] } } },
      { displayName: 'Shipping Location ID', name: 'shippingLocationId', type: 'string', default: '', displayOptions: { show: { resource: ['order'], operation: ['create'] } } },
      { displayName: 'Due Datetime', name: 'dueDatetime', type: 'string', default: '', displayOptions: { show: { resource: ['order'], operation: ['create'] } } },
      { displayName: 'Delivery Datetime', name: 'deliveryDatetime', type: 'string', default: '', displayOptions: { show: { resource: ['order'], operation: ['create'] } } },
      { displayName: 'Blaze Payment Type', name: 'blazePaymentType', type: 'string', default: '', displayOptions: { show: { resource: ['order'], operation: ['create'] } } },
      { displayName: 'Status', name: 'status', type: 'string', default: '', displayOptions: { show: { resource: ['order'], operation: ['create'] } } },
      { displayName: 'Internal Notes', name: 'internalNotes', type: 'string', default: '', displayOptions: { show: { resource: ['order'], operation: ['create'] } } },
      { displayName: 'External Notes', name: 'externalNotes', type: 'string', default: '', displayOptions: { show: { resource: ['order'], operation: ['create'] } } },
      { displayName: 'Items (JSON Array)', name: 'items', type: 'string', default: '', displayOptions: { show: { resource: ['order'], operation: ['create'] } } },
      { displayName: 'Order ID', name: 'orderId', type: 'string', default: '', displayOptions: { show: { resource: ['order'], operation: ['getById'] } } },

      // --- Product Operations ---
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
								noDataExpression: true,
        displayOptions: { show: { resource: ['product'] } },
        options: [
          {
            name: 'Get Many',
            value: 'getAll',
            routing: {
              request: {
                method: 'GET',
                url: '/products',
              },
            },
												action: 'Get many products',
          },
          {
            name: 'Create or Update',
            value: 'upsert',
            routing: {
              request: {
                method: 'POST',
                url: '/products',
                body: {
                  properties: {
                    id: '={{ $parameter["id"] }}',
                    name: '={{ $parameter["name"] }}',
                    sku: '={{ $parameter["sku"] }}',
                    description: '={{ $parameter["description"] }}',
                    inventory_tracking_method: '={{ $parameter["inventory_tracking_method"] }}',
                    category_id: '={{ $parameter["category_id"] }}',
                    subcategory_id: '={{ $parameter["subcategory_id"] }}',
                    group_id: '={{ $parameter["group_id"] }}',
                    brand_id: '={{ $parameter["brand_id"] }}',
                    vendor_id: '={{ $parameter["vendor_id"] }}',
                    unit_price: '={{ $parameter["unit_price"] }}',
                    unit_cost: '={{ $parameter["unit_cost"] }}',
                    msrp: '={{ $parameter["msrp"] }}',
                    wholesale_unit_price: '={{ $parameter["wholesale_unit_price"] }}',
                    upc: '={{ $parameter["upc"] }}',
                    units_per_case: '={{ $parameter["units_per_case"] }}',
                    is_featured: '={{ $parameter["is_featured"] }}',
                    is_inactive: '={{ $parameter["is_inactive"] }}',
                    menu_visibility: '={{ $parameter["menu_visibility"] }}',
                    total_thc: '={{ $parameter["total_thc"] }}',
                    total_cbd: '={{ $parameter["total_cbd"] }}',
                    total_cannabinoid_unit: '={{ $parameter["total_cannabinoid_unit"] }}',
                    unit_type_id: '={{ $parameter["unit_type_id"] }}',
                    unit_net_weight: '={{ $parameter["unit_net_weight"] }}',
                    unit_serving_size: '={{ $parameter["unit_serving_size"] }}',
                    unit_net_weight_and_serving_size_unit_type_id: '={{ $parameter["unit_net_weight_and_serving_size_unit_type_id"] }}',
                    strain_id: '={{ $parameter["strain_id"] }}',
                    owner_id: '={{ $parameter["owner_id"] }}',
                    tags: '={{ $parameter["tags"] ? JSON.parse($parameter["tags"]) : undefined }}',
                    menus: '={{ $parameter["menus"] ? JSON.parse($parameter["menus"]) : undefined }}',
                  },
                },
              },
            },
												action: 'Upsert a product',
          },
        ],
        default: 'getAll',
      },
      // Product fields for upsert
      { displayName: 'ID', name: 'id', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Name', name: 'name', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'SKU', name: 'sku', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Description', name: 'description', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Inventory Tracking Method', name: 'inventory_tracking_method', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Category ID', name: 'category_id', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Subcategory ID', name: 'subcategory_id', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Group ID', name: 'group_id', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Brand ID', name: 'brand_id', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Vendor ID', name: 'vendor_id', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Unit Price', name: 'unit_price', type: 'number', default: 0, displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Unit Cost', name: 'unit_cost', type: 'number', default: 0, displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'MSRP', name: 'msrp', type: 'number', default: 0, displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Wholesale Unit Price', name: 'wholesale_unit_price', type: 'number', default: 0, displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'UPC', name: 'upc', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Units Per Case', name: 'units_per_case', type: 'number', default: 0, displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Is Featured', name: 'is_featured', type: 'boolean', default: false, displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Is Inactive', name: 'is_inactive', type: 'boolean', default: false, displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Menu Visibility', name: 'menu_visibility', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Total THC', name: 'total_thc', type: 'number', default: 0, displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Total CBD', name: 'total_cbd', type: 'number', default: 0, displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Total Cannabinoid Unit', name: 'total_cannabinoid_unit', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Unit Type ID', name: 'unit_type_id', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Unit Net Weight', name: 'unit_net_weight', type: 'number', default: 0, displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Unit Serving Size', name: 'unit_serving_size', type: 'number', default: 0, displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Unit Net Weight and Serving Size Unit Type ID', name: 'unit_net_weight_and_serving_size_unit_type_id', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Strain ID', name: 'strain_id', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Owner ID', name: 'owner_id', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Tags (JSON Array)', name: 'tags', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
      { displayName: 'Menus (JSON Array)', name: 'menus', type: 'string', default: '', displayOptions: { show: { resource: ['product'], operation: ['upsert'] } } },
    ],
  };
} 