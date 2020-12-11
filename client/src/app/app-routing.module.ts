import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './components/error.component';
import { FormComponent } from './components/form.component';
import { MainComponent } from './components/main.component';

const routes: Routes = [
  {path:'', component: MainComponent},
  {path:'form', component: FormComponent},
  {path:'form/:id', component: FormComponent},
  {path:'error', component: ErrorComponent},
  {path:'**', redirectTo:'', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
