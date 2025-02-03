import { Component, OnInit } from '@angular/core';
import { AdminsService } from '../../services/admin.service';
import { ActivitiesService } from '../../services/activities.service';
import {Chart, ChartTypeRegistry} from 'chart.js';
import { BlockUIService } from 'ng-block-ui';
import { User } from '../../shared/sidebar/sidebar.models';
import { AuthService } from 'src/app/auth/services/auth.service'; 
export class selector{
  value: number = 0
  text: string = ""
}

declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})



export class DashboardComponent implements OnInit {
  user: User = { username: '', first_name: '', last_name:'', origin_university:'', origin_organizational_unit:'', email: '', groups: [ { name: '' } ] }
  public UnitChart: any;
  public RegionChart: any;
  public RegionChartU: any;
  public RegionChartP: any;
  public RegionChartO: any;
  public CategoryChart: any;
  public CategoryChartU: any;
  public CategoryChartP: any;
  public CategoryChartO: any;
  public KnowledgeChart: any;
  public KnowledgeChartU: any;
  public KnowledgeChartP: any;
  public KnowledgeChartO: any;
  public PublicChart: any;
  public PublicChartU: any;
  public PublicChartP: any;
  public PublicChartO: any;
  isAdmin: boolean = false
  blockUI: boolean = false
  selectedIndex: string = ''
  regions: selector[] = [{value:0, text:"Todas"},
                      {value:1, text:"Norte"},
                      {value:2, text:"Centro-Norte"},
                      {value:3, text:"Centro"},
                      {value:4, text:"Sur"},]

  units: selector[] = [{value:0, text:"Todas"},
                      {value:1, text:"Unidad Academica - Universidad"},
                      {value:2, text:"Unidad Academica - Bachillerato"},
                      {value:3, text:"Unidad Organizacional"}]
  editions: selector [] = []
  table: selector[] = []
  //PALETA DE COLOR
  pallete = ['rgba(26,50,96,255)','rgba(69,144,184,255)','rgba(69,203,232,255)','rgba(150,159,167,255)']
  //UNIDAD ACADEMICA UNIVERSIDAD
  uau_n: selector[] = []
  uau_cn: selector[] = []
  uau_c: selector[] = []
  uau_s: selector[] = []
  //UNIDAD ACADEMICA BACHILLERATO
  uap_n: selector[] = []
  uap_cn: selector[] = []
  uap_c: selector[] = []
  uap_s: selector[] = []
  //UNIDAD ORGANIZACIONAL
  uo_n: selector[] = []
  uo_cn: selector[] = []
  uo_c: selector[] = []
  uo_s: selector[] = []
  //ACTIVIDADES POR GENERO
  h = 0
  m = 0
  //ACTIVIDADES
  activity_count_unit: any;
  activity_count_region: any;
  activity_count_region_u: any;
  activity_count_region_p: any;
  activity_count_region_o: any;
  activity_count_category: any;
  activity_count_category_u: any;
  activity_count_category_p: any;
  activity_count_category_o: any;
  activity_count_knowledge: any;
  activity_count_knowledge_u: any;
  activity_count_knowledge_p: any;
  activity_count_knowledge_o: any;
  activity_count_public: any;
  activity_count_public_u: any;
  activity_count_public_p: any;
  activity_count_public_o: any;

  region: Number = 0
  unit: Number = 0
  edition: Number = -1
barChartData: any;
  constructor(
    private myself: AdminsService,
    private activities: ActivitiesService,
    private auth: AuthService,
  ) { }
  bienvenidx:string = 'Hola';
  ngOnInit(): void {
    if (this.auth.isAuth()) {
      this.auth.currentUser().subscribe((res:any) => {
        this.user = res;
        if(this.user.groups[0].name == 'reviewer' || this.user.groups[0].name == 'admin'){
          this.isAdmin = true;
        }
        this.editions.push({value: -1, text:"Ultima"})
        this.activities.editionList().subscribe(
          (res: any) => {
            res.forEach((element: { [x: string]: any }) => {
              this.editions.push({
                value: element['id'],
                text: element['date_edition'],
              });
              this.editions[0].value=element['id']
            });
            this.estadisticas(String(this.editions[0].value))
          },
          (error) => {
          }
        );
      });
    }
    
    this.myself.getGender({}, this.myself.getHeaders()).subscribe((gender:any) => {
      if (gender.gender!=='O')
      this.bienvenidx = gender.gender === 'H'? 'Bienvenido':'Bienvenida';
    })
  }

