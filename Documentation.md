# senexcare application - GDSC University of Jos

## Introduction

  The goal of this application is to make it possible for elderly people to manage thier health effectively using some google technologies. the core features of this application are:
  
  1. Register ✅
  2. Login✅
  3. chat integration with Openai✅
  4. Profile creation on Registration ✅
  5. Profile update ✅
  6. Emergencies with map - Not yet
  7. Monitoring Health activity with dashboard✅
  8. Scheduling of Health events✅


## Getting Started

To use this application, you will have to signin first and be authenticated before futher operations are performed.
Ensuring that the server is up and running...

 - `nodemone ./src/index.js` will start the server and connect to the mongodb cluster
 - `https://senexcare.onrender.com/auth/google` will redirect you the the auth page to signin
 
 **NOTE** the application is still within the testing face
  - use the email: `senexcaretestuser@gmail.com` and password: `SENEXCAREtestuser1~` to singin


## User Interface Overview:

Find the interface design [here](https://www.figma.com/file/ArEFbX9lFjbjFvz8enEitp/senexCare?type=design&node-id=0%3A1&mode=design&t=cNox61okeIDuMvXw-1)

The design provides a user friendly interface which allows a remarkable user experience.


## Managing Schedules:

The application allows for users to be able to schedule medical appointments or set reminders.

## Finding Emergency Centers:

Theres is an emegency page where a googles map is embedded into the application. how it works is that, it finds the user current location and search 500km from that location any health center[clinics or haspitals] available.

_Note_: This featues isnt added entirely for now!!

## Accessibility Features:

Within this application also, there is a chat room available where users can access openai features. this enables users ask any relevant question about thier health.


## Technologies incoporated:

- openai
- Google Maps
- Google OAuth2client with passport authentication
- Google Calendar

## Privacy Information:

This will access 5 different services:
- The generals info captued within the public scope
- users birthday information
- google calender