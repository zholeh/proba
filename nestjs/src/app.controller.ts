import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { PromInstanceCounter, InjectCounterMetric, CounterMetric, PromMethodCounter } from '@digikare/nestjs-prom';
import { PromService } from '@digikare/nestjs-prom/dist/prom.service';

@PromInstanceCounter
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    @InjectCounterMetric('index_counter') private readonly _counterMetric: CounterMetric,
    private readonly promService: PromService,
    ) {}

  @Get()
  @PromMethodCounter()
  getHello(): Observable<string> {
    const counterMetric = this.promService.getCounterMetric('test_on_the_fly');
    counterMetric.inc(1);
    this._counterMetric.inc(1, new Date());
    return this.appService.getHello();
  }
}
