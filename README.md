# Component Store

![David](https://img.shields.io/david/dev/componento/component-store)
![Node.js CI](https://github.com/componento/component-store/workflows/Node.js%20CI/badge.svg)

## About

Store to publish and distribute Componento components.

![Screenshot](./component_store_screenshot.png)

## Prerequisites

You need:

* Node >= Version 12
* Postgres >= Version 12

You can either setup a local database or start a docker container

    docker run --name componento-db -e POSTGRES_USER=componento -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=componento -p 5432:5432 -d postgres

## Build and run

After cloning the repository, you can install dependencies:

    npm install
    
Run database migrations to initialize/update db schema:

    npm run migrate   
    
Compile typescript to javascript:

    npm run build
    
Run tests:

    npm run test    
    
Start the server (compiles implicitly):

    npm start
    
Start the server in watch mode during development:

    npm run watch

## Test API

You can upload a sample component using `curl`:

    curl -X POST -F "foo=@./spec/sample_component.tar" http://localhost:3000/upload
