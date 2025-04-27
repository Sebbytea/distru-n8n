import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
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
			if (operation === 'create') {
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
			} else if (operation === 'getAll') {
				let uri = `${baseUrl}/orders`;
				const response = await this.helpers.request({
					method: 'GET',
					uri,
					headers: {
						Authorization: `Bearer ${credentials.apiToken}`,
					},
					json: true,
				});
				let data = response.data;
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