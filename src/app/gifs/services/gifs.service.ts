import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'MQMFkghL5D1TdFierbvaF2ZMzHryiBGZ';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = []; 

  get historial(){
    return [...this._historial];
  }

  constructor(private http: HttpClient){ 
    //Devuelve lo que hay en mi localStorage para mostrar el historial en mi navbar
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultado')! ) || [];
    // if (localStorage.getItem('historial')) {
    //   this._historial = JSON.parse(localStorage.getItem('historial')! );
    // }
  }

  buscarGifs(query: string){

    query = query.trim().toLowerCase();

    //Verifica si existe elemento, si no existe, inserta el elemento en el array
    if(!this._historial.includes(query)){          
      this._historial.unshift(query);

      //Mantiene la consistencia del historial de 10 elementos
      this._historial = this._historial.splice(0,10);

      //Guardar en localStorage
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('q', query)
    .set('limit','10');

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{params})
      .subscribe((resp) => {
        this.resultados = resp.data;
        //Guardar en localStorage
        localStorage.setItem('resultado',JSON.stringify(this.resultados));
      });

  }

}
