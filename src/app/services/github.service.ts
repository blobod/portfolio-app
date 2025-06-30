import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  lastUpdated: Date;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  updated_at: string;
  homepage?: string | null;
  fork: boolean;
  pushed_at: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class GitHubService {
  private username = 'blobod';

  getProjects(): Observable<Project[]> {
    return new Observable<Project[]>(observer => {
      console.log('Creating Observable...');
      
      const url = `https://api.github.com/users/${this.username}/repos?sort=pushed&per_page=30`;
      
      fetch(url)
        .then(response => {
          if (!response.ok) {
            if (response.status === 403) {
              throw new Error(`GitHub API rate limit exceeded. Please wait a few minutes and try again.`);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((repos: GitHubRepo[]) => {
          console.log('Raw repos data:', repos);
          console.log('Total repositories found:', repos.length);
          
          repos.forEach((repo: GitHubRepo) => {
            console.log(`Repository: ${repo.name}`);
            console.log(`  - Description: "${repo.description}"`);
            console.log(`  - Fork: ${repo.fork}`);
            console.log(`  - Created: ${repo.created_at}`);
            console.log(`  - Last pushed: ${repo.pushed_at}`);
            console.log(`  - Language: ${repo.language}`);
            console.log('---');
          });
          
          const candidateRepos = repos.filter((repo: GitHubRepo) => {
            const isGitHubPages = repo.name.includes('.github.io');
            const isDocsRepo = repo.name.toLowerCase().includes('docs');
            
            const isForkWithRecentActivity = repo.fork && this.hasRecentActivity(repo);
            const isOriginalRepo = !repo.fork;
            
            const shouldInclude = (isOriginalRepo || isForkWithRecentActivity) && !isGitHubPages && !isDocsRepo;
            
            console.log(`Filtering ${repo.name}:`);
            console.log(`  - Original repo: ${isOriginalRepo}`);
            console.log(`  - Fork with recent activity: ${isForkWithRecentActivity}`);
            console.log(`  - Should include: ${shouldInclude}`);
            
            return shouldInclude;
          });
          
          console.log('Candidate repos after filtering:', candidateRepos.length);
          console.log('Candidate repo names:', candidateRepos.map(r => r.name));
          
          const validRepos = candidateRepos.slice(0, 8);
          
          console.log('Valid repos for display:', validRepos.map(r => r.name));
          
          const projects = this.mapReposToProjects(validRepos);
          console.log('Final projects:', projects);
          
          observer.next(projects);
          observer.complete();
        })
        .catch(error => {
          console.error('Fetch error:', error);
          observer.error(error);
        });
    });
  }

  private hasRecentActivity(repo: GitHubRepo): boolean {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const lastPushed = new Date(repo.pushed_at);
    const created = new Date(repo.created_at);
    const recentlyPushed = lastPushed > oneYearAgo;
    const significantGapBetweenCreationAndPush = (lastPushed.getTime() - created.getTime()) > (24 * 60 * 60 * 1000);
    
    return recentlyPushed || significantGapBetweenCreationAndPush;
  }

  private mapReposToProjects(repos: GitHubRepo[]): Project[] {
    return repos.map((repo: GitHubRepo) => ({
      title: this.formatTitle(repo.name),
      description: repo.description || `${this.formatTitle(repo.name)} - GitHub Repository`,
      technologies: repo.language ? [repo.language] : ['Multiple Languages'],
      githubUrl: repo.html_url,
      liveUrl: repo.homepage && repo.homepage.trim() !== '' ? repo.homepage : undefined,
      lastUpdated: new Date(repo.updated_at)
    }));
  }

  private formatTitle(repoName: string): string {
    return repoName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}