import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const primengConfig = [providePrimeNG({ 
    theme: {
        preset: Aura,
        options: {
            // darkModeSelector: '.my-app-dark',
            
        }
    }
 })];