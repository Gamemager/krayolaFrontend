import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartComponent } from "./Features/cart/cart";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CartComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('krayola');
}
