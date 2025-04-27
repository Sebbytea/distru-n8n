import {
	ICredentialType,
	INodeProperties,
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialDataDecryptedObject,
} from 'n8n-workflow';

interface DistruCredentials extends ICredentialDataDecryptedObject {
	apiToken: string;
	useStaging: boolean;
}

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
		{
			displayName: 'Use Staging Environment',
			name: 'useStaging',
			type: 'boolean',
			description: 'Toggle to use Distru staging environment instead of production',
			default: false,
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
			baseURL: '={{$credentials.useStaging ? "https://staging.distru.com/public/v1" : "https://app.distru.com/public/v1"}}',
			url: '/companies',
			headers: {
				'Content-Type': 'application/json',
			},
		},
	};

	async testRequest(credentials: DistruCredentials): Promise<any> {
		const baseURL = credentials.useStaging ? 'https://staging.distru.com/public/v1' : 'https://app.distru.com/public/v1';
		const url = '/companies';

		const request = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${credentials.apiToken}`,
			},
		};

		try {
			const response = await fetch(baseURL + url, {
				method: 'GET',
				headers: request.headers,
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Test request failed: ${response.status} ${response.statusText}\n${errorText}`);
			}

			return await response.json();
		} catch (error) {
			throw error;
		}
	}
}