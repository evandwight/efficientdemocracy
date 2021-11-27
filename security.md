# Security

This site is insecure.

## Specific measures
We follow try to follow the recommendations listed in the owasp cheatsheets. They are out of date and incomplete but better than nothing.
Cheatsheets:
* https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html
* https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

### Authentication

All sensitive user data (email, password, etc) are stored in aws cognito and are protected with a minimal api.

I'm assuming the cognito service defaults are secure. However no captcha protects it and I haven't enabled advanced security.

### Application Security

Implemented:
* Use flat Promise chains
* Set request size limits - nginx 1kb
* Do not block the event loop
* Perform input validation - beginning of every route with [validator](https://www.npmjs.com/package/validator)
* Perform output escaping - [react](https://reactjs.org/)
* Monitor the event loop - use [toobusy](https://www.npmjs.com/package/toobusy-js) to detect then show 503 with express middleware
* Take precautions against brute-forcing - nginx limit rate to 10 request per second
* Use Anti-CSRF tokens - [csrf](https://www.npmjs.com/package/csurf) attached to session to verify all post requests
* Remove unnecessary routes
* Prevent HTTP Parameter Pollution - [hpp](https://www.npmjs.com/package/hpp)

Not implemented:
* Perform application activity logging - only errors are logged currently (TODO)
* Only return what is necessary (TODO)
* Use object property descriptors - not needed
* Use access control lists - custom acls with three levels of access (not logged in, self, mod)

### Error & Exception Handling

Implemented:
* Handle uncaughtException
* Handle errors in asynchronous calls

### Server Security

Implemented:
* Set cookie flags appropriately
* Use appropriate security headers
** Not using Expect-CT or Public-Key-Pins (TODO)

### Platform Security

Implemented:
* Keep your packages up-to-date - weekly - lasted updated Nov 5 2021 (TODO automate)
* Do not use dangerous functions
* Stay away from evil regexes
* Run security linters - [eslint](https://eslint.org/)
* Use strict mode - typescript


