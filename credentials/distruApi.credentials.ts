import { ICredentialType, INodeProperties } from 'n8n-workflow';

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
    },
  ];
}