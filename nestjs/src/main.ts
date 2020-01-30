import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { isMaster, fork, worker } from "cluster";

if (isMaster) {
  for (let index = 0; index < 1; index++) {
    fork();
  }
} else {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000, () => {
      console.info("Hi there from worker", worker.id);
    });
  }
  bootstrap();
}
