import { Routes } from '@angular/router';
import { Password } from './pages/password/password';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'password', component: Password },

];