# TIHLDEs nettside - Kvark 

## Contents
1. [Basic info](#basic-info)
2. [Getting started](#getting-started)
3. [Todo](#todo)
4. [Future plans](#future-plans)


### Basic info
This website uses the following technologies

* Yarn (Package-manager)
* ReactJs
* Material-UI (CSS-framework)
* Redux (store)

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

### TODO
The following things needs to be completed:

* Create a decent landing page
* CMS for job-posts
* Fix CMS for events (not scalable)
* Sign up

### Future plans
* User profile page
* TIHLDE Games
