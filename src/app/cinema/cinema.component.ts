import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CinemaService} from '../services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes;
  public currentVille;
  public cinemas;
  public currentCinema;
  public salles;
  public currentProjection: any;
  public selectedTickets: any[];


  constructor(public  cinemaService: CinemaService) {
  }

  ngOnInit(): void {
    this.cinemaService.getVilles()
      .subscribe(data => {
        this.villes = data;
      }, error => {
        console.log(error);
      });
  }

  onGetCinema(v) {
    this.currentVille = v;
    this.salles = undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data => {
        this.cinemas = data;
      }, error => {
        console.log(error);
      });
  }

  onGetSalle(c) {
    this.currentCinema = c;
    this.cinemaService.getSalles(c)
      .subscribe(data => {
        this.salles = data;
        this.salles._embedded.salles.forEach(salle => {
          this.cinemaService.getProjections(salle)
            .subscribe(data => {
              salle.projections = data;
            }, error => {
              console.log(error);
            });
        });
      }, error => {
        console.log(error);
      });
  }

  onGetTicketsPlaces(p) {
    this.currentProjection = p;
    this.cinemaService.getTicketsPlaces(p)
      .subscribe(data => {
        this.currentProjection.tickets = data;
        this.selectedTickets = [];
      }, error => {
        console.log(error);
      });
  }

  onSelectTicket(t: any) {
    if (!t.selected) {
      t.selected = true;
      this.selectedTickets.push(t);
    } else {
      t.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t), 1);
    }

  }

  getClass(t: any) {

    if (t.reserved == true) {
      return 'btn btn-danger ticket';
    } else if (t.selected) {

      return 'btn btn-warning ticket';
    } else {

      return 'btn btn-success ticket';
    }
  }

  pay(dataForm) {

    console.log(dataForm);
    let tickets = [];
    this.selectedTickets.forEach(ts => {
      tickets.push(ts.id);
    });
    dataForm.ids=tickets;
    console.log(tickets);
    this.cinemaService.payService(dataForm).subscribe(data => {
    alert("Tickets Réservés aves Success!");
    this.onGetTicketsPlaces(this.currentProjection);
    }, err => {
      console.log("error");
    });
  }
}