  selector_mapper(data: any){
    let mapped_data: any[] = []
    for(let i = 0; i < data.length-1; i++){
      let temp: selector = new selector(); 
      temp.value= data[i][1]; 
      temp.text= data[i][0]; 
      mapped_data.push(temp)}
    return mapped_data
  }
  list_divider(data: any){
    let keys = []
    let values = []
    let divided_list = []
    for (let key in data) {
      if(key != "TOTAL"){
        keys.push(key)
        values.push(data[key])
      }
    }
    divided_list = [values, keys]
    return divided_list
  }

  estadisticas(id_edicion: string){
    this.myself.estadisticas(id_edicion).subscribe(
      (res: any) => {
        this.blockUI=true
        console.log(res)
        this.h = res['CANTIDAD_ACTIVIDADES_POR_GENERO']['H']
        this.m = res['CANTIDAD_ACTIVIDADES_POR_GENERO']['M']
        let u = res["CANTIDAD_ACTIVIDADES_POR_UNIDAD"]['U']
        let p = res["CANTIDAD_ACTIVIDADES_POR_UNIDAD"]['P']
        let o = res["CANTIDAD_ACTIVIDADES_POR_UNIDAD"]['O']
        this.activity_count_region = res['CANTIDAD_ACTIVIDADES_POR_REGION']
        this.activity_count_region_u = res['CANTIDAD_ACTIVIDADES_SUPERIOR']
        this.activity_count_region_p = res['CANTIDAD_ACTIVIDADES_MEDSUP']
        this.activity_count_region_o = res['CANTIDAD_ACTIVIDADES_ORG']
        this.activity_count_unit = res['CANTIDAD_ACTIVIDADES_TIPO_UNIDAD']
        this.activity_count_category = this.list_divider(res['CANTIDAD_ACTIVIDADES_TIPO_ACTIVIDAD'])
        this.activity_count_category_u = this.list_divider(res['CANTIDAD_ACTIVIDADES_TIPO_ACTIVIDAD_SUPERIOR'])
        this.activity_count_category_p = this.list_divider(res['CANTIDAD_ACTIVIDADES_TIPO_ACTIVIDAD_MEDSUP'])
        this.activity_count_category_o = this.list_divider(res['CANTIDAD_ACTIVIDADES_TIPO_ACTIVIDAD_ORG'])
        this.activity_count_knowledge = this.list_divider(res['CANTIDAD_ACTIVIDADES_AREA_CONOCIMIENTO'])
        this.activity_count_knowledge_u = this.list_divider(res['CANTIDAD_ACTIVIDADES_AREA_CONOCIMIENTO_U'])
        this.activity_count_knowledge_p = this.list_divider(res['CANTIDAD_ACTIVIDADES_AREA_CONOCIMIENTO_P'])
        this.activity_count_knowledge_o = this.list_divider(res['CANTIDAD_ACTIVIDADES_AREA_CONOCIMIENTO_O'])
        this.activity_count_public = this.list_divider(res['CANTIDAD_ACTIVIDADES_PUBLICO_DIRIGIDO'])
        this.activity_count_public_u = this.list_divider(res['CANTIDAD_ACTIVIDADES_PUBLICO_DIRIGIDO_U'])
        this.activity_count_public_p = this.list_divider(res['CANTIDAD_ACTIVIDADES_PUBLICO_DIRIGIDO_P'])
        this.activity_count_public_o = this.list_divider(res['CANTIDAD_ACTIVIDADES_PUBLICO_DIRIGIDO_O'])
        //UNIDADES ACADEMICAS UNIVERSIDAD 
        this.uau_n=this.selector_mapper(u[0]);
        this.uau_cn=this.selector_mapper(u[1]);
        this.uau_c=this.selector_mapper(u[2]);
        this.uau_s=this.selector_mapper(u[3]);
        //UNIDADES ACADEMICAS PREPARATORIA
        this.uap_n=this.selector_mapper(p[0]);
        this.uap_cn=this.selector_mapper(p[1]);
        this.uap_c=this.selector_mapper(p[2]);
        this.uap_s=this.selector_mapper(p[3]);
        //UNIDADES ORGANIZACIONALES
        this.uo_n=this.selector_mapper(o[0]);
        this.uo_cn=this.selector_mapper(o[1]);
        this.uo_c=this.selector_mapper(o[2]);
        this.uo_s=this.selector_mapper(o[3]);
        let index = 0
        this.createChart();
      },
      (error) => {

      }
    )
  }

