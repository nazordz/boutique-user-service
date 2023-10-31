import dotenv from "dotenv";
dotenv.config();

export function getEnv(key: string, defaultValue?: string) {
  try {
    const value = process.env[key];
    if (value == undefined) {
      if (defaultValue) {
        return defaultValue;
      } else {
        throw new Error(`${key} hasn't declared`);
      }
    }
    return value;
  } catch (error) {
    if (defaultValue) {
      return defaultValue;
    } else {
      console.log(error);
      throw new Error(`${key} hasn't declared`);
    }
  }
}
