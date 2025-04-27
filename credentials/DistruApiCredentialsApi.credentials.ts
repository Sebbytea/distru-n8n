import {
	ICredentialType,
	INodeProperties,
	IAuthenticateGeneric,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class DistruApiCredentialsApi implements ICredentialType {
	name = 'distruApi';
	displayName = 'Distru API';
	documentationUrl = 'https://apidocs.distru.dev';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
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

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://app.distru.com/public/v1',
			url: '/companies',
			method: 'GET',
			qs: {
				page: 1,
				per_page: 1
			},
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer {{$credentials.apiToken}}',
			},
		},
	};
}