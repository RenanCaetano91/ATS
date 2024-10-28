import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobComponent } from './job/job.component'; // Ajuste o caminho conforme necessário
import { CandidateComponent } from './candidate/candidate.component'; // Ajuste o caminho conforme necessário

const routes: Routes = [
  { path: '', redirectTo: '/jobs', pathMatch: 'full' },
  { path: 'jobs', component: JobComponent },
  { path: 'candidate', component: CandidateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
