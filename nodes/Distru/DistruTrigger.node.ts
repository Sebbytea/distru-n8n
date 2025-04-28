import type {
	IWebhookFunctions,
	IPollFunctions,
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';

export class DistruTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Distru Trigger',
		name: 'distruTrigger',
		icon: 'file:distru.svg',
		group: ['trigger'],
		version: 1,
		description: 'Triggers workflow on Distru event (webhook or poll)',
		subtitle: '={{$parameter["mode"]}}: {{$parameter["resource"]}}',
		defaults: {
			name: 'Distru Trigger',
		},
		inputs: [],
		outputs: ['main'],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'distru',
				// Only active in webhook mode:
				enabled: '={{$parameter["mode"] === "webhook"}}',
			},
		],
		polling: true, // enable polling
		properties: [
			{
				displayName: 'Trigger Type',
				name: 'mode',
				type: 'options',
				options: [
					{ name: 'Webhook (Receive From Distru)', value: 'webhook' },
					{ name: 'Polling (Check Distru Periodically)', value: 'polling' },
				],
				default: 'webhook',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				required: true,
				default: 'salesOrder',
				noDataExpression: true,
				options: [
					{ name: 'Assembly',    value: 'assembly' },
					{ name: 'Company',     value: 'company' },
					{ name: 'Contact',     value: 'contact' },
					{ name: 'Invoice',     value: 'invoice' },
					{ name: 'Purchase Order', value: 'purchaseOrder' },
					{ name: 'Return',      value: 'return' },
					{ name: 'Sales Order', value: 'salesOrder' },
				],
				description: 'Distru resource/event to trigger on',
			},
			// Only for polling mode
			{
				displayName: 'Polling Interval',
				name: 'pollInterval',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 5,
				description: 'How often to poll Distru, in minutes',
				displayOptions: { show: { mode: ['polling'] } },
			},
			// Add any other filters for getCompany, getOrder, etc as options
		],
	};

	// Webhook: receive from Distru
	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getRequestObject().body;
		return {
			workflowData: [[{ json: body } as INodeExecutionData]],
		};
	}

	// Polling: periodically fetch from Distru API
	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		// This example fetches new sales orders, but adjust for each resource
		const resource = this.getNodeParameter('resource', 0) as string;
		const credentials = await this.getCredentials('distruApi');

		const baseUrl = (credentials.useStaging ? 'https://staging.distru.com/public/v1' : 'https://app.distru.com/public/v1');

		const endpointMap: Record<string, string> = {
			salesOrder: 'orders',
			purchaseOrder: 'purchases',
			assembly: 'assemblies',
			invoice: 'invoices',
			contact: 'contacts',
			company: 'companies',
			return: 'returns',
		};
		const endpoint = endpointMap[resource];

		const staticData = this.getWorkflowStaticData('node');
		let lastTime = staticData.lastTimeChecked as string | undefined;

		const qs: IDataObject = {};
		// Fetch only new ones by datetime, for example
		if (lastTime) qs.updated_datetime = lastTime;
		const uri = `${baseUrl}/${endpoint}`;

		const response = await this.helpers.request!({
			method: 'GET',
			uri,
			qs,
			headers: { Authorization: `Bearer ${credentials.apiToken}` },
			json: true,
		});

		const items = Array.isArray(response.data) ? response.data : [response.data];
		if (items.length) {
			// Remember the latest update
			const mostRecent = items.reduce((acc: string, cur: { updated_datetime: string }) => (cur.updated_datetime > acc ? cur.updated_datetime : acc), lastTime ?? '');
			staticData.lastTimeChecked = mostRecent;
			return [items.map((item: any) => ({ json: item }))];
		}
		return null;
	}
}