  change_edition(event: any){
    console.log(event.target.value)
    if(event.target != null){
      this.edition = event.target.value;
      this.estadisticas(String(this.editions[Number(this.edition)].value))
    }
    console.log(this.edition)
    if(this.edition==-1){
      console.log(this.editions[this.editions.length-1].value)
      this.estadisticas(String(this.editions[this.editions.length-1].value))
    }
  }

  change_region(event: any){
    if(event.target != null){this.region = event.target.value}
    this.display_stadistics()
  }

  change_unit(event: any){
    if(event.target != null){this.unit = event.target.value}
    this.display_stadistics()
  }

  display_stadistics(){
    this.table = []
    if(this.region == 0){
      if(this.unit == 0){
        //UNIDADES ACADEMICAS UNIVERSIDAD
        this.uau_n.forEach(item =>{ this.table.push(item)});
        this.uau_cn.forEach(item =>{this.table.push(item)});
        this.uau_c.forEach(item =>{ this.table.push(item)});
        this.uau_s.forEach(item =>{ this.table.push(item)});
        //UNIDADES ACADEMICAS BACHILLERATO
        this.uap_n.forEach(item =>{ this.table.push(item)});
        this.uap_cn.forEach(item =>{this.table.push(item)});
        this.uap_c.forEach(item =>{ this.table.push(item)});
        this.uap_s.forEach(item =>{ this.table.push(item)});
        //UNIDADES ORGANIZACIONALES
        this.uo_n.forEach(item =>{ this.table.push(item)});
        this.uo_cn.forEach(item =>{this.table.push(item)});
        this.uo_c.forEach(item =>{ this.table.push(item)});
        this.uo_s.forEach(item =>{ this.table.push(item)});
      }
      if(this.unit == 1){
        //UNIDADES ACADEMICAS UNIVERSIDAD
        this.uau_n.forEach(item =>{ this.table.push(item)});
        this.uau_cn.forEach(item =>{this.table.push(item)});
        this.uau_c.forEach(item =>{ this.table.push(item)});
        this.uau_s.forEach(item =>{ this.table.push(item)});
      }
      if(this.unit == 2){
        //UNIDADES ACADEMICAS BACHILLERATO
        this.uap_n.forEach(item =>{ this.table.push(item)});
        this.uap_cn.forEach(item =>{this.table.push(item)});
        this.uap_c.forEach(item =>{ this.table.push(item)});
        this.uap_s.forEach(item =>{ this.table.push(item)});
      }
      if(this.unit == 3){
        //UNIDADES ORGANIZACIONALES
        this.uo_n.forEach(item =>{ this.table.push(item)});
        this.uo_cn.forEach(item =>{this.table.push(item)});
        this.uo_c.forEach(item =>{ this.table.push(item)});
        this.uo_s.forEach(item =>{ this.table.push(item)});
      }
    }
    if(this.region == 1){
      if(this.unit == 0){
        //UNIDADES ACADEMICAS UNIVERSIDAD
        this.uau_n.forEach(item =>{ this.table.push(item)});
        //UNIDADES ACADEMICAS BACHILLERATO
        this.uap_n.forEach(item =>{ this.table.push(item)});
        //UNIDADES ORGANIZACIONALES
        this.uo_n.forEach(item =>{  this.table.push(item)});
      }
      if(this.unit == 1){
        //UNIDADES ACADEMICAS UNIVERSIDAD
        this.uau_n.forEach(item =>{ this.table.push(item)});
      }
      if(this.unit == 2){
        //UNIDADES ACADEMICAS BACHILLERATO
        this.uap_n.forEach(item =>{ this.table.push(item)});
      }
      if(this.unit == 3){
        //UNIDADES ORGANIZACIONALES
        this.uo_n.forEach(item =>{  this.table.push(item)});
      }
    }
    if(this.region == 2){
      if(this.unit == 0){
        //UNIDADES ACADEMICAS UNIVERSIDAD
        this.uau_cn.forEach(item =>{ this.table.push(item)});
        //UNIDADES ACADEMICAS BACHILLERATOtable
        this.uap_cn.forEach(item =>{ this.table.push(item)});
        //UNIDADES ORGANIZACIONALES
        this.uo_cn.forEach(item =>{  this.table.push(item)});
      }
      if(this.unit == 1){
        //UNIDADES ACADEMICAS UNIVERSIDAD
        this.uau_cn.forEach(item =>{ this.table.push(item)});
      }
      if(this.unit == 2){
        //UNIDADES ACADEMICAS BACHILLERATO
        this.uap_cn.forEach(item =>{ this.table.push(item)});
      }
      if(this.unit == 3){
        //UNIDADES ORGANIZACIONALES
        this.uo_cn.forEach(item =>{  this.table.push(item)});
      }
    }
    if(this.region == 3){
      if(this.unit == 0){
        //UNIDADES ACADEMICAS UNIVERSIDAD
        this.uau_c.forEach(item =>{ this.table.push(item)});
        //UNIDADES ACADEMICAS BACHILLERATO
        this.uap_c.forEach(item =>{ this.table.push(item)});
        //UNIDADES ORGANIZACIONALES
        this.uo_c.forEach(item =>{  this.table.push(item)});
      }
      if(this.unit == 1){
        //UNIDADES ACADEMICAS UNIVERSIDAD
        this.uau_c.forEach(item =>{ this.table.push(item)});
      }
      if(this.unit == 2){
        //UNIDADES ACADEMICAS BACHILLERATO
        this.uap_c.forEach(item =>{ this.table.push(item)});
      }
      if(this.unit == 3){
        //UNIDADES ORGANIZACIONALES
        this.uo_c.forEach(item =>{  this.table.push(item)});
      }
    }
    if(this.region == 4){
      if(this.unit == 0){
        //UNIDADES ACADEMICAS UNIVERSIDAD
        this.uau_s.forEach(item =>{ this.table.push(item)});
        //UNIDADES ACADEMICAS BACHILLERATO
        this.uap_s.forEach(item =>{ this.table.push(item)});
        //UNIDADES ORGANIZACIONALES
        this.uo_s.forEach(item =>{  this.table.push(item)});
      }
      if(this.unit == 1){
        //UNIDADES ACADEMICAS UNIVERSIDAD
        this.uau_s.forEach(item =>{ this.table.push(item)});
      }
      if(this.unit == 2){
        //UNIDADES ACADEMICAS BACHILLERATO
        this.uap_s.forEach(item =>{ this.table.push(item)});
      }
      if(this.unit == 3){
        //UNIDADES ORGANIZACIONALES
        this.uo_s.forEach(item =>{  this.table.push(item)});
      }
    }
  }

