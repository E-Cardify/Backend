require("dotenv/config");

export const CONSOLE_LOG_DIVIDER = () => {
  console.log("----------");
};

const validateEnvVariables = (variable: string) => {
  CONSOLE_LOG_DIVIDER();

  const variableData = process.env[variable];

  if (!variableData) {
    console.log(
      `ERROR: Variable ${variable} not defined in your env config file`
    );
    process.exit(1);
  }

  console.log(`${variable}: ${variableData}`);
  CONSOLE_LOG_DIVIDER();
  return variableData;
};

const ENVIRONMENT = validateEnvVariables("ENVIRONMENT");
const EMAIL_PASSWORD = validateEnvVariables("EMAIL_PASSWORD");
const MONGO_URI = validateEnvVariables("MONGO_URI");
const PORT = validateEnvVariables("PORT");
const REFRESH_TOKEN_SECRET = validateEnvVariables("REFRESH_TOKEN_SECRET");
const JWT_SECRET = validateEnvVariables("JWT_SECRET");
const VERIFICATION_TOKEN_SECRET = validateEnvVariables(
  "VERIFICATION_TOKEN_SECRET"
);
const ORIGIN_URL = validateEnvVariables("ORIGIN_URL");
const AI_MODEL = validateEnvVariables("AI_MODEL");
const CLOUDINARY_CLOUD_NAME = validateEnvVariables("CLOUDINARY_CLOUD_NAME");
const CLOUDINARY_API_KEY = validateEnvVariables("CLOUDINARY_API_KEY");
const CLOUDINARY_API_SECRET = validateEnvVariables("CLOUDINARY_API_SECRET");

export {
  ENVIRONMENT,
  EMAIL_PASSWORD,
  MONGO_URI,
  PORT,
  REFRESH_TOKEN_SECRET,
  JWT_SECRET,
  VERIFICATION_TOKEN_SECRET,
  ORIGIN_URL,
  AI_MODEL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
};
