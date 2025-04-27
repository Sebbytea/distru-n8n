import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
  } from 'n8n-workflow';
  
  export class DistruOrder implements INodeType {
    description: INodeTypeDescription = {
      displayName: 'Distru GET/POST Sales Order',
      name: 'distruOrder',
      icon: 'file:distru-vertical-bright-green.svg', // optional icon file you provide
      group: ['output'],
      version: 1,
      description: 'Create and retrieve sales orders from Distru',
      defaults: {
        name: 'Distru GET/POST Sales Order',
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
          options: [
            { name: 'Upsert Order', value: 'create' },
            { name: 'Get All Orders', value: 'getAll' },
            { name: 'Get Order By ID', value: 'getById' },
          ],
          default: 'create',
        },
        // Fields for `create` operation
        {
          displayName: 'Company ID',
          name: 'companyId',
          type: 'string',
          default: '',
          required: true,
          description: 'Company ID associated with the sales order',
          displayOptions: { show: { operation: ['create'] } },
        },
        {
          displayName: 'Billing Location ID',
          name: 'billingLocationId',
          type: 'string',
          default: '',
          description: 'ID of the billing location',
          displayOptions: { show: { operation: ['create'] } },
        },
        {
          displayName: 'Shipping Location ID',
          name: 'shippingLocationId',
          type: 'string',
          default: '',
          description: 'ID of the shipping location',
          displayOptions: { show: { operation: ['create'] } },
        },
        {
          displayName: 'Due Date',
          name: 'dueDatetime',
          type: 'dateTime',
          default: '',
          description: 'When the order is due',
          displayOptions: { show: { operation: ['create'] } },
        },
        {
          displayName: 'Delivery Date',
          name: 'deliveryDatetime',
          type: 'dateTime',
          default: '',
          description: 'When the order will be delivered',
          displayOptions: { show: { operation: ['create'] } },
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
          displayOptions: { show: { operation: ['create'] } },
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
          displayOptions: { show: { operation: ['create'] } },
        },
        {
          displayName: 'Internal Notes',
          name: 'internalNotes',
          type: 'string',
          default: '',
          description: 'Internal notes for the order',
          displayOptions: { show: { operation: ['create'] } },
        },
        {
          displayName: 'External Notes',
          name: 'externalNotes',
          type: 'string',
          default: '',
          description: 'External notes visible to the customer',
          displayOptions: { show: { operation: ['create'] } },
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
          displayOptions: { show: { operation: ['create'] } },
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
  
        // Fields for getById
        {
          displayName: 'Order ID',
          name: 'orderId',
          type: 'string',
          default: '',
          required: true,
          description: 'ID of the order to retrieve',
          displayOptions: { show: { operation: ['getById'] } },
        },
  
        // Optional filters for getAll (could be extended)
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
          typeOptions: {
            minValue: 1,
          },
          displayOptions: {
            show: {
              operation: ['getAll'],
              returnAll: [false],
            },
          },
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
      // Read useStaging flag from credentials (may be undefined if not set)
      const useStaging = (credentials.useStaging ?? false) as boolean;

      // Determine base URL dynamically
      const baseUrl = useStaging 
        ? 'https://staging.distru.com/public/v1' 
        : 'https://app.distru.com/public/v1';
  
      for (let i = 0; i < items.length; i++) {
        const operation = this.getNodeParameter('operation', i) as string;
  
        try {
          if (operation === 'create') {
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
              uri: '${baseUrl}/orders',
              headers: {
                Authorization: `Bearer ${credentials.apiToken}`,
                'Content-Type': 'application/json',
              },
              body,
              json: true,
            });
            results.push({ json: response });
          } else if (operation === 'getAll') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const limit = this.getNodeParameter('limit', i) as number;
  
            let uri = `${baseUrl}/orders`;
  
            // If not returnAll, can add limit param (if Distru supports)
            // Distru API docs don’t explicitly mention limit param, so get all or paginated accordingly.
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
          } else if (operation === 'getById') {
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