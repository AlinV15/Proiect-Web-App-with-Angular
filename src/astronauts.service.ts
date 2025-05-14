import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Astronaut {
  name: string;
  craft: string;
}

interface ApiResponse {
  people: Astronaut[];
}

@Injectable({
  providedIn: 'root',
})
export class AstronautsService {
  private apiUrl = 'http://api.open-notify.org/astros.json';

  constructor(private http: HttpClient) {}

  getAstronauts(): Observable<{ [craft: string]: string[] }> {
    return this.http.get<ApiResponse>(this.apiUrl).pipe(
      map((response) => {
        const grouped: { [craft: string]: string[] } = {};
        response.people.forEach(({ name, craft }) => {
          if (!grouped[craft]) {
            grouped[craft] = [];
          }
          grouped[craft].push(name);
        });

        // Sortare alfabetică a numelor în fiecare grup
        Object.keys(grouped).forEach((craft) => {
          grouped[craft].sort((a, b) => a.localeCompare(b));
        });

        return grouped;
      })
    );
  }
}
