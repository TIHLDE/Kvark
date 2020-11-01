# TIHLDEs nettside - Kvark 
[![Vercel](./src/assets/img/vercel_background.svg)](https://vercel.com/?utm_source=kvark&utm_campaign=oss)

![Lint, test and build](https://github.com/tihlde/Kvark/workflows/Lint,%20test%20and%20build/badge.svg)

## Contents
1. [Basic info](#basic-info)
2. [Getting started](#getting-started)
3. [Rules](#rules)


### Basic info
This website uses the following technologies

* Yarn (Package-manager)
* ReactJs
* Typescript
* Material-UI (CSS-framework)

### Getting started

#### Installing
This project uses yarn, so all you have to do is to clone, install and run.

```
git clone git@github.com:tihlde/Kvark.git
cd Kvark
yarn install
yarn start 
```

#### API URL Setup
To run a local version of the site you have to first setup the URL
for the API. To do so, create a _.env.development_ file in the root-directory
and write the following
```
REACT_APP_API_URL=YOUR_API_URL_HERE
```
Normally there is a hosted API for development up and running on Heroku. This is
so development on the page should go faster. Ask the developers of this site for
the API-URL.

### Rules
These rules are to be updated

* All strings should be created with single-quotes
* The main _/components_ folder should only contain DUMMY-COMPONENTS. These components are shared between
all the different pages, and should not implement page-specific logic. The components should be so dumb
they can be moved to a different project and still work.
* All pages should be placed in the _/containers_ and should be inside their own folder.
* All page-specific components should be places in a separate _/components_ folder. For example _/containers/LogIn/components/_
