import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivitiesService } from '../../services/activities.service';

declare var $: any;

@Component({
  selector: 'app-total-attendees-form',
  templateUrl: './total-attendees-form.component.html',
  styleUrls: ['./total-attendees-form.component.css']
})
export class TotalAttendeesFormComponent implements OnInit {
  @Input() props!: {
    activity: any | null
  };

  activity_form = new FormGroup({
    numbers_total_attendees: new FormControl('0', [
      Validators.maxLength(3),
      Validators.pattern('^[0-9]*$'),
    ]),
  });

  data: any = {};

  constructor(
    private activities: ActivitiesService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.activity_form.setValue({numbers_total_attendees: this.props.activity.numbers_total_attendees});
  }

  save_numbers_total_attendees(){
    this.data['numbers_total_attendees'] = (this.activity_form.get('numbers_total_attendees') as FormControl).value;

    $.blockUI({
      message: '<i class="icon-spinner4 spinner"></i>',
      overlayCSS: {
        backgroundColor: '#1b2024',
        opacity: 0.8,
        zIndex: 1200,
        cursor: 'wait',
      },
      css: {
        border: 0,
        color: '#fff',
        padding: 0,
        zIndex: 1201,
        backgroundColor: 'transparent',
      },
    });

    this.activities.partialUpdateActivity(Number(this.props.activity.id), JSON.stringify(this.data)).subscribe(
      (res) => {
        $.unblockUI();
        this.toastr.success('Numero de asistentes reales modificados correctamente.');
        window.location.reload();
      },
      (error) => {
        let errors = error['error'];
        for (let e in errors) {
          this.toastr.error(errors[e], 'Error!');
        }
        $.unblockUI();
      }
    )


  }

}
