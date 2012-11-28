# Sideproject

Sideproject gives you a simple Express based app to get started. It's ready to be deployed to Heroku, and I suggest setting up a free MongoHQ DB for testing.

## Setup
- `npm install`
- Edit `config.js` to point to your MongoDB database

## Packages Used
- Express
- Mongode
- Jade Templates
- Stylus
- Stylus-Bootstrap
- Passport Authentication
- Connect-Sessions

## Auth

Passport (npm install passport) based. Uses LocalStrategy (passport-local) out of the box.

Facebook and Twitter support are available via the appropriate passport npm packages.

Note: passwords are currently stored in PLAINTEXT. If you'd like to do something more sane with
salting and hashing and such, you can modify LocalStrategy in `auth.js`