import * as dotenv from 'dotenv'
dotenv.config();

export const generateLink = ({page, id, token}) => {
  return `${process.env.NODE_CLIENT_URL}/${page}/${id}/${token}`;
};

