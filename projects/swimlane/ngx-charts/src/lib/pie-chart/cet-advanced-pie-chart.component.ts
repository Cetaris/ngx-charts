import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { ColorHelper } from '../common/color.helper';
import { BaseChartComponent } from '../common/base-chart.component';
import { DataItem } from '../models/chart-data.model';

@Component({
  selector: 'cet-charts-advanced-pie-chart',
  template: `
    <div [style.width.px]="width" [style.height.px]="height">
      <div class="cet-advanced-pie-wrapper">
        <div class="chart">
          <ngx-charts-chart [view]="[200, 200]" [showLegend]="false" [animations]="animations">
            <svg:g [attr.transform]="transform" class="pie chart">
              <svg:g
                ngx-charts-pie-series
                [colors]="colors"
                [series]="results"
                [innerRadius]="innerRadius"
                [activeEntries]="activeEntries"
                [outerRadius]="outerRadius"
                [gradient]="gradient"
                [tooltipDisabled]="tooltipDisabled"
                [tooltipTemplate]="tooltipTemplate"
                [tooltipText]="tooltipText"
                (select)="onClick($event)"
                (activate)="onActivate($event)"
                (deactivate)="onDeactivate($event)"
                [animations]="animations"
              ></svg:g>
            </svg:g>
          </ngx-charts-chart>
        </div>
        <div class="legend">
          <cet-charts-advanced-legend
            [data]="results"
            [colors]="colors"
            [label]="label"
            (select)="onClick($event)"
            (activate)="onActivate($event)"
            (deactivate)="onDeactivate($event)"
          ></cet-charts-advanced-legend>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../common/base-chart.component.scss', './cet-advanced-pie-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CetAdvancedPieChartComponent extends BaseChartComponent {
  @Input() activeEntries: any[] = [];
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipText: any;
  @Input() label: string = 'Total';

  @Output() select: EventEmitter<any> = new EventEmitter();
  @Output() activate: EventEmitter<any> = new EventEmitter();
  @Output() deactivate: EventEmitter<any> = new EventEmitter();

  @ContentChild('tooltipTemplate') tooltipTemplate: TemplateRef<any>;

  data: any;
  domain: any[];
  outerRadius: number;
  innerRadius: number;
  transform: string;
  colors: ColorHelper;

  update(): void {
    super.update();

    this.formatDates();

    this.domain = this.getDomain();
    this.setColors();

    const xOffset = 200 / 2;
    const yOffset = this.height / 2;

    this.outerRadius = 200 / 2;
    this.innerRadius = this.outerRadius * 0.75;

    this.transform = `translate(${xOffset} , ${yOffset})`;
  }

  getDomain(): any[] {
    return this.results.map(d => d.label);
  }

  onClick(data: DataItem) {
    this.select.emit(data);
  }

  setColors(): void {
    this.colors = new ColorHelper(this.scheme, 'ordinal', this.domain, this.customColors);
  }

  onActivate(item, fromLegend = false) {
    item = this.results.find(d => {
      if (fromLegend) {
        return d.label === item.name;
      } else {
        return d.name === item.name;
      }
    });

    const idx = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value && d.series === item.series;
    });
    if (idx > -1) {
      return;
    }

    this.activeEntries = [item, ...this.activeEntries];
    this.activate.emit({ value: item, entries: this.activeEntries });
  }

  onDeactivate(item, fromLegend = false) {
    item = this.results.find(d => {
      if (fromLegend) {
        return d.label === item.name;
      } else {
        return d.name === item.name;
      }
    });

    const idx = this.activeEntries.findIndex(d => {
      return d.name === item.name && d.value === item.value && d.series === item.series;
    });

    this.activeEntries.splice(idx, 1);
    this.activeEntries = [...this.activeEntries];

    this.deactivate.emit({ value: item, entries: this.activeEntries });
  }
}
