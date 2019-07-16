import { Component, OnInit, ViewChild } from "@angular/core";
import { MoviesService } from "src/app/services/movies.service";
import { Storage } from "@ionic/storage";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  years: any[] = [];
  movies: object = {};
  selectedYear: number = null;
  rating: any[] = [1, 2, 3, 4, 5];

  @ViewChild("slides") slides;

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  constructor(
    private _moviesService: MoviesService,
    private _storage: Storage,
    public loadingController: LoadingController
  ) {
    this.getYears(2010, 2019);
  }

  ngOnInit() {
    this._storage.get("movies").then(movies => {
      this.movies = movies;
      this.getData();
    });
  }

  getYears = (startYear, endYear) => {
    for (let i = endYear; i >= startYear; i--) {
      this.years.push(i);
    }
  };

  async getData() {
    this.slides.slideTo(0);
    if (!this.selectedYear || (this.movies && this.movies[this.selectedYear]))
      return;
    const loading = await this.loadingController.create({
      message: "Please wait...",
      spinner: "crescent"
    });
    await loading.present();
    this._moviesService.getMovies(this.selectedYear).subscribe(
      async result => {
        if (!this.movies) {
          this.movies = {};
        }
        if (!this.movies[this.selectedYear]) {
          this.movies[this.selectedYear] = result.map(item => {
            item.rating = 0;
            item.poster = item.poster_path
              ? `http://image.tmdb.org/t/p/w300${item.poster_path}`
              : "../../assets/noimage.png";
            return item;
          });
          this._storage.set("movies", this.movies);
        }
        loading.dismiss();
      },
      () => {
        loading.dismiss();
      }
    );
  }

  getRating(movie, rate) {
    return rate <= movie.rating ? "radio-button-on" : "radio-button-off";
  }

  setRating(movie, rate) {
    let indexMovie = this.movies[this.selectedYear].findIndex(
      item => item.id === movie.id
    );
    this.movies[this.selectedYear][indexMovie].rating = rate;
    this._storage.set("movies", this.movies);
  }

  async slidePrev() {
    let isBeginning = await this.slides.isBeginning();
    let length = await this.slides.length();
    if (isBeginning) {
      this.slides.slideTo(length);
    } else {
      this.slides.slidePrev();
    }
  }

  async slideNext() {
    let isEnd = await this.slides.isEnd();
    if (isEnd) {
      this.slides.slideTo(0);
    } else {
      this.slides.slideNext();
    }
  }
}
