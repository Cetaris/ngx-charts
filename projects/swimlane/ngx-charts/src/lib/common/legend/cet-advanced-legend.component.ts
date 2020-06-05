import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { trimLabel } from '../trim-label.helper';
import { formatLabel } from '../label.helper';

@Component({
  selector: 'cet-charts-advanced-legend',
  template: `
    <div class="cet-advanced-pie-legend">
      <div
        *ngFor="let legendItem of legendItems; trackBy: trackBy"
        tabindex="-1"
        class="cet-legend-item"
        (click)="select.emit(legendItem.data)"
      >
        <div class="cet-legend-item-dot" [style.background-color]="legendItem.color"></div>
        <div class="cet-legend-item-label">
          {{ legendItem.displayLabel }}
          <span class="cet-legend-item-value">({{ legendItem.value }})</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./cet-advanced-legend.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CetAdvancedLegendComponent implements OnChanges {
  @Input() data;
  @Input() colors;
  @Input() label: string = 'Total';

  @Output() select: EventEmitter<any> = new EventEmitter();

  legendItems: any[] = [];
  total: number;
  roundedTotal: number;

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  getTotal(): number {
    return this.data.map(d => d.value).reduce((sum, d) => sum + d, 0);
  }

  update(): void {
    this.total = this.getTotal();
    this.roundedTotal = this.total;

    this.legendItems = this.getLegendItems();
  }

  getLegendItems(): any {
    return this.data.map(d => {
      const label = formatLabel(d.name);
      const value = d.value;
      const color = this.colors.getColor(label);
      const percentage = this.total > 0 ? (value / this.total) * 100 : 0;
      const formattedLabel = label;

      return {
        _value: value,
        data: d,
        value,
        color,
        label: formattedLabel,
        displayLabel: trimLabel(formattedLabel, 20),
        origialLabel: d.name,
        percentage: percentage.toLocaleString()
      };
    });
  }

  trackBy(item) {
    return item.formattedLabel;
  }
}
