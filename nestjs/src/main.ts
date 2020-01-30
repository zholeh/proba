import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { isMaster, fork, worker } from "cluster";

if (isMaster) {
  for (let index = 0; index < 2; index++) {
    fork();
  }
} else {
  const bootstrap = async function () {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000, () => {
      console.info("Hi there from worker", worker.id);
    });
  }
  bootstrap();
}
