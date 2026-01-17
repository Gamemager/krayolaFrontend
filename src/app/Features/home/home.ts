import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
declare var bootstrap: any;

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements AfterViewInit {
  
  // Obtenemos referencia al elemento del carrusel del HTML
  @ViewChild('trustCarouselElement') carouselElement!: ElementRef;

  ngAfterViewInit() {
    // Verificamos si existe el elemento antes de intentar iniciarlo
    if (this.carouselElement) {
      const carousel = new bootstrap.Carousel(this.carouselElement.nativeElement, {
        interval: 3000, // Cambia cada 3 segundos
        ride: 'carousel', // Autoplay
        wrap: true // Loop infinito
      });
    }
  }
}