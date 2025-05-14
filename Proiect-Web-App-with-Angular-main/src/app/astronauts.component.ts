import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; //Adaugat Donciu cristian

@Component({
  selector: 'app-astronauts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './astronauts.component.html',
  styleUrls: ['./astronauts.component.css']
})
export class AstronautsComponent implements OnInit {
  astronauts: { [craft: string]: string[] } = {};
  isLoading: boolean = true;
  error: string | null = null;
  maxCraftLength: number = 0;
  sortOrder: { [craft: string]: boolean } = {}; // Ordinea de sortare per navetă
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://api.open-notify.org/astros.json')
      .subscribe({
        next: (data) => {
          this.astronauts = this.groupAstronautsByCraft(data.people);
          this.maxCraftLength = this.calculateMaxCraftLength();
          this.isLoading = false;
        },
        error: () => {
          this.error = 'A apărut o eroare la încărcarea datelor!';
          this.isLoading = false;
        }
      });
  }

  groupAstronautsByCraft(people: any[]): { [craft: string]: string[] } {
    const grouped: { [craft: string]: string[] } = {};
    people.forEach(({ name, craft }) => {
      if (!grouped[craft]) {
        grouped[craft] = [];
      }
      grouped[craft].push(name);
    });
    // Sortează numele astronauților și inițializează starea de sortare
    Object.keys(grouped).forEach(craft => {
      grouped[craft].sort();
       // Setează starea inițială de sortare ca true (alfabetic)
      this.sortOrder[craft] = true;
    });

    return grouped;
  }

  calculateMaxCraftLength(): number {
    let maxLength = 0;
    Object.keys(this.astronauts).forEach(craft => {
      maxLength = Math.max(maxLength, craft.length);
    });
    return maxLength;
  }

  toggleSort(craft: string): void {
    // Nu mai este nevoie să verificăm dacă sortOrder[craft] este undefined
    this.sortOrder[craft] = !this.sortOrder[craft];// Inversează ordinea de sortare
    this.sortAstronautsByCraft(craft);
  }

  sortAstronautsByCraft(craft: string): void {
    const isAscending = this.sortOrder[craft];// Determină ordinea de sortare
    // console.log(this.sortOrder);
    this.astronauts = {
      ...this.astronauts, // Copiază restul obiectului
      [craft]: [...this.astronauts[craft]].sort((a, b) =>
        isAscending ? a.localeCompare(b) : b.localeCompare(a)
      ) // Creează o copie nouă a array-ului sortat
    };
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  //Donciu Cristian 
// Getter care returnează lista de astronauți filtrați în funcție de textul introdus
get filteredAstronauts(): { [craft: string]: string[] } {
  if (!this.searchTerm) return this.astronauts;

  // Convertim termenul căutat în litere mici (pentru a ignora diferențele de majuscule/minuscule)
  const lowerSearch = this.searchTerm.toLowerCase();
  const result: { [craft: string]: string[] } = {};

  // Iterăm prin fiecare navă (cheile din obiectul astronauts)
  for (const craft of Object.keys(this.astronauts)) {
    // Filtrăm astronauții de pe acea navă care încep cu textul introdus
    const filtered = this.astronauts[craft].filter(name =>
      name.toLowerCase().startsWith(lowerSearch)
    );

    // Dacă avem cel puțin un astronaut potrivit, îl adăugăm în rezultat
    if (filtered.length > 0) {
      result[craft] = filtered;
    }
  }

  // Returnăm obiectul cu astronauți filtrați pe fiecare navă
  return result;
}


}
