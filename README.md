# Rogémon!

[![Netlify Status](https://api.netlify.com/api/v1/badges/eec5e0ed-8028-4ef4-b614-0acdda16ac55/deploy-status)](https://app.netlify.com/sites/rogemon/deploys)

## Update Cards

The cards are served as JSON files in _client/src/assets/collections_, to update from https://github.com/marcelpanse/tcg-pocket-collection-tracker/tree/main/frontend/assets/cards at the moment.

## Local Development Environment

![image](https://github.com/user-attachments/assets/fbb87518-d1c0-4aa5-bff9-19e2d011633e)

There is a _rogemon.code-workspace_ and _.devcontainer_ config for **VSCode**.

![image](https://github.com/user-attachments/assets/4e4224d9-8f48-4764-8329-877846ebaaf9)

Build and open the project in **Dev Containers**.

![image](https://github.com/user-attachments/assets/b338ec45-d0ab-4637-9cc1-42745eec7ffa)

After a few minutes of configuring, the editor will run the `npm run dev` task and serve the **Vue _client_** at [localhost:5173](http://localhost:5173).

![image](https://github.com/user-attachments/assets/7a842b8a-c7be-41f3-9226-2424123b445f)

It also starts the **Express _api_** at [localhost:3000/api](http://localhost:3000/api)

![image](https://github.com/user-attachments/assets/e3d158c0-8f9a-4d60-a203-60839e18e391)

The development **MongoDB** runs at [mongodb://localhost:27017](https://www.youtube.com/watch?v=dQw4w9WgXcQ), and **Vitest** is available for testing.