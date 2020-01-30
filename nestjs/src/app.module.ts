import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PromModule, MetricType, PromController } from "@digikare/nestjs-prom";
import { InboundMiddleware } from "@digikare/nestjs-prom/dist/middleware/inbound.middleware";

@Module({
  imports: [
    PromModule.forRoot({
      defaultLabels: {
        app: "v1.0.0"
      },
      useHttpCounterMiddleware: true
    }),
    PromModule.forMetrics([
      {
        type: MetricType.Counter,
        configuration: {
          name: "index_counter",
          help: "index_counter a simple counter"
        }
      }
    ])
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(InboundMiddleware)
      .exclude({
        path: "/metrics",
        method: RequestMethod.GET
      })
      .forRoutes("*");
  }
}
