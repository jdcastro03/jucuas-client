import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { ConstancyService } from '../../services/constancy.service';
import { ToastrService } from 'ngx-toastr';
import { ActivitiesService } from '../../services/activities.service';
import { ActivatedRoute } from '@angular/router';


(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
declare var $: any;

@Component({
  selector: 'app-constancy',
  templateUrl: './constancy.component.html',
  styleUrls: ['./constancy.component.css']
})
export class ConstancyComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective|undefined;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject<ADTSettings>();

  months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
  dedicado: string = '';
  tact: string = '';
  title: string = '';
  file_content: string = '';
  data: any = {};
  data_pdf: any = {};
  base: any = '';
  fecha: string = '';
  year: string = '';
  code: string | null = null;
  validate_qr: boolean = false;
  validate_qr_data: any = '';

  constructor(
    private constansy: ConstancyService,
    private activities: ActivitiesService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.dtOptions = {
      language: {
        url: '//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json',
      },
    };
   }

  ngOnInit(): void {
    this.code = this.route.snapshot.paramMap.get('code');
    this.data['data'] = this.code;
    this.verify_qr();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public createCertificate(activity_id:Number) {
    this.data['activity_id'] = activity_id
    this.constansy.pyjwt_generator(JSON.stringify(this.data)).subscribe(
      (res:any) => {
        this.data['data'] = "http://juc.uas.edu.mx/portal/constancy/" + res['message']
        this.qr_generator();
      },
      (error) => {
        let errors = error['error'];
        for (let e in errors) {
          this.toastr.error(errors[e], 'Error!');
        }
      }
    )
  }
  qr_generator(){
    this.constansy.qr_generator(JSON.stringify(this.data)).subscribe(
      (res:any) => {
        this.base = res['message'];
        this.activityConstansy()
      },
      (error) => {
        let errors = error['error'];
        for (let e in errors) {
          this.toastr.error(errors[e], 'Error!');
        }
      }
    )

  }

  verify_qr(){
    this.constansy.pyjwt_verify_qr(JSON.stringify(this.data)).subscribe(
      (res:any) => {
        this.validate_qr = true;
        this.validate_qr_data = res['data'];
        const format = 'dd-MM-yyyy';
        const locale = 'en-US';
        this.validate_qr_data['Date'] = formatDate(String(this.validate_qr_data['Date activity']), format, locale);
      },
      (error) => {
        let errors = error['error'];
        for (let e in errors) {
          this.toastr.error(errors[e], 'Error!');
        }
      }
    )
  }

  createPdf(){
    const pdfDefinition: any ={
      content: [
        {
          image: this.file_content,
          width: 600,
          absolutePosition: { x: 0, y: 0 }
        },
        {text:[{text: this.dedicado.toString()+'\n',fontSize:17, alignment: 'center'}
           ,{text:
            'A: ___________________________________________________\n\n', fontSize: 17, bold:true },
            this.title + ' "'+ this.tact.toString(),
            '" en el marco de la ',
            {text: 'Jornada Universitaria del Conocimiento UAS '+this.year+', ', fontSize: 12, bold: true},
            {text: this.fecha, fontSize: 12, bold: false}
            ,
          ],
          margin: [50, 408],
          alignment: 'justify'
        },
        {
          image: 'data:image/jpeg;base64,' + this.base,
          width: 90,
          absolutePosition: { x: 435, y: 640 }
      }
      ]
    }
    const pdf = pdfMake.createPdf(pdfDefinition);
  pdf.open()

  pdf.getBase64((base64 => {
    this.save_pdf(base64);
    this.dedicado = '';
  }))

  }

  activityConstansy(){
    this.constansy.activityConstansy(JSON.stringify(this.data)).subscribe(
      (res:any) => {
        this.dedicado = res['message'].presenter.full_name_academic;
        this.title = res['message'].type.title;
        this.tact = res['message'].name;
        let start = res['message'].edition.date_edition_start;
        let end = res['message'].edition.end_date_of_the_edition;
        let start_day = start.substring(8,10)
        let start_month = start.substring(5,7)
        let end_day = end.substring(8,10)
        let end_month = end.substring(5,7)
        let year = start.substring(0,4);
        this.year = year;
        console.log(res)
        this.fecha = 'llevada a cabo del '+start_day+' de '+this.months[Number(start_month)-1]+' al '+end_day+' de '+this.months[Number(end_month)-1]+' de '+year+'. ';
        this.fecha = 'llevada a cabo del '+start_day+' de '+this.months[Number(start_month-1)]+' al '+end_day+' de '+this.months[Number(end_month-1)]+' de '+year+'. ';
        this.file_content = res['message'].edition.file
        for (const key in res['message'].co_presenter) {
          if (Object.prototype.hasOwnProperty.call(res['message'].co_presenter, key)) {
            const element = res['message'].co_presenter[key];
            if (Number(key) < res['message'].co_presenter.length - 1 ) {
              this.dedicado += ', ' + element.full_name_academic
            } else {
              this.dedicado += ' y ' + element.full_name_academic
            }
          }
        }
        
        this.createPdf()
      },
      (error) => {
        let errors = error['error'];
        for (let e in errors) {
          this.toastr.error(errors[e], 'Error!');
        }
      }
    )
  }

  save_pdf(base64: string){
    //'data:application/pdf;base64,' +
    this.data_pdf['certificate_file'] = base64;

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

    this.activities.partialUpdateSavePDFActivity(Number(this.data['activity_id']), JSON.stringify(this.data_pdf)).subscribe(
      (res) => {
        $.unblockUI();
        this.toastr.success('PDF de la Constancia guardada correctamente.');
        this.sendCertificateForEmail();
        //window.location.reload();
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

  sendCertificateForEmail(){
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

    this.constansy.send_certificate(JSON.stringify(this.data)).subscribe(
      (res) => {
        $.unblockUI();
        this.toastr.success('Constancia enviada por correo correctamente.');
        //window.location.reload();
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
