import { Directive } from '@angular/core';
import { ElementRef, Renderer2, HostListener  } from '@angular/core';
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(private el: ElementRef,
    // tslint:disable-next-line:align
    private renderer: Renderer2) { }

    @HostListener('mouseenter') onMouseEnter() {
      this.renderer.addClass(this.el.nativeElement, 'highlight');
    }

    @HostListener('mouseleave') onMouseLeave() {
      this.renderer.removeClass(this.el.nativeElement, 'highlight');
    }

}
