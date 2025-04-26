import {
	ICredentialType,
	INodeProperties,
	IAuthenticateGeneric,
	ICredentialTestRequest,
	LoggerProxy as Logger,
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
			baseURL: '={{$credentials.useStaging ? "https://staging.distru.com/public/v1" : "https://app.distru.com/public/v1"}}',
			url: '/products?page[number]=1&page[size]=1',
			headers: {
				'Content-Type': 'application/json',
			},
		},
	};

	async testRequest(credentials: DistruCredentials): Promise<any> {
		const baseURL = credentials.useStaging ? 'https://staging.distru.com/public/v1' : 'https://app.distru.com/public/v1';
		const url = '/products?page[number]=1&page[size]=1';

		// Log credential details
		Logger.debug('Credential test started', {
			credentialName: this.name,
			useStaging: credentials.useStaging,
			baseURL,
			hasToken: !!credentials.apiToken,
			tokenLength: credentials.apiToken.length,
			tokenPrefix: credentials.apiToken.substring(0, 10) + '...',
		});

		const request = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${credentials.apiToken}`,
			},
		};

		// Log full request details
		Logger.debug('Sending test request', {
			method: 'GET',
			url: baseURL + url,
			headers: {
				...request.headers,
				Authorization: `Bearer ${credentials.apiToken.substring(0, 10)}...`,
			},
		});

		try {
			const response = await fetch(baseURL + url, {
				method: 'GET',
				headers: request.headers,
			});

			const headers: Record<string, string> = {};
			response.headers.forEach((value, key) => {
				headers[key] = value;
			});

			// Log full response details
			Logger.debug('Received test response', {
				status: response.status,
				statusText: response.statusText,
				headers,
				url: response.url,
			});

			if (!response.ok) {
				const errorText = await response.text();
				Logger.error('Test request failed', {
					status: response.status,
					statusText: response.statusText,
					error: errorText,
					requestUrl: baseURL + url,
					requestHeaders: {
						...request.headers,
						Authorization: `Bearer ${credentials.apiToken.substring(0, 10)}...`,
					},
				});
				throw new Error(`Test request failed: ${response.status} ${response.statusText}\n${errorText}`);
			}

			return await response.json();
		} catch (error) {
			Logger.error('Test request error', { 
				error,
				requestUrl: baseURL + url,
				requestHeaders: {
					...request.headers,
					Authorization: `Bearer ${credentials.apiToken.substring(0, 10)}...`,
				},
			});
			throw error;
		}
	}
}