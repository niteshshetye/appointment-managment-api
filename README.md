// "exec": "concurrently 'npx tsc --watch' 'ts-node src/index.ts'"

# Steps to create template folder for node express with typescript

## step 1

npm init -y

## Install required packages

npm i express dotenv

## Install required typescript package

npm i -D typescript @types/express @types/node

## Generate tsconfig.json

npx tsc --init

## tsconfig.json changes

uncomment => outDir: /dist
and change the => package.json => main: /dist/index.js

## install utility package for development

npm i -D nodemon ts-node concurrently

## add script in package.json

"build": "npx tsc",
"start": "node dist/index.js",
"dev": "nodemon src/index.ts"

## to run your code in watch mode

create nodemon.json

```c
{
"watch": ["src"],
"ext": "ts",
"exec": "concurrently 'npx tsc --watch' 'ts-node src/index.ts'"
}
```

## to add path alias

do changes in file => tsconfig.json

{
"compilerOptions": {
...
"baseUrl": "./",  
 "paths": {
"@services/_": ["src/services/_"],
"@utils/_": ["src/utils/_"]
},
"outDir": "./dist"
...
}
}

then install this package as node not support typescript alias out of the box

```cmd
npm install tsconfig-paths --save
```

then inside package.json
modifie the dev command
"scripts": {
...
"dev": "nodemon -r tsconfig-paths/register src/index.ts",
...
},

## to resolve in build

install this package

npm install --save-dev tsc-alias

update file => package.json => build command

"scripts": {
"build": "tsc --project tsconfig.json && tsc-alias -p tsconfig.json",
...
},
