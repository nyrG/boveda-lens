import { Component, OnDestroy, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { RecordStateService } from '../../../../shared/services/record-state.service';
import { HeaderStateService } from '../../../../layout/services/header-state.service';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './patient-detail.html',
  styleUrl: './patient-detail.css',
})
export class PatientDetail implements OnDestroy {
  private route = inject(ActivatedRoute);
  private recordState = inject(RecordStateService);
  private headerState = inject(HeaderStateService);

  // Fetch the record based on the 'id' route parameter
  record = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.recordState.fetchRecordById(id);
      })
    ),
  );

  constructor() {
    // Set the initial title and hide the filter button
    this.headerState.setBreadcrumbs([{ text: 'Records', link: '/records' }]);
    this.headerState.setShowFilterButton(false);

    // Update the header title when the record data is loaded
    effect(() => {
      const patientName = this.record()?.name;
      if (patientName) {
        this.headerState.setBreadcrumbs([{ text: 'Records', link: '/records' }, { text: patientName }]);
      }
    });
  }

  ngOnDestroy(): void {
    // Reset the title when leaving the component. The Records page will set its own title.
    this.headerState.setTitle('Records');
  }
}
