// This file contains mock authentication data.

export const mockUser = {
	uid: 'mockUser123',
	email: 'mockuser@example.com',
	emailVerified: true,
	displayName: 'Mock User',
	isAnonymous: false,
	photoURL: 'https://example.com/photo.jpg',
	providerData: [
		{
			providerId: 'google.com',
			uid: 'mockProviderId123',
			displayName: 'Mock User',
			email: 'mockuser@example.com',
			photoURL: 'https://example.com/photo.jpg',
		},
	],
	stsTokenManager: {
		refreshToken: 'mockRefreshToken',
		accessToken: 'mockAccessToken',
		expirationTime: 1726112168980,
	},
	createdAt: '1723320388225',
	lastLoginAt: '1726108569039',
	apiKey: 'mockApiKey',
	appName: '[DEFAULT]',
};
