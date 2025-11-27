import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  lastUpdated: Date;
  featured?: boolean; // Mark manually added projects as featured
}

@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  private username = 'blobod';

  // Manually curated projects with better descriptions
  private featuredProjects: Project[] = [
    {
      title: 'AR Unity Application',
      description: 'An innovative augmented reality application built with Unity, demonstrating advanced AR capabilities and interactive user experiences for mobile platforms.',
      technologies: ['Unity', 'C#', 'ARCore', 'ARKit', 'Mobile Development'],
      githubUrl: 'https://github.com/blobod/SW8_P8',
      lastUpdated: new Date('2024-03-14'),
      featured: true
    },
    {
      title: 'Portfolio Website',
      description: 'A modern, responsive portfolio website built with Angular featuring dynamic GitHub integration, showcasing projects with professional design and smooth user experience.',
      technologies: ['Angular', 'TypeScript', 'CSS3', 'GitHub API'],
      githubUrl: 'https://github.com/blobod/portfolio-app',
      lastUpdated: new Date(),
      featured: true
    },
    {
      title: 'LLMEnsembleEval',
      description: 'Modular framework for evaluating transfomer based LLM Ensembles.',
      technologies: ['Python', 'Huggingface'],
      githubUrl: 'https://github.com/blobod/LLMEnsembleEval',
      lastUpdated: new Date('2025-06-11'),
      featured: true
    },
    {
      title: 'Trash Sorting Application',
      description: 'A Flutter mobile application that analyzes photos of waste items using a custom fine-tuned machine learning model to accurately classify trash types and recommend the appropriate recycling bin.',
      technologies: ['Flutter', 'Dart', 'Python'],
      githubUrl: 'https://github.com/orgs/Group2-P6-Bachelor-Project/repositories',
      lastUpdated: new Date('2024-06-24'),
      featured: true
    },
    {
      title: 'Taskboard Application',
      description: 'A full-stack task management application built with Java Spring Boot and modern frontend tools. Supports task creation, status tracking, and a clean REST API for easy integration.',
      technologies: ['Java', 'Springboot', 'Postman', 'PostgreSQL', 'Angular', 'Selenium'],
      githubUrl: 'https://github.com/blobod/Taskboard-Project',
      lastUpdated: new Date('2025-11-27'),
      featured: true
    },
    
  ];

getProjects(): Observable<Project[]> {
  return forkJoin([
    of(this.featuredProjects),
    this.getGitHubProjects().pipe(catchError(() => of([])))
  ]).pipe(
    map(([featured, github]) => {
      const featuredUrls = new Set(featured.map(p => p.githubUrl));
      const filteredGithub = github.filter(p => !featuredUrls.has(p.githubUrl));
      return [...featured, ...filteredGithub];
    })
  );
}


  private getGitHubProjects(): Observable<Project[]> {
    const url = `https://api.github.com/users/${this.username}/repos?sort=pushed&per_page=20`;
    
    return new Observable<Project[]>(observer => {
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((repos: any[]) => {
          const projects = repos
            .filter(repo => !repo.fork && repo.description && !repo.name.includes('.'))
            .slice(0, 6)
            .map(repo => ({
              title: this.formatTitle(repo.name),
              description: repo.description,
              technologies: repo.language ? [repo.language] : ['Multiple Languages'],
              githubUrl: repo.html_url,
              liveUrl: repo.homepage || undefined,
              lastUpdated: new Date(repo.updated_at),
              featured: false
            }));
          
          observer.next(projects);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  private formatTitle(repoName: string): string {
    return repoName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}