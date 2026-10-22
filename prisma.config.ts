import { env } from "./config/envConfig.js";
// dotenv.config();
export default {
  schema: "prisma/schema.prisma",
  datasource: {
    url: env.databaseUrl,
  },
};