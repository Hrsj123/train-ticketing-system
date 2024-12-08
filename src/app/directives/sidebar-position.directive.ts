import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSidebarPosition]',
  standalone: true
})
export class SidebarPositionDirective {

  constructor(private el: ElementRef) {}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      const navbarHeightPx = navbar.getBoundingClientRect().bottom >= 0 
        ? navbar.getBoundingClientRect().bottom 
        : 0;
      const viewportHeight = window.innerHeight; // Get the viewport height in pixels
      const navbarHeightVh = (navbarHeightPx / viewportHeight) * 100; // Convert pixels to vh
      
      console.log(`Navbar height in vh: ${navbarHeightVh}vh`);

      this.el.nativeElement.style.top = `${navbarHeightVh + 7}vh`;
    }
  }

}
