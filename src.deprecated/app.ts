import express from "express";
import config from "./config";
import apolloServer from "./graphql";
import createDbConnection from "./database";

const { port, database } = config;

const app = express();

const start = async (port: number): Promise<void> => {
  (await apolloServer()).applyMiddleware({ app, path: "/graphql" });
  // await createDbConnection(database as ConnectionOptions);

  return new Promise<void>((resolve) => {
    app.listen(port, async () => {
      console.log(`Application listening at port ${port}`);
      resolve();
    });
  });
};

start(port);

// async function main() {
//   const wallets = await prisma.wallet.findMany({
//     include: {
//       transactions: true,
//       paymentMethods: true,
//     },
//   });
//   console.log(wallets);
//   // const res = await prisma.wallet.create({
//   //   data: {
//   //     ownerId: "provider-001",
//   //   },
//   // });
//   // console.log(res);
// }

// main()
//   .catch((e) => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
