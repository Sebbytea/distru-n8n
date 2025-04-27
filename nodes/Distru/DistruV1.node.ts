import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import * as company from './v1/methods/company'; 
import * as order from './v1/methods/order';
import * as product from './v1/methods/product';

export class DistruV1 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: Partial<INodeTypeDescription>) {
		this.description = {
			displayName: baseDescription.displayName ?? 'Distru',
			name: baseDescription.name ?? 'distru',
			group: baseDescription.group ?? [],
			description: baseDescription.description ?? 'Interact with Distru API',
			subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
			...baseDescription,
			version: 1,
			defaults: { name: 'Distru' },
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
					displayName: 'Resource',
					name: 'resource',
					type: 'options',
					options: [
						{ name: 'Company', value: 'company' },
						{ name: 'Order', value: 'order' },
						{ name: 'Product', value: 'product' },
					],
					default: 'company',
					noDataExpression: true,
				},
				// Add operation selector and other properties here...
			],
		};
	}

	async execute(this: any) {
		const resource = this.getNodeParameter('resource', 0) as string;
		if (resource === 'company') {
			return company.execute.call(this);
		}
		if (resource === 'order') {
			return order.execute.call(this);
		}
		if (resource === 'product') {
			return product.execute.call(this);
		}
		throw new NodeOperationError(this.getNode(), 'Unknown resource');
	}
} 