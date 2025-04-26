import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class DistruApiCredentialsApi implements ICredentialType {
  name = 'distruApi';
  displayName = 'Distru API';
  documentationUrl = 'https://apidocs.distru.dev';
  properties: INodeProperties[] = [
    {
      displayName: 'API Token',
      name: 'apiToken',
      type: 'string',
						typeOptions: { password: true },
      default: '',
      description: 'Your Distru API Bearer token',
    },
    {
      displayName: 'Use Staging Environment',
      name: 'useStaging',
      type: 'boolean',
      default: false,
      description: 'Toggle to use Distru staging environment instead of production',
    },
  ];
}