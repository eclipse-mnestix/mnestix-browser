-- Add the STS (Factory-X token exchange) security type.
-- STS infrastructures forward the user's session bearer token to the Consumer Gateway,
-- which performs the RFC 8693 token exchange. No encrypted credentials are stored for this type.
INSERT INTO "SecurityType" ("id", "typeName")
VALUES ('3', 'STS');
