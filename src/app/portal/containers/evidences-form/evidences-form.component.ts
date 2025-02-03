import {
  Component,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { EvidencesService } from '../../services/evidences.service';
import { DeadlineService } from '../../services/deadline.service';
import { ConstancyComponent } from '../constancy/constancy.component';

declare var $: any;

interface Choice {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-evidences-form',
  templateUrl: './evidences-form.component.html',
  styleUrls: ['./evidences-form.component.css'],
  providers: [ConstancyComponent],
})
export class EvidencesFormComponent implements OnInit {
  @Input() props!: {
    activity_id: number | null;
    evidence_id: number | null;
    evidence_type_id: number | null;
    evidence_name: string | null;
    evidence_type: string | null;
    evidence_file: string;
    evidence_url: string | null;
    add_evidences: boolean;
    validate_evidences: boolean;
    evidence_status: string | null;
    evidence_observation: string | null;
  };
  @ViewChild('modal_evidences') modal_evidences!: ElementRef;
  @ViewChild('buttonClose') buttonClose!: ElementRef;
  user_group = '';

  evidence_form = new FormGroup({
    evidence_file: new FormControl(''),
  });

  apiURL: string = environment.apiURL;
  data: any = {};

  evidence_status: Choice[] = [
    { value: 'INC', viewValue: 'Incompleto' },
    { value: 'REJECT', viewValue: 'Rechazado' },
    { value: 'OK', viewValue: 'Aprobado' },
  ];

  constructor(
    private evidences: EvidencesService,
    private constansy: ConstancyComponent,
    private deadline: DeadlineService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        this.modal_evidences &&
        e.target === this.modal_evidences.nativeElement
      ) {
        this.clear();
      }
    });
  }

  ngOnInit(): void {
    if (localStorage['group'] == 'admin') {
      //agregar que los revisores tambien puedan ver todo pero no modificar
      this.user_group = 'admin';
    } else if (localStorage['group'] == 'reviewer') {
      this.user_group = 'reviewer';
    } else if (localStorage['group'] == 'representative') {
      this.user_group = 'representative';
    }
  }

  onFileChange(e: any) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = 'application/pdf';
    let reader = new FileReader();
    if (!file.type.match(pattern)) {
      this.toastr.warning('Formato invalido.');
      this.clear();
      return;
    }

    reader.onload = () => {
      (this.evidence_form.get('evidence_file') as FormControl).setValue(
        reader.result as string
      );
    };
    reader.readAsDataURL(file);
  }

  save_evidence() {
    event?.stopImmediatePropagation();
    if (this.props.evidence_type != 'PDF') {
      (this.evidence_form.get('evidence_file') as FormControl).setValue('');
    }

    const formData = new FormData();
    formData.append('name', String(this.props.evidence_url));
    formData.append(
      'evidence_file',
      (this.evidence_form.get('evidence_file') as FormControl).value
    );
    formData.append('evidence_status', String(this.props.evidence_status));

    formData.forEach((value, key) => {
      if (key == 'evidence_file') {
        if (this.props.evidence_type != 'PDF') {
          this.data[key] = null;
        } else {
          this.data[key] = value;
        }
      } else {
        this.data[key] = value;
      }
    });

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

    this.evidences
      .editEvidence(Number(this.props.evidence_id), JSON.stringify(this.data))
      .subscribe(
        (res) => {
          $.unblockUI();
          this.toastr.success('Evidencia agregada correctamente.');
          this.click_button_clear();
          window.location.reload();
        },
        (error) => {
          let errors = error['error'];
          for (let e in errors) {
            this.toastr.error(errors[e], 'Error!');
          }
          $.unblockUI();
          this.click_button_clear();
        }
      );
  }

  save_evidence_status() {
    this.data['evidence_status'] = String(this.props.evidence_status);
    this.data['observation'] = String(this.props.evidence_observation);

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

    this.evidences
      .editValidateEvidence(
        Number(this.props.evidence_id),
        JSON.stringify(this.data)
      )
      .subscribe(
        (res: any) => {
          $.unblockUI();
          this.toastr.success('Estatus de evidencia modificado correctamente.');
          if (res.status == 'OK') {
            this.constansy.createCertificate(Number(this.props.activity_id));
            this.toastr.success(res.message);
          }
          this.click_button_clear();
          //window.location.reload();
        },
        (error) => {
          let errors = error['error'];
          for (let e in errors) {
            this.toastr.error(errors[e], 'Error!');
          }
          $.unblockUI();
          this.click_button_clear();
        }
      );
  }

  clear() {
    (this.evidence_form.get('evidence_file') as FormControl).setValue('');
  }

  click_button_clear() {
    let el: HTMLElement = this.buttonClose.nativeElement;
    el.click();
  }
}
