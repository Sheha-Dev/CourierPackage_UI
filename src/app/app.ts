import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Full } from './layout/full/full';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Full],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('CurrierPackage_UI');
}
