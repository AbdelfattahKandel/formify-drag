
import { Component, inject, signal } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { SetupStepperComponent } from './setup-stepper/setup-stepper.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [HeroComponent, SetupStepperComponent],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  animations: [
    trigger('fadeSwitch', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px) scale(0.95)' }),
        animate(
          '600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '400ms cubic-bezier(0.4, 0, 1, 1)',
          style({ opacity: 0, transform: 'translateY(-30px) scale(0.95)' })
        ),
      ]),
    ]),
  ],
})
export class WelcomePageComponent {
  route = inject(Router);
  started = signal(false);

  startSetup(): void {
    this.started.set(true);
  }

  completeSetup(): void {
    console.log('Setup completed!');
    this.route.navigateByUrl('/dashboard');


  }
}