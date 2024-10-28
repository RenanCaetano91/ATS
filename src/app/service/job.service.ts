import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private storageKey = 'jobs';
  private subscribedJobsKey = 'subscribedJobs'; 
   private subscribedJobs: any[] = [];
   private jobs: any[] = [];
  private apiUrl = 'https://localhost:44313/api/Job';  // URL da API

  constructor(private http: HttpClient) { 
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  // Método para obter as vagas no backend
  getJobs(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Método para criar um nova vaga
  createJob(job: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, job);
  }
  // Método para atualizar uma vaga no backend
  updateJob(job: any): Observable<any> {
    return this.http.put(this.apiUrl, job); // Passando o corpo da requisição sem o ID na URL
  }

  // metodo para deletar uma vaga no backend
  deleteJob(jobId: number): Observable<any> {
    return this.http.delete(`https://localhost:44313/api/Job/${jobId}`)
  }

   // Método para retornar as vagas inscritas
   getSubscribedJobs() {
    const jobs = localStorage.getItem('subscribedJobs');
    return jobs ? JSON.parse(jobs) : [];
}

  // Método para atualizar uma vaga existente no array local
  updateJobs(updatedJob: any): void {
    const jobIndex = this.jobs.findIndex(job => job.id === updatedJob.id);
    if (jobIndex !== -1) {
      this.jobs[jobIndex] = updatedJob; // Atualiza a vaga
      localStorage.setItem(this.storageKey, JSON.stringify(this.jobs)); // Atualiza o localStorage
    }
  }

  // Método para o candidato se inscrever em uma vaga
subscribeToJob(job: any, candidate: any, resumeFile: File | null): void {
  const formData = new FormData();
  formData.append('job', JSON.stringify(job));
  formData.append('name', candidate.name);
  formData.append('email', candidate.email);

  // Verifica se o currículo foi selecionado
  if (resumeFile) {
    formData.append('resume', resumeFile); // Aqui, resume deve ser o arquivo completo
        console.log('Currículo adicionado ao FormData:', candidate.resume);
  }
  // Pega p candidatos já inscritos do localStorage
  const existingCandidates = JSON.parse(localStorage.getItem(this.subscribedJobsKey) || '[]');
  // Adiciona o novo candidato à lista existente
  existingCandidates.push({ job, candidate });
  // Atualiza o localStorage com a lista de candidatos
  localStorage.setItem(this.subscribedJobsKey, JSON.stringify(existingCandidates));
  // Atualiza a lista local de inscritos
  this.subscribedJobs = existingCandidates;
}

  // Método para se desinscrever de uma vaga
  unsubscribeFromJob(jobTitle: string, candidateEmail: string): void {
    this.subscribedJobs = this.subscribedJobs.filter(sub =>
      sub.job.title !== jobTitle || sub.candidate.email !== candidateEmail
    );
    // Atualiza o localStorage após a desinscrição
    localStorage.setItem(this.subscribedJobsKey, JSON.stringify(this.subscribedJobs));
  }

}