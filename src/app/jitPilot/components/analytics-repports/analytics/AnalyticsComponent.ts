import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { BoardService } from 'src/app/jitPilot/services/board.service';
import { Board } from 'src/app/jitPilot/models/board';
import { SprintService } from 'src/app/jitPilot/services/sprint.service';
import { Sprint } from 'src/app/jitPilot/models/sprint';



@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  animations: [
    trigger('toggleAnimation', [
      transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
      transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
  ],
})
export class AnalyticsComponent implements OnInit {
  store: any;
  velocityChart: any;
  salesByCategory: any;
  dailySales: any;
  totalOrders: any;
  isLoading = true;
  boardId!:number;
  currentBoard!:Board;
  achievedVelocityList:number[] = [];
  targetVelocityList:any[] =[];
  sprintListNumber:string[] = [];
  sprints:Sprint[] = [];

  constructor(
    public storeData: Store<any> , 
    private route: ActivatedRoute,
    private boardService: BoardService,
    private sprintService:SprintService
    ) {
    this.initStore();
    this.isLoading = false;
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
        this.boardId = params['boardId'];
    });
    this.initBoard();
    this.initSprints();
}  

  async initStore() {
    this.storeData
      .select((d) => d.index)
      .subscribe((d) => {
        const hasChangeTheme = this.store?.theme !== d?.theme;
        const hasChangeLayout = this.store?.layout !== d?.layout;
        const hasChangeMenu = this.store?.menu !== d?.menu;
        const hasChangeSidebar = this.store?.sidebar !== d?.sidebar;

        this.store = d;

        if (hasChangeTheme || hasChangeLayout || hasChangeMenu || hasChangeSidebar) {
          if (this.isLoading || hasChangeTheme) {
            this.initCharts(); //init charts
          } else {
            setTimeout(() => {
              this.initCharts(); // refresh charts
            }, 300);
          }
        }
      });
  }
  initBoard() {
    this.boardService.getBoardById(this.boardId).subscribe(
        (response) => {
            this.currentBoard = response;
            console.log("res=>>", this.currentBoard);
        },
        (error) => {
            console.error('Error geting board:', error);
        }
    );
}
initSprints() {
  this.sprintService.getSprintsByBoard(this.boardId).subscribe(
      (response) => {
          this.sprints = response;
          //this.achievedVelocityList = this.sprints.map((sprint) => sprint.achievedVelocity);
          // this.targetVelocityList = this.sprints.map((sprint) => sprint.targetVelocity);
          // console.log(this.sprintListNumber);
          // console.log(this.achievedVelocityList);
          for (const n of this.sprints.map((sprint) => sprint.achievedVelocity)) {
            if (n!=null) {
              this.achievedVelocityList.push(n);
            }
          }
          for (const n of this.sprints.map((sprint) => sprint.targetVelocity)) {
            if (n!=null) {
              this.targetVelocityList.push(n);
            }
          }
          for (const s of this.sprints.map((sprint) => sprint.sprintNumber)) {
            if (s!=null) {
              this.sprintListNumber.push("sprint "+s);
            }
          }
          console.log(this.achievedVelocityList.sort()[this.achievedVelocityList.length-1]);

          
          
      },
      (error) => {
          console.error('Error geting sprints:', error);
      }
  );
}
  initCharts() {
    const isDark = this.store.theme === 'dark' || this.store.isDarkMode ? true : false;
    const isRtl = this.store.rtlClass === 'rtl' ? true : false;
    this.velocityChart = {
      chart: {
        height: 325,
        type: 'area',
        fontFamily: 'Nunito, sans-serif',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        curve: 'smooth',
        width: 2,
        lineCap: 'square',
      },
      dropShadow: {
        enabled: true,
        opacity: 0.2,
        blur: 10,
        left: -7,
        top: 22,
      },
      colors: isDark ? ['#2196f3', '#e7515a'] : ['#1b55e2', '#e7515a'],
      markers: {
        discrete: [
          {
            seriesIndex: 0,
            dataPointIndex: 6,
            fillColor: '#1b55e2',
            strokeColor: 'transparent',
            size: 7,
          },
          {
            seriesIndex: 1,
            dataPointIndex: 5,
            fillColor: '#e7515a',
            strokeColor: 'transparent',
            size: 7,
          },
        ],
      },
      labels: this.sprintListNumber,
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          show: true,
        },
        labels: {
          offsetX: isRtl ? 2 : 0,
          offsetY: 5,
          style: {
            fontSize: '12px',
            cssClass: 'apexcharts-xaxis-title',
          },
        },
      },
      yaxis: {
        tickAmount: 7,
        labels: {
          formatter: (value: number) => {
            return value ;
          },
          offsetX: isRtl ? -30 : -10,
          offsetY: 0,
          style: {
            fontSize: '12px',
            cssClass: 'apexcharts-yaxis-title',
          },
        },
        opposite: isRtl ? true : false,
      },
      grid: {
        borderColor: isDark ? '#191e3a' : '#e0e6ed',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '16px',
        markers: {
          width: 10,
          height: 10,
          offsetX: -2,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      tooltip: {
        marker: {
          show: true,
        },
        x: {
          show: false,
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: !1,
          opacityFrom: isDark ? 0.19 : 0.28,
          opacityTo: 0.05,
          stops: isDark ? [100, 100] : [45, 100],
        },
      },
      series: [
        {
          name: 'Achieved Velocity',
          data: this.achievedVelocityList,
        },
        {
          name: 'Target Velocity',
          data: this.targetVelocityList,
        }
      ],
    };

    // sales by category
    this.salesByCategory = {
      chart: {
        type: 'donut',
        height: 460,
        fontFamily: 'Nunito, sans-serif',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 25,
        colors: isDark ? '#0e1726' : '#fff',
      },
      colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a'],
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '14px',
        markers: {
          width: 10,
          height: 10,
          offsetX: -2,
        },
        height: 50,
        offsetY: 20,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '29px',
                offsetY: -10,
              },
              value: {
                show: true,
                fontSize: '26px',
                color: isDark ? '#bfc9d4' : undefined,
                offsetY: 16,
                formatter: (val: any) => {
                  return val;
                },
              },
              total: {
                show: true,
                label: 'Total',
                color: '#888ea8',
                fontSize: '29px',
                formatter: (w: any) => {
                  return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
      labels: ['Apparel', 'Sports', 'Others'],
      states: {
        hover: {
          filter: {
            type: 'none',
            value: 0.15,
          },
        },
        active: {
          filter: {
            type: 'none',
            value: 0.15,
          },
        },
      },
      series: [985, 737, 270],
    };

  }

}
