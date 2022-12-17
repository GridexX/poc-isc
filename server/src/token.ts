require("dotenv").config();
import axios from "axios";

const STS_PORT = process.env.STS_PORT || 3001;
const HOST_STS = process.env.HOST_STS || "localhost";

//Save a list of verified clients for each use
const verifiedClients: {client: string; token: string}[] = [];

export const isTokenValidForClient = async(token: string, client: string, logger: any) => {
  const result = await axios.post(`http://${HOST_STS}:${STS_PORT}/verify/${token}`)
    .then( ({status}) => {

      logger.info('Status: '+status)
      // con.end();
      if(status !== 204){
        //Close the connection if the token is invalid
        logger.error('Invalid Token');
        const error = 'Invalid Token';
        return {valid: false, error};
      } else {
        logger.error('valid Token');
        //Add the client to the list of verified clients
        verifiedClients.push({client, token});
        return {valid: true, error: undefined};
      }
    })
    //Catch properly the errors
    .catch(function (error) {
      logger.error(error);
    })
  return {valid: result?.valid || false, error: result?.error??"undefined error"};
} 

export const isClientVerified = (token: string | null, client: string) => {
  if(!token) return false;
  return verifiedClients.indexOf({client, token}) > -1;
}