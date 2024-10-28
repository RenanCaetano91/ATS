import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JobComponent } from './job.component';
import { JobService } from '../service/job.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('JobComponent', () => {
  let component: JobComponent;
  let fixture: ComponentFixture<JobComponent>;
  let jobServiceSpy: jasmine.SpyObj<JobService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('JobService', [
      'getJobs',
      'createJob',
      'updateJob',
      'deleteJob',
      'subscribeToJob'
    ]);

    await TestBed.configureTestingModule({
      declarations: [JobComponent],
      imports: [FormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: JobService, useValue: spy }]
    }).compileComponents();

    jobServiceSpy = TestBed.inject(JobService) as jasmine.SpyObj<JobService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobComponent);
    component = fixture.componentInstance;

    // Mock do retorno de getJobs no JobService
    jobServiceSpy.getJobs.and.returnValue(of([{ jobId: 1, title: 'Dev', location: 'Remote', status: 'Aberto' }]));

    spyOn(component, 'reloadPage').and.callFake(() => {});

    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar as vagas ao iniciar', () => {
    expect(jobServiceSpy.getJobs).toHaveBeenCalled();
    expect(component.jobs.length).toBeGreaterThan(0);
  });

  it('deve abrir e fechar o modal de adição de vaga', () => {
    component.openAddJobModal();
    expect(component.showAddJobModal).toBeTrue();

    component.closeAddJobModal();
    expect(component.showAddJobModal).toBeFalse();
  });

  it('deve adicionar uma nova vaga', () => {
    component.newJobTitle = 'Test Job';
    component.newJobLocation = 'Test Location';
    component.newJobStatus = 'Aberto';

    jobServiceSpy.createJob.and.returnValue(of({ jobId: 2, title: 'Test Job', location: 'Test Location', status: 'Aberto' }));
    component.addJob();

    expect(jobServiceSpy.createJob).toHaveBeenCalledWith({
      title: 'Test Job',
      location: 'Test Location',
      status: 'Aberto'
    });
  });

  it('deve abrir e fechar o modal de edição', () => {
    const job = { jobId: 1, title: 'Dev', location: 'Remote', status: 'Aberto' };
    component.openEditJobModal(job);
    expect(component.editJobId).toBe(job.jobId);
    expect(component.editJobTitle).toBe(job.title);
    expect(component.showEditJobModal).toBeTrue();

    component.closeEditJobModal();
    expect(component.showEditJobModal).toBeFalse();
  });

  it('deve atualizar uma vaga existente', () => {
    component.editJobId = 1;
    component.editJobTitle = 'Updated Job';
    component.editJobLocation = 'Updated Location';
    component.editJobStatus = 'Fechado';

    jobServiceSpy.updateJob.and.returnValue(of({}));
    component.updateJobs();

    expect(jobServiceSpy.updateJob).toHaveBeenCalledWith({
      jobId: 1,
      title: 'Updated Job',
      location: 'Updated Location',
      status: 'Fechado'
    });
  });

  it('deve excluir uma vaga', () => {
    jobServiceSpy.deleteJob.and.returnValue(of({}));
    component.deleteJob(1);

    expect(jobServiceSpy.deleteJob).toHaveBeenCalledWith(1);
    expect(jobServiceSpy.getJobs).toHaveBeenCalled();
  });

  it('deve abrir e fechar o modal de inscrição', () => {
    component.openModal(1);
    expect(component.showModal).toBeTrue();
    expect(component.selectedJobId).toBe(1);

    component.closeModal();
    expect(component.showModal).toBeFalse();
  });

  it('deve inscrever um candidato em uma vaga', () => {
    const candidate = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      resume: null,
      jobId: 1
    };

    component.candidateName = candidate.name;
    component.candidateEmail = candidate.email;
    component.candidatePhone = candidate.phone;
    component.selectedJobId = candidate.jobId;

    jobServiceSpy.subscribeToJob.and.stub();
    component.subscribeToJob(candidate.jobId);

    expect(jobServiceSpy.subscribeToJob).toHaveBeenCalled();
  });
});
