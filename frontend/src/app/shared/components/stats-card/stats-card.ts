import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.css',
})
export class StatsCard {
  // --- Component Inputs ---
  title = input.required<string>();
  value = input.required<string | number>();
  icon = input<string>();
  description = input<string>();
  isLoading = input<boolean>(false);

  // --- Component State ---
  /**
   * Checks if the value is a number or a string that can be parsed into a finite number.
   * This allows numeric strings (like "42.5") to be styled as numbers. This is a computed
   * signal for performance, re-evaluating only when the `value` input changes.
   */
  isNumeric = computed(() => {
    const val = this.value();
    if (typeof val === 'number') return true;
    // Check if it's a string that represents a finite number
    if (typeof val === 'string') return !isNaN(parseFloat(val)) && isFinite(Number(val));
    return false;
  });

  /**
   * A computed signal that formats the main value.
   * If the value is a string, it's converted to title case.
   * If it's a number, it's returned as is.
   */
  formattedValue = computed(() => {
    const val = this.value();
    if (this.isNumeric() || typeof val !== 'string') return val;

    return val.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  });
}