  chart_options(id: string, title: string, type: any, data: any, labels: any, decorator: any, legend: boolean = true){
    let temp: any = new Chart(id, {
      type: type,
      data: {
        datasets: [{
          data: data,
          backgroundColor: this.pallete,
        }],
        labels: labels,
      },
      options: {
        aspectRatio:1,
        responsive: true,
        plugins: {
          legend: {
            display: legend
          },
          tooltip: {
            callbacks: {

            }
          },
          title: {
            display: true,
            text: title
        }
        }
      },
    });
    return temp;
  }

  tabActive(event: any){
    this.UnitChart=null;
    this.RegionChart=null;
    this.RegionChartU=null;
    this.RegionChartP=null;
    this.RegionChartO=null;
    this.CategoryChart=null;
    this.CategoryChartU=null;
    this.CategoryChartP=null;
    this.CategoryChartO=null;
    this.KnowledgeChart=null;
    this.KnowledgeChartU=null;
    this.KnowledgeChartP=null;
    this.KnowledgeChartO=null;
    this.PublicChart=null;
    this.PublicChartU=null;
    this.PublicChartP=null;
    this.PublicChartO=null;
    this.selectedIndex = event.index;
    if(this.selectedIndex == '0'){
      console.log(this.selectedIndex)
      this.createChart()
    }
    if(this.selectedIndex == '1'){
      console.log(this.selectedIndex)
      this.createChartRegion()
    }
    if(this.selectedIndex == '2'){
      console.log(this.selectedIndex)
      this.createChartCategory()
    }
    if(this.selectedIndex == '3'){
      console.log(this.selectedIndex)
      this.createChartKnowledge()
    }
    if(this.selectedIndex == '4'){
      console.log(this.selectedIndex)
      this.createChartPublic()
    }
  }

