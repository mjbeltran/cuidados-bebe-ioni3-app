import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// Providers
import { UserProvider } from '../../providers/user/user';

// Library
import * as moment from 'moment';
import Chart from 'chart.js';

// Utility const
const careList = {
  milk: {
    title: 'Biberones de leche',
    legend: "leche en ml (estimación)",
    chartType: 'bar'
  },
  water: {
    title: "Biberons de agua",
    legend: "agua en ml",
    chartType: 'bar'
  },
  bath: {
    title: 'Baños',
    legend: 'Baños',
    chartType: 'bar'
  },
  nappy: {
    title: 'Cambios de pañal',
    legend: 'Cambios de pañal',
    chartType: 'bar'
  },
  sleep: {
    title: 'Horas de sueño / siesta',
    legend: "sueño - duracion en horas",
    chartType: 'bar'
  },
  comment: {
    title: 'Comentarios y notas',
    legend: 'Comentarios y notas',
    chartType: 'bar'
  },
  weight: {
    title: 'Peso',
    legend: 'Peso en kg',
    chartType: 'line'
  },
  size: {
    title: 'Altura',
    legend: 'altura en cm',
    chartType: 'line'
  },
  temperature: {
    title: 'Temperatura',
    legend: '°C',
    chartType: 'line'
  },
  meal: {
    title: 'Comidas sólidas',
    legend: 'Comidas sólidas',
    chartType: 'bar'
  },
}


@IonicPage()
@Component({
  selector: 'page-display-cares',
  templateUrl: 'display-cares.html',
})
export class DisplayCaresPage {

  @ViewChild('myChart') myChart;

  careType: string;
  displayDate: number;
  timeScale: string; 

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private user: UserProvider
  ) {
    this.careType = navParams.get('careType');
    this.timeScale = 'week';
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad DisplayCaresPage');
    this.prepareData();
  }


  /********************************************************************************** */
  /* Nav and utilities */
  /********************************************************************************** */

  switchCare(careType: string) {
    this.careType = careType;
    this.prepareData();
  }

  editCare(care){
    this.navCtrl.push('EditCarePage', { care: care, careType: this.careType})
  }


  /********************************************************************************** */
  /* Getters and setters */
  /********************************************************************************** */

  getTitle() {
    return careList[this.careType].title;
  }

  setTimeScale(timeScale) {
    this.timeScale = timeScale;
    this.prepareData();
  }

  getDateinText(date) {
    return moment(date).locale('fr').format("DD/MM à HH:mm")
  }

  getDurationInText(duration) {
    return moment.duration(duration).hours() + ':' + moment.duration(duration).minutes();
  }

  getDateLimit() {
    let now = moment(Date.now());
    let dateLimit;
    switch (this.timeScale) {
      case 'day':
        dateLimit = parseInt(now.subtract(24, 'hours').format('x'));
        break;
      case 'week':
        dateLimit = parseInt(now.subtract(7, 'days').format('x'));
        break;
      case 'month':
        dateLimit = parseInt(now.subtract(1, 'M').format('x'));
        break;
      default:
        dateLimit = 0
        break;
    };
    return dateLimit
  }

  /********************************************************************************** */
  /* Manage Graph */
  /********************************************************************************** */

  prepareData() {
    let axisX: Array<any> = [];
    let axisY: Array<any> = [];
    for (let index = 0; index < this.user.currentBaby[this.careType].length; index++) {
      const element = this.user.currentBaby[this.careType][index];
      if (element.createDate > this.getDateLimit()) {
        axisX.push(moment(element.createDate).locale('fr').format('DD/MM hh:mm'));
        switch (this.careType) {
          case 'milk':
            axisY.push(element.qte);
            break;
          case 'water':
            axisY.push(element.qte);
            break;
          case 'weight':
            axisY.push(element.qte);
            break;
          case 'size':
            axisY.push(element.qte);
            break;
          case 'temperature':
            axisY.push(element.qte);
            break;
          case 'nappy':
            let value = 1;
            if (element.urine) {
              value += 1;
            }
            if (element.stool) {
              value += 1;
            }
            if (element.diarrhoea) {
              value += 1;
            }
            axisY.push(value);
            break;
          case 'comment':
            axisY.push(true);
            break;
          case 'meal':
            axisY.push(true);
            break;
          case 'bath':
            axisY.push(true);
            break;
          case 'sleep':
            let duration: number = moment.duration(element.duration).asHours();
            axisY.push(duration);
            break;
          default:
            axisY.push(true);
            break;
        }
      }
    }
    axisX = axisX.reverse();
    axisY = axisY.reverse();
    this.displayData(axisX, axisY)
  }

  displayData(axisX, axisY) {
    let myChart = new Chart(this.myChart.nativeElement, {
      type: careList[this.careType].chartType,
      data: {
        labels: axisX,
        datasets: [
          {
            label: careList[this.careType].legend,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgb(255, 99, 132)',
            data: axisY
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
            }
          }],
        },
        events: []
      }

    });
  }

}
