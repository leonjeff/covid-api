# Welcome to BoostUp Covid 19 App!

Hi! This is an api for BoostUp histogram visualization app!

## Requirements

- Node lts version preferably

## Get Started

- git clone this repo
- npm install
- node app.js
- You can check the values returned in the api endpoints from the web browser or using an app like postman usin the url base http://localhost:3030/
- The available endpoints are :
  - http://localhost:3030/states
  - http://localhost:3030/cases/dates/{location}/{daterange}
  - The location param can be the value "all" for the entire US or a single state iso code such as "CA" for california
  - The daterange param can be "all" for the whole time, "7" for the last seven days or "30 for the last 30 days"
