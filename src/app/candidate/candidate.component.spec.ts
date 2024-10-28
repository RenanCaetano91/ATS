import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidateComponent } from './candidate.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CandidateComponent', () => {
  let component: CandidateComponent;
  let fixture: ComponentFixture<CandidateComponent>;

  const setLocalStorageItem = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getLocalStorageItem = (key: string): any => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [CandidateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('subscribedJobs');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load subscribed jobs from localStorage on init', () => {
    const mockJobs = [
      { job: { title: 'Developer' }, candidate: { email: 'john@example.com' } }
    ];
    setLocalStorageItem('subscribedJobs', mockJobs);

    component.ngOnInit();

    expect(component.subscribedJobs).toEqual(mockJobs);
  });

  it('should unsubscribe from a job and update localStorage', () => {
    const initialSubscribedJobs = [
      { job: { title: 'Developer' }, candidate: { email: 'john@example.com' } },
      { job: { title: 'Designer' }, candidate: { email: 'jane@example.com' } }
    ];
    setLocalStorageItem('subscribedJobs', initialSubscribedJobs);

    component.ngOnInit();
    component.unsubscribe('Developer', 'john@example.com');

    const expectedJobs = [
      { job: { title: 'Designer' }, candidate: { email: 'jane@example.com' } }
    ];
    expect(component.subscribedJobs).toEqual(expectedJobs);
    expect(getLocalStorageItem('subscribedJobs')).toEqual(expectedJobs);
  });

  it('should download resume when resume URL is provided', () => {
    const resumeUrl = 'blob:http://localhost:9876/some-fake-url';
  
    // Cria um elemento <a> manualmente e aplica o spy diretamente no click
    const anchor = document.createElement('a');
    anchor.href = resumeUrl;
    anchor.download = 'resume.pdf';
    spyOn(anchor, 'click');
  
    // Substitui document.createElement temporariamente
    const originalCreateElement = document.createElement;
    document.createElement = jasmine.createSpy('createElement').and.returnValue(anchor);
  
    component.downloadResume(resumeUrl);
  
    expect(anchor.href).toBe(resumeUrl);
    expect(anchor.click).toHaveBeenCalled();
  
    // Restaura document.createElement para evitar efeitos colaterais em outros testes
    document.createElement = originalCreateElement;
  });
  
  it('should log an error if resume URL is undefined', () => {
    spyOn(console, 'error');
    component.downloadResume(undefined);

    expect(console.error).toHaveBeenCalledWith('URL do currículo inválida:', undefined);
  });
});
