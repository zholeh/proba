import { Injectable } from "@nestjs/common";
import { Md5 } from "ts-md5/dist/md5";
import { readFile } from "fs";
import { Observable, Subscriber } from "rxjs";
import { worker } from "cluster";
import {
  InjectCounterMetric,
  InjectGaugeMetric,
  InjectHistogramMetric,
  InjectSummaryMetric,
  CounterMetric,
  GaugeMetric,
  HistogramMetric,
  SummaryMetric
} from "@digikare/nestjs-prom";

@Injectable()
export class AppService {
  constructor(
    @InjectCounterMetric('index_counter') private readonly _counterMetric: CounterMetric,
  ) {}
  getHello(): Observable<string> {
    this._counterMetric.inc(1, new Date());
    return new Observable((subscriber: Subscriber<string>) => {
      readFile("../mock/test.jpg", (err, data) => {
        if (err) {
          subscriber.error(err);
        } else {
          const md5: Md5 = new Md5();
          const res = md5.appendByteArray(data).end();
          subscriber.next(
            "Have a nice one you too!" + res + ". Worker: " + worker.id
          );
          subscriber.complete();
        }
      });
    });
  }
}
