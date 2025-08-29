import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {
  constructor(private el: ElementRef, private r: Renderer2) {}

  ngAfterViewInit(): void {
    const nav: HTMLElement = this.el.nativeElement;
    const hashLinks = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const sections = hashLinks
      .map(a => document.querySelector(a.getAttribute('href')!) as HTMLElement)
      .filter(Boolean);

    const homeLink = nav.querySelector<HTMLAnchorElement>('a[routerLink="/"]');

    const setActive = (id?: string) => {
      hashLinks.forEach(a => {
        const on = a.getAttribute('href') === `#${id}`;
        a.classList.toggle('active', on);
      });
      // Accueil actif seulement en haut de page
      if (homeLink) homeLink.classList.toggle('active', !id);
    };

    const io = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-20% 0px -70% 0px', threshold: [0, .25, .5, .75, 1] });

    sections.forEach(s => io.observe(s));
    // état initial
    if (window.scrollY < 100) setActive(undefined);
  }
}
