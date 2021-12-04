# Natours - Tour Packages e-commerce application.

Natours is a fully featured e-commerce app built using modern web technologies.
Rest API layer built on Node.js's Express library. MongoDB (hosted on Atlas) was used as the persistance layer, with mongoose as the ORM to model the schema and access the database.
The API uses a token bases authentication flow with Jason Web Token, including security best practices such as anti CSRF, XSS, CORS, CSP, etc.
This app also features a fully working checkout flow integrated with Stripe's JS SDK, Email integration using Sendgrid (for email confirmation, password recovery, order payment confirmation, etc).
Deployment is and hosting is done using Heroku's CLI and git integration.

Features to be implemented:

- [ ] Two-factor authentiation
- [ ] Sign up form
- [ ] Favourite button
- [ ] 'My Reviews' page
