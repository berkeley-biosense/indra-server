module.exports =  {
	// server config
	PORT: 23023,
	// bunyan logging
	LOG_NAME: 'indra-collection-server',
	// couch db config
	DB_HOST: 'localhost',
	DB_PORT: 5471,
	DB_NAME: 'my-cool-indra-db', 
	DB_ADMIN_USERNAME: 'couch-admin-username',
	DB_ADMIN_PASSWORD: 'couch-admin-password',
	// pusher config
	PUSHER_APP_ID: '122803',
	PUSHER_KEY: 'pusher-key',
	PUSHER_SECRET: 'pusher-secret', 
	IS_PUSHER_ENCRYPTED: true,
	// error messages
	UNPROCESSABLE_ENTITY_ERROR_MESSAGE: 'API requests must be json, with proper headers, and must conform to the indra schema. Refer to the API guide for JSON schema requirements.',
}
