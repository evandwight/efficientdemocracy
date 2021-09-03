# Security

This site is insecure. Please do not reuse passwords, or an email address you don't want leaked. Known insecurities:

* Login - timing attacks, no request limitations
* Registration - leaks email information

## Specific measures
We follow try to follow the recommendations listed in the owasp cheatsheets. They are out of date and incomplete but better than nothing.
Cheatsheets:
* https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html
* https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
* https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
* https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

### Authentication

This area needs work.

Implemented:
* Authentication Solution and Sensitive Accounts - no sensitive accounts used
* Transmit Passwords Only Over TLS or Other Strong Transport - tls with nginx
* Password Managers - compatible

Not Implemented:
* Implement Proper Password Strength Controls
* Implement Secure Password Recovery Mechanism
* Store Passwords in a Secure Fashion
* Compare Password Hashes Using Safe Functions
* Require Re-authentication for Sensitive Features
* Consider Strong Transaction Authentication
* Authentication and Error Messages
* Protect Against Automated Attacks
* Logging and Monitoring

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
* Keep your packages up-to-date - weekly - lasted updated Aug 29 2021 (TODO automate)
* Do not use dangerous functions
* Stay away from evil regexes
* Run security linters - [eslint](https://eslint.org/)
* Use strict mode - typescript


