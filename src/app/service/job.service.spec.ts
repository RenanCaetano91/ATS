// job.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JobService } from './job.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('JobService', () => {
  let service: JobService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, HttpClientModule],
      providers: [JobService]
    });
    service = new JobService(TestBed.inject(HttpClient));
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve jobs from API', () => {
    const mockJobs = [{ id: 1, title: 'Developer' }, { id: 2, title: 'Designer' }];

    service.getJobs().subscribe((jobs) => {
      expect(jobs).toEqual(mockJobs);
    });

    const req = httpMock.expectOne('https://localhost:44313/api/Job');
    expect(req.request.method).toBe('GET');
    req.flush(mockJobs);
  });

  it('should create a new job', () => {
    const newJob = { id: 3, title: 'Tester' };

    service.createJob(newJob).subscribe((response) => {
      expect(response).toEqual(newJob);
    });

    const req = httpMock.expectOne('https://localhost:44313/api/Job');
    expect(req.request.method).toBe('POST');
    req.flush(newJob);
  });

  it('should update an existing job', () => {
    const updatedJob = { id: 1, title: 'Senior Developer' };

    service.updateJob(updatedJob).subscribe((response) => {
      expect(response).toEqual(updatedJob);
    });

    const req = httpMock.expectOne('https://localhost:44313/api/Job');
    expect(req.request.method).toBe('PUT');
    req.flush(updatedJob);
  });

  it('should delete a job by ID', () => {
    const jobId = 1;

    service.deleteJob(jobId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`https://localhost:44313/api/Job/${jobId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should return subscribed jobs', () => {
    // Limpa o `localStorage` antes do teste
    localStorage.clear();
    const subscribedJobs = [
      { job: { id: 1, title: 'Developer' }, candidate: { name: 'John', email: 'john@example.com' } }
    ];
    localStorage.setItem('subscribedJobs', JSON.stringify(subscribedJobs));
        const result = service.getSubscribedJobs();
        expect(result.length).toBe(1); // Esperamos um job inscrito
    expect(result).toEqual(subscribedJobs); // Verifica se os dados estão corretos
  });
  
  it('should subscribe to a job', () => {
    const job = { id: 1, title: 'Developer' };
    const candidate = { name: 'John', email: 'john@example.com' };
    const resumeFile = new File(['resume content'], 'resume.pdf');

    service.subscribeToJob(job, candidate, resumeFile);

    const subscribedJobs = JSON.parse(localStorage.getItem('subscribedJobs') || '[]');
    expect(subscribedJobs.length).toBe(1);
    expect(subscribedJobs[0].job).toEqual(job);
    expect(subscribedJobs[0].candidate).toEqual(candidate);
  });

  it('should unsubscribe from a job', () => {
    const job = { id: 1, title: 'Developer' };
    const candidate = { name: 'John', email: 'john@example.com' };
    service.subscribeToJob(job, candidate, null);

    service.unsubscribeFromJob('Developer', 'john@example.com');
    const subscribedJobs = JSON.parse(localStorage.getItem('subscribedJobs') || '[]');

    expect(subscribedJobs.length).toBe(0);
  });
});
