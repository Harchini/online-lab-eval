import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeTab = 'questions';
  questions: any[] = [];
  leaderboard: any[] = [];
  submissions: any[] = [];
  submitting = false;
  successMsg = '';
  staffRegNo = '';

  // Advanced Angular Technique: Complex Nested Reactive Form with FormArray
  questionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {
    this.staffRegNo = this.auth.getUser()?.regNo || '';
    this.questionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      testCases: this.fb.array([this.newTestCase()])
    });
  }

  ngOnInit() {
    this.loadQuestions();
  }

  get testCases(): FormArray {
    return this.questionForm.get('testCases') as FormArray;
  }

  newTestCase(): FormGroup {
    return this.fb.group({
      input: ['', Validators.required],
      output: ['', Validators.required],
      marks: [5, [Validators.required, Validators.min(1)]]
    });
  }

  addTestCase() { this.testCases.push(this.newTestCase()); }
  removeTestCase(i: number) { if (this.testCases.length > 1) this.testCases.removeAt(i); }

  loadQuestions() {
    this.api.getQuestions().subscribe({ next: (data) => (this.questions = data) });
  }

  loadLeaderboard() {
    this.api.getLeaderboard().subscribe({ next: (data) => (this.leaderboard = data) });
  }

  loadSubmissions() {
    this.api.getAllSubmissions().subscribe({ next: (data) => (this.submissions = data) });
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'leaderboard') this.loadLeaderboard();
    if (tab === 'submissions') this.loadSubmissions();
    if (tab === 'questions') this.loadQuestions();
  }

  submitQuestion() {
    if (this.questionForm.invalid) return;
    this.submitting = true;
    this.api.createQuestion(this.questionForm.value).subscribe({
      next: () => {
        this.successMsg = '✅ Question created successfully!';
        this.questionForm.reset();
        this.testCases.clear();
        this.testCases.push(this.newTestCase());
        this.loadQuestions();
        this.submitting = false;
        setTimeout(() => (this.successMsg = ''), 3000);
      },
      error: () => { this.submitting = false; }
    });
  }

  deleteQuestion(id: string) {
    this.api.deleteQuestion(id).subscribe({ next: () => this.loadQuestions() });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  getRank(i: number): string {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `#${i + 1}`;
  }
}
