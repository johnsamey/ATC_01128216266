import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <section class="hero">
        <h1>Welcome to Event Booking</h1>
        <p>Discover and book amazing events in your area</p>
        <a routerLink="/events" class="cta-button">Browse Events</a>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .hero {
      text-align: center;
      padding: 4rem 2rem;
      background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/assets/images/hero-bg.jpg');
      background-size: cover;
      background-position: center;
      color: white;
      border-radius: 8px;
    }

    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }

    .cta-button {
      display: inline-block;
      padding: 1rem 2rem;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      transition: background-color 0.2s;
    }

    .cta-button:hover {
      background-color: #0056b3;
    }
  `]
})
export class HomeComponent {} 