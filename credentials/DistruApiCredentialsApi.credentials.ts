import {
	ICredentialType,
	INodeProperties,
	IAuthenticateGeneric,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class DistruApiCredentials implements ICredentialType {
	name = 'distruApi';
	displayName = 'Distru API';
	documentationUrl = 'https://apidocs.distru.dev';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			default: '',
      description: 'Your Distru API Bearer token',
			required: true,
		},
		{
			displayName: 'Use Staging Environment',
			name: 'useStaging',
			type: 'boolean',
      description: 'Toggle to use Distru staging environment instead of production',
			default: false,
		},
	];

	/**
	 * Declare how to add auth to requests.
	 * Here, bearer token in Authorization header.
	 */
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: 'Bearer {{$credentials.apiToken}}',
			},
		},
	};

	/**
	 * The test object describes how n8n should verify this credential.
	 * It leverages credential data via interpolation syntax.
	 */
	test: ICredentialTestRequest = {
		request: {
			// baseURL is conditional on staging toggle
			baseURL:
				'={{$credentials.useStaging ? "https://staging.distru.com/public/v1" : "https://app.distru.com/public/v1"}}',
			url: '/products?page[number]=1&page[size]=1',
		},
	};
}