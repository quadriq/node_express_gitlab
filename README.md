# Simple nodejs server to make sign in with GitLab

* Using gitlab as oauth2 provider
* Redirect to login page, if user is not authorized
* serve content of `public` directory for authorized user

# Setup

tested on Ubuntu

clone this repo into e.g. `/app` directory

```
cd /app
```

## Prepare

got to `gitlab.com` (or your own GitLab). Create there an Application.
As callback define `http://localhost:3000`

then go to `/app` directory and change `./config.json` - enter your client-id and secret-key

## Setup and run


```
apt-get install nodejs npm
npm install
node server.js
```

in browser `http://localhost:3000`
