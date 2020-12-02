import { Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  // Funziona, ma è una caciara... facciamo il metodo dell'istruttore.
  // constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
  // @HostListener('click') toggleDropdown(): void {
  //   console.log('TOGGLING!');
  //   if (this.elementRef.nativeElement.classList.contains('open')) {
  //     console.log('Ce l\'ha.');
  //     this.renderer.removeClass(this.elementRef.nativeElement, 'open');
  //   } else {
  //     console.log('Non ce l\'ha.');
  //     this.renderer.addClass(this.elementRef.nativeElement, 'open');
  //   }
  // }

  // Questo ha bisogno che si clicchi sul tasto anche per chiudere... si può fare meglio.
  // @HostBinding('class.open') isOpen: boolean;
  // @HostListener('click') toggleDropdown(): void {
  //   this.isOpen = !this.isOpen;
  // }

  @HostBinding('class.open') isOpen = false;
  @HostListener('document:click', ['$event']) toggleOpen(event: Event): void {
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }
  constructor(private elRef: ElementRef) {}
}
