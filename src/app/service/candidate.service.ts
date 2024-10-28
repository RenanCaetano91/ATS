import { Injectable } from '@angular/core';
import { Candidate } from '../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private candidates: Candidate[] = [];

  getCandidates(): Candidate[] {
    return this.candidates;
  }

  addCandidate(candidate: Candidate): void {
    this.candidates.push(candidate);
  }

  deleteCandidate(id: number): void {
    this.candidates = this.candidates.filter(candidate => candidate.id !== id);
  }
}
