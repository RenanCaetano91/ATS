import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
})
export class CandidateComponent implements OnInit {
  subscribedJobs: any[] = [];
  private subscribedJobsKey = 'subscribedJobs';


  ngOnInit(): void {
    this.loadSubscribedJobs();
  }

  loadSubscribedJobs(): void {
    const storedCandidates = localStorage.getItem(this.subscribedJobsKey);
    this.subscribedJobs = storedCandidates ? JSON.parse(storedCandidates) : [];
    console.log('Vagas inscritas carregadas:', this.subscribedJobs); // Log para verificar os dados carregados
  }

  // Função para se desinscrever da vaga
  unsubscribe(jobTitle: string, candidateEmail: string): void {
    const updatedCandidates = this.subscribedJobs.filter(
      (candidate) => candidate.job.title !== jobTitle || candidate.candidate.email !== candidateEmail
    );
    // Salva a lista atualizada no LocalStorage
    localStorage.setItem('subscribedJobs', JSON.stringify(updatedCandidates)); // Use a chave correta
    // Atualiza a lista local
    this.subscribedJobs = updatedCandidates;
    console.log(`Candidato desinscrito da vaga: ${jobTitle}`);
  }

  // Função para fazer o download do currículo
  downloadResume(resumeUrl: string | undefined): void {
    if (resumeUrl) {
      console.log('Tentando fazer download do currículo:', resumeUrl);
      // Cria um link para o download
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = resumeUrl.split('/').pop() || 'curriculo';
      document.body.appendChild(link); // Adiciona o link ao corpo do documento
      link.click(); // Simula o clique no link
      document.body.removeChild(link); // Remove o link do DOM
    } else {
      console.error('URL do currículo inválida:', resumeUrl);
    }
  }
}