import { Input, AfterViewInit, ElementRef, HostListener, Directive, OnDestroy } from '@angular/core';

@Directive({
  selector: 'textarea[autosize]'
})

export class Autosize implements AfterViewInit, OnDestroy {

  private el: HTMLElement;
  private _minHeight: string;
  private _maxHeight: string;
  private _overflow: string;
  private _resetHeight: boolean;
  private _lastHeight: number;
  private _clientWidth: number;

  @Input('minHeight')
  get minHeight(): string {
    return this._minHeight;
  }
  set minHeight(val: string) {
    this._minHeight = val;
    this.updateMinHeight();
  }

  @Input('maxHeight')
  get maxHeight(): string {
    return this._maxHeight;
  }
  set maxHeight(val: string) {
    this._maxHeight = val;
    this.updateMaxHeight();
  }

  @Input('overflow')
  get overflow(): string {
    return this._overflow;
  }
  set overflow(val: string) {
    this._overflow = val;
  }

  @Input('resetHeight')
  get resetHeight(): boolean {
    return this._resetHeight;
  }
  set resetHeight(val: boolean) {
    this._resetHeight = val;
    if (this._resetHeight) {
      this.resetHeightEl();
    }
  }

  @HostListener('window:resize', ['$event.target'])
    onResize(textArea: HTMLTextAreaElement): void {
      // Only apply adjustment if element width had changed.
      if (this.el.clientWidth === this._clientWidth) {
        return
      };
      this._clientWidth = this.element.nativeElement.clientWidth;
      this.adjust();
    }

  @HostListener('input', ['$event.target'])
    onInput(textArea: HTMLTextAreaElement): void {
      this.adjust();
    }

  constructor(public element: ElementRef) {
    this.el = element.nativeElement;
    this._clientWidth = this.el.clientWidth;
  }

  ngAfterViewInit(): void {
    // set element resize allowed manually by user
    const style = window.getComputedStyle(this.el, null);
    if (style.resize === 'both') {
      this.el.style.resize = 'horizontal';
    } else if (style.resize === 'vertical') {
      this.el.style.resize = 'none';
    }
    // run first adjust
    this.adjust();
  }

  ngOnDestroy(): void {
    this.resetHeightEl();
  }

  adjust(): void {
    // perform height adjustments after input changes, if height is different
    if (this.el.style.height == this.element.nativeElement.scrollHeight + 'px') {
      return;
    }
    this.el.style.overflowY = this._overflow;
    this.el.style.height = 'auto';
    this.el.style.height = this.el.scrollHeight + 'px';
  }

  updateMinHeight(): void {
    // Set textarea min height if input defined
    this.el.style.minHeight = this._minHeight + 'px';
  }

  resetHeightEl(): void {
    if (this.el.clientWidth === this._clientWidth) {
      return
    };
    this._clientWidth = this.element.nativeElement.clientWidth;
    this.adjust();
  }

  updateMaxHeight(): void {
    // Set textarea max height if input defined
    this.el.style.maxHeight = this._maxHeight + 'px';
  }

}
