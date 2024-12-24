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

{
$lookup: {
          from: 'appointmentattendees',
          localField: '_id',
          foreignField: 'appointment_id',
          as: 'appointment_attendees',
        },
      },
      {
        $unwind: '$appointment_attendees',
},
{
$lookup: {
          from: 'users',
          localField: 'appointment_attendees.developer_id',
          foreignField: '_id',
          as: 'developer_details',
        },
      },
      {
        $group: {
          _id: '_id',
          manager_id: {
            $first: '$manager_id',
},
title: {
$first: '$title',
},
description: {
$first: '$description',
},
appointment_date: {
$first: '$appointment_date',
},
createdAt: {
$first: '$createdAt',
},
modifiedAt: {
$first: '$modifiedAt',
},
appointment_attendees: {
$push: {
              _id: '$appointment_attendees.\_id',
developer_id: '$appointment_attendees.developer_id',
              createdby: '$appointment_attendees.createdby',
status: '$appointment_attendees.status',
              developer_email: {
                $first: '$developer_details.email',
},
developer_firstname: {
$first: '$developer_details.firstname',
},
developer_lastname: {
$first: '$developer_details.lastname',
},
},
},
},
},
{
$lookup: {
          from: 'users',
          localField: 'manager_id',
          foreignField: '_id',
          as: 'manager_details',
        },
      },
      {
        $addFields: {
          manager_firstname: { $first: '$manager_details.firstname' },
manager_lastname: { $first: '$manager_details.lastname' },
manager_email: { $first: '$manager_details.email' },
},
},
{
$project: {
manager_details: 0,
},
},
]);
