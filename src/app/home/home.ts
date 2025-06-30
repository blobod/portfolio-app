import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GitHubService, Project } from '../services/github.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  projects: Project[] = [];
  loading = true;
  error = '';

  constructor(private githubService: GitHubService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.error = '';

    this.githubService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load projects from GitHub';
        this.loading = false;
        console.error('Error loading projects:', err);
      }
    });
  }
}