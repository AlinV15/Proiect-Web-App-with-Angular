import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-astronauts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './astronauts.component.html',
  styleUrls: ['./astronauts.component.css']
})
export class AstronautsComponent implements OnInit {
  astronauts: { [craft: string]: string[] } = {};
  isLoading: boolean = true;
  error: string | null = null;
  maxCraftLength: number = 0;
  sortOrder: { [craft: string]: boolean } = {}; // Ordinea de sortare per navetă

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>('http://api.open-notify.org/astros.json')
      .subscribe({
        next: (data) => {
          this.astronauts = this.groupAstronautsByCraft(data.people);
          this.maxCraftLength = this.calculateMaxCraftLength();
          this.isLoading = false;
        },
        error: (err) => {
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
    this.sortOrder[craft] = !this.sortOrder[craft]; // Inversează ordinea de sortare
    this.sortAstronautsByCraft(craft);
  }

  sortAstronautsByCraft(craft: string): void {
    const isAscending = this.sortOrder[craft]; // Determină ordinea de sortare
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
}