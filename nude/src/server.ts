import { createServer } from "http";
import { readFile } from "fs";
import { isMaster, fork, worker } from "cluster";
import { Md5 } from "ts-md5/dist/md5";

if (isMaster) {
  for (let index = 0; index < 1; index++) {
    fork();
  }
} else {
  const http = createServer((request, response) => {
    readFile("../mock/test.jpg", (err, data) => {
      const md5: Md5 = new Md5();
      const res = md5.appendByteArray(data).end();
      response.end("Have a nice one you too!" + res + '. Worker: ' + worker.id);
    });
  });
  http.listen(3000, () => {
    console.info("Hi there from worker", worker.id);
  });
}