  createChart(){
    //RESUMEN GLOBAL DE ACTIVIDADES 
    this.UnitChart = this.chart_options("ActivityUnit",
                                        "RESUMEN GLOBAL DE ACTIVIDADES",
                                        'pie',
                                        [this.activity_count_unit['U'],
                                        this.activity_count_unit['P'],
                                        this.activity_count_unit['O']],
                                        [
                                          'Superior',
                                          'Media-Superior',
                                          'Organizacional'
                                        ],"%")
  }
  createChartRegion(){
    console.log("SI")
    //ACTIVIDADES POR UNIDAD REGIONAL
    this.RegionChart = this.chart_options("ActivityRegion",
                                        "ACTIVIDADES POR UNIDAD REGIONAL",
                                        'pie',
                                        [this.activity_count_region['N'],
                                        this.activity_count_region['CN'],
                                        this.activity_count_region['C'],
                                        this.activity_count_region['S']],
                                        [
                                          'Norte',
                                          'Centro-Norte',
                                          'Centro',
                                          'Sur'
                                        ],"%")
                                        
    this.RegionChartU = this.chart_options("ActivityRegionU",
                                        "ACTIVIDADES POR UNIDAD REGIONAL - SUPERIOR",
                                        'pie',
                                        [this.activity_count_region_u['N'],
                                        this.activity_count_region_u['CN'],
                                        this.activity_count_region_u['C'],
                                        this.activity_count_region_u['S']],
                                        [
                                          'Norte',
                                          'Centro-Norte',
                                          'Centro',
                                          'Sur'
                                        ],"%")
    this.RegionChartP = this.chart_options("ActivityRegionP",
                                        "ACTIVIDADES POR UNIDAD REGIONAL - MEDIA-SUPERIOR",
                                        'pie',
                                        [this.activity_count_region_p['N'],
                                        this.activity_count_region_p['CN'],
                                        this.activity_count_region_p['C'],
                                        this.activity_count_region_p['S']],
                                        [
                                          'Norte',
                                          'Centro-Norte',
                                          'Centro',
                                          'Sur'
                                        ],"%")
    this.RegionChartO = this.chart_options("ActivityRegionO",
                                        "ACTIVIDADES POR UNIDAD REGIONAL - ORGANIZACIONAL",
                                        'pie',
                                        [this.activity_count_region_o['N'],
                                        this.activity_count_region_o['CN'],
                                        this.activity_count_region_o['C'],
                                        this.activity_count_region_o['S']],
                                        [
                                          'Norte',
                                          'Centro-Norte',
                                          'Centro',
                                          'Sur'
                                        ],"%")
  }
  createChartCategory(){
    this.CategoryChart = this.chart_options("ActivityCategory",
                                        "ACTIVIDADES POR CATEGORIA",
                                        'bar',
                                        this.activity_count_category[0],
                                        this.activity_count_category[1],"", false)
    this.CategoryChartU = this.chart_options("ActivityCategoryU",
                                        "ACTIVIDADES POR CATEGORIA - SUPERIOR",
                                        'bar',
                                        this.activity_count_category_u[0],
                                        this.activity_count_category_u[1],"", false)
    this.CategoryChartP = this.chart_options("ActivityCategoryP",
                                        "ACTIVIDADES POR CATEGORIA - MEDIA-SUPERIOR",
                                        'bar',
                                        this.activity_count_category_p[0],
                                        this.activity_count_category_p[1],"", false)
    this.CategoryChartO = this.chart_options("ActivityCategoryO",
                                        "ACTIVIDADES POR CATEGORIA - ORGANIZACIONAL",
                                        'bar',
                                        this.activity_count_category_o[0],
                                        this.activity_count_category_o[1],"", false)
  }
  createChartKnowledge(){
    this.KnowledgeChart = this.chart_options("ActivityKnowledge",
                                        "ACTIVIDADES POR AREA DE CONOCIMIENTO",
                                        'bar',
                                        this.activity_count_knowledge[0],
                                        this.activity_count_knowledge[1],"", false)
    this.KnowledgeChartU = this.chart_options("ActivityKnowledgeU",
                                        "ACTIVIDADES POR AREA DE CONOCIMIENTO - SUPERIOR",
                                        'bar',
                                        this.activity_count_knowledge_u[0],
                                        this.activity_count_knowledge_u[1],"", false)
    this.KnowledgeChartP = this.chart_options("ActivityKnowledgeP",
                                        "ACTIVIDADES POR AREA DE CONOCIMIENTO - MEDIA-SUPERIOR",
                                        'bar',
                                        this.activity_count_knowledge_p[0],
                                        this.activity_count_knowledge_p[1],"", false)
    this.KnowledgeChartO = this.chart_options("ActivityKnowledgeO",
                                        "ACTIVIDADES POR AREA DE CONOCIMIENTO - ORGANIZACIONAL",
                                        'bar',
                                        this.activity_count_knowledge_o[0],
                                        this.activity_count_knowledge_o[1],"", false)
  }
  createChartPublic(){
    this.PublicChart = this.chart_options("ActivityPublic",
                                        "ACTIVIDADES POR PUBLICO AL CUAL VA DIRIGIDO",
                                        'bar',
                                        this.activity_count_public[0],
                                        this.activity_count_public[1],"", false)
    this.PublicChartU = this.chart_options("ActivityPublicU",
                                        "ACTIVIDADES POR PUBLICO AL CUAL VA DIRIGIDO - SUPERIOR",
                                        'bar',
                                        this.activity_count_public_u[0],
                                        this.activity_count_public_u[1],"", false)
    this.PublicChartP = this.chart_options("ActivityPublicP",
                                        "ACTIVIDADES POR PUBLICO AL CUAL VA DIRIGIDO - MEDIA-SUPERIOR",
                                        'bar',
                                        this.activity_count_public_p[0],
                                        this.activity_count_public_p[1],"", false)
    this.PublicChartO = this.chart_options("ActivityPublicO",
                                        "ACTIVIDADES POR PUBLICO AL CUAL VA DIRIGIDO - ORGANIZACIONAL",
                                        'bar',
                                        this.activity_count_public_o[0],
                                        this.activity_count_public_o[1],"", false)
  }
}
