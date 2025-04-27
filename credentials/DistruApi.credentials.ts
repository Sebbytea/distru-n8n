import type { ICredentialType,IAuthenticateGeneric, INodeProperties } from 'n8n-workflow';

export class DistruApi implements ICredentialType {
	name = 'distruApi';
	displayName = 'Distru API';
	icon = 'file:distru.svg' as const;
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Use Staging Environment',
			name: 'useStaging',
			type: 'boolean',
			default: false,
			description: 'Whether to use the staging environment instead of production',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: 'Bearer {{$credentials.apiToken}}',
			},
		},
	};
}