import { Sequelize } from "sequelize";
import { getEnv } from "./env";

const sequelize = new Sequelize(getEnv('DB_NAME'), getEnv('DB_USER'), getEnv('DB_PASSWORD', ''), {
    host: getEnv('DB_HOST'),
    dialect: 'postgres',
    port: Number(getEnv('DB_PORT')),
})

export default sequelize;