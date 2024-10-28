import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { JobComponent } from './job/job.component';
import { CandidateComponent } from './candidate/candidate.component'; // Componente para a página de inscrições
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: JobComponent }, // Página principal
  { path: 'candidate', component: CandidateComponent }, // Rota para inscrições
];

@NgModule({
  declarations: [
    AppComponent,
    JobComponent,
    CandidateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
