import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class MoviesService {
  APIKEY = "7ca802c71a7661f4403fcfd0a3a1a059";
  URLMOVIEDB = "https://api.themoviedb.org/3";

  constructor(private _http: HttpClient) {}

  getMovies(selectedYear) {
    let url = `${
      this.URLMOVIEDB
    }/discover/movie?primary_release_year=${selectedYear}&sort_by=release_date.asc&api_key=${
      this.APIKEY
    }&language=es`;
    let headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this._http
      .get(url, { headers })
      .pipe(map((response: any) => response.results));
  }
}
