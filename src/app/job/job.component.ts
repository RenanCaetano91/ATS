import { Component, OnInit } from '@angular/core';
import { JobService } from '../service/job.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
})
export class JobComponent implements OnInit {
  public showModal: boolean = false;
  public showAddJobModal: boolean = false;
  public selectedJobId: number | null = null;
  public candidateName: string = '';
  public candidateEmail: string = '';
  public candidatePhone: string = '';
  public jobs: any[] = [];
  public newJobTitle: string = '';
  public newJobLocation: string = '';
  public newJobStatus: string = 'Aberto';
  public editJobId: number | null = null;
  public editJobTitle: string = '';
  public editJobLocation: string = '';
  public editJobStatus: string = '';
  public showEditJobModal: boolean = false;
  public resumeFile: File | null = null;

  constructor(private jobService: JobService) { }

  ngOnInit(): void {
    this.loadJobs(); // loadJob é chamado logo no inicio para carregar as vagas no banco de dados
  }
  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        console.log('Vagas carregadas:', jobs);
        this.jobs = jobs;
      },
      error: (err) => {
        console.error('Erro ao carregar vagas', err);
      }
    });
  }
  openEditJobModal(job: any): void {
    this.editJobId = job.jobId;
    this.editJobTitle = job.title;
    this.editJobLocation = job.location;
    this.editJobStatus = job.status;
    this.showEditJobModal = true;
  }

  closeEditJobModal(): void {
    this.showEditJobModal = false;
    this.reloadPage()
  }

  updateJobs(): void {
    if (this.editJobId !== null) {
      const updatedJob = {
        jobId: this.editJobId,
        title: this.editJobTitle,
        location: this.editJobLocation,
        status: this.editJobStatus
      };
      console.log(updatedJob)
      this.jobService.updateJob(updatedJob).subscribe({
        next: () => {
          const index = this.jobs.findIndex(job => job.id === this.editJobId);
          if (index !== -1) {
            this.jobs[index] = { ...this.jobs[index], ...updatedJob };
          }
          this.closeEditJobModal();
        },
        error: (err) => {
          console.error('Erro ao atualizar vaga', err);
        }
      });
    }
  }
  openModal(jobId: number): void {
    console.log('Abrindo modal de inscrição para a vaga ID:', jobId);
    this.selectedJobId = jobId;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.reloadPage()
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.resumeFile = input.files[0];
      console.log('Currículo selecionado:', this.resumeFile);
    } else {
      this.resumeFile = null;
    }
  }
  subscribeToJob(jobId: number | null): void {
    console.log('subscribeToJob chamado com id:', jobId);
    if (jobId !== null) {
      const selectedJob = this.jobs.find(job => job.jobId === jobId || job.id === jobId);
      console.log('Vaga selecionada:', selectedJob);
      if (selectedJob) {
        const candidate = {
          name: this.candidateName,
          email: this.candidateEmail,
          phone: this.candidatePhone,
          resume: this.resumeFile ? URL.createObjectURL(this.resumeFile) : null, // Cria a URL para o blob do currículo
          jobId: jobId
        };
        console.log('Dados do candidato:', candidate);
        // Chama o serviço para inscrever o candidato na vaga
        this.jobService.subscribeToJob(selectedJob, candidate, this.resumeFile);
        
      console.log(`Número de inscritos para a vaga ${selectedJob.title}:`, selectedJob.applicantsCount);
        // Armazena o candidato no localStorage
        const existingCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
        existingCandidates.push(candidate);
        localStorage.setItem('candidates', JSON.stringify(existingCandidates));

        // Reseta os campos e fecha o modal
        this.candidateName = '';
        this.candidateEmail = '';
        this.candidatePhone = '';
        this.resumeFile = null;
        this.closeModal();

        console.log('Inscrição realizada e armazenada localmente');
      } else {
        console.warn('Nenhuma vaga foi encontrada com o id:', jobId);
      }
    } else {
      console.warn('id inválido:', jobId);
    }
  }
  getJobTitle(jobId: number | null): string {
    const job = this.jobs.find(job => job.id === jobId);
    return job ? job.title : 'Vaga não encontrada';
  }

  deleteJob(jobId: number) {
    this.jobService.deleteJob(jobId).subscribe(
      (response) => {
        console.log('Vaga excluída com sucesso', response);
        this.loadJobs(); // Atualize a lista de vagas após a exclusão.
      },
      (error) => {
        console.error('Erro ao excluir vaga', error);
      }
    );
    //location.reload();
    this.reloadPage()
  }
  reloadPage(): void {
    location.reload();
  }

  openAddJobModal(): void {
    this.showAddJobModal = true;
  }

  closeAddJobModal(): void {
    this.showAddJobModal = false;
    this.reloadPage()
  }

  addJob(): void {
    if (this.newJobTitle && this.newJobLocation) {
      const newJob = {
        title: this.newJobTitle,
        location: this.newJobLocation,
        status: this.newJobStatus
      };

      this.jobService.createJob(newJob).subscribe({
        next: (response) => {
          console.log('Vaga adicionada com sucesso', response);
          this.loadJobs();  // Atualiza a lista com a nova vaga
          this.closeAddJobModal();
        },
        error: (err) => {
          console.error('Erro ao adicionar vaga', err);
        }
      });
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  }
}
