# POC-MC-COMMUNICATION

This is a proof of concept for the communication between two microservices: a client one server.

This project is accessible via https://poc-isc.gridexx.fr/excuse.

It uses Typescript, Node.js, Express.js and Avro over TCP.

## Routes

 An excuse is a JSON object with the following structure:
```json
{
    "id": "string",
    "excuse": "string",
    "category": "string"
}
```

Excuse are based on categories. The following categories are available:
- `family` 
- `office` 
- `children` 
- `college` 
- `party` 
- `funny` 
- `gaming`  
- `developers` 
- `unbelievable`
  
The excuse API has the following routes:

- GET `/excuse`: returns a list of excuses.
  - `/` returns a random excuse.
  - `/:n` returns nth random excuses.
  - `/id/:id` returns the excuse by its id.
  - `/category/:category` returns a random excuse from the given category.
  - `/category/:category/:n` returns nth random excuse from the given category.
- GET `/health`: returns the health status of the service.
  - `ready` returns the readiness status of the service.
  - `alive` returns the alive status of the service.

## Quick start

To run the project, you need to have installed [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/).

Then, you can check the documentation inside the `client` and `server` folders.

## Deploy it

Fist copy this repository inside your server.

Then, launch the following commands:

```bash
docker-compose up
```

Finally, to access the client over internet, you need to create a reverse proxy request to the server.