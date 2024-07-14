import { AdminUser } from "src/modules/User/Models/User.js";
import { DataSource } from "typeorm";
import type { BaseDataSourceOptions } from "typeorm/data-source/BaseDataSourceOptions.js";

export const generatePostgresDbConnect =
  ({
    dataSource,
    entities,
    secretName,
    secretKey,
    schema = "public",
    isReader,
    showMoreLogs,
    credential
  }: {
    dataSource: DataSource;
    secretName?: string;
    secretKey?: string;
    entities: BaseDataSourceOptions["entities"];
    schema?: string;
    isReader?: boolean;
    showMoreLogs?: boolean;
    credential?: {
      host: string;
      username: string;
      password: string;
      port: string;
      database: string;
    };
  }) =>
  async () => {
    try {
      if (!dataSource) {
        const { host, username, password, port, database } = JSON.parse({} as any);

        dataSource = new DataSource({
          type: "postgres",
          schema,
          host: isReader ? host.replace(".cluster-", ".cluster-ro-") : host,
          port,
          username,
          password,
          database,
          synchronize: false,
          logging: showMoreLogs ? ["error", "query", "schema"] : ["error"],
          logger: "advanced-console",
          entities
        });
        await dataSource.initialize();
      }
      return dataSource;
    } catch (e) {
      throw e;
    }
  };

export let dataSource: DataSource;

export const dbConnect = async () => {
  if (!dataSource) {
    dataSource = await generatePostgresDbConnect({
      dataSource,
      entities: [AdminUser],
      secretKey: "AURORA_CONFIG"
    })();
  }
};
