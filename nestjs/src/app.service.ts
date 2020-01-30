import { Injectable } from "@nestjs/common";
import { Md5 } from "ts-md5/dist/md5";
import { readFile } from "fs";
import { Observable, Subscriber } from "rxjs";
import { worker } from "cluster";

@Injectable()
export class AppService {
  getHello(): Observable<string> {
    return new Observable((subscriber: Subscriber<string>) => {
      readFile("../mock/test.jpg", (err, data) => {
        if (err) {
          subscriber.error(err);
        } else {
          const md5: Md5 = new Md5();
          const res = md5.appendByteArray(data).end();
          subscriber.next("Have a nice one you too!" + res + '. Worker: ' + worker.id);
          subscriber.complete();
        }
      });
    });

    // (resolve, reject) => {
    //   readFile("../mock/test.jpg", (err, data) => {
    //     const md5: Md5 = new Md5();
    //     const res = md5.appendByteArray(data).end();
    //     return "Have a nice one you too!" + res;
    //   }
    // })
    // return 'Hello World!';
  }
}
