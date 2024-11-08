## PRJ - ST2AWD - Interface Development and Design (I2 - 2425S7)

25-Oct-2024 | SE Promo 2026 | KOCOGLU Lucas

## Description

This project is for the course Interface Development and Design. The subject chosen is **Climatiq API**.<br>
The objectives are:
- Microsofth AOuth and Google AOuth log in, then showing user data in header components.
- Microsofth AOuth and Google AOuth logout correctly.
- Once logged in, the user must have the choice to calculate its CO2 emissions for different activities:
    1. Cloud computing activity
    2. Flights activity
    3. Custom activities
- The user can also observe some graphical comparison of CO2 emissions (between countries for example).

## Installation

Before installing the project, please ensure the `.env` file is correctly setup at root of the `vue-oath-microsoft-graph` project folder.<br>
Here's what the `.env` file should look like:
```bash
VUE_APP_MICROSOFT_OAUTH_CLIENT_ID=KEY

VUE_APP_GOOGLE_OAUTH_CLIENT_ID=KEY
VUE_APP_GOOGLE_OAUTH_CLIENT_SECRET=KEY

VUE_APP_CLIMATIQ_API_KEY=KEY
```

To install the project, go to the `vue-oath-microsoft-graph` project folder, and launch the following command:
```bash
npm install
```

To launch the project, launch the following command:
```bash
npm run serve
```

To access the project, go to the default [URL](http://localhost:8080/).
