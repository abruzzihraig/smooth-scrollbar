import * as I from '../interfaces/';
import { TrackDirection } from './direction';
import { setStyle } from '../utils/';

export class ScrollbarThumb implements I.ScrollbarThumb {
  /**
   * Thumb element
   */
  readonly element = document.createElement('div');

  /**
   * Display size of the thumb
   * will always be greater than `scrollbar.options.thumbMinSize`
   */
  displaySize = 0;

  /**
   * Actual size of the thumb
   */
  realSize = 0;

  /**
   * Thumb offset to the top
   */
  offset = 0;

  reducedXSize = 0;

  reducedYSize = 0;

  constructor(
    private _direction: TrackDirection,
    private _minSize = 0,
    private _offsets: I.Offsets = { top: 0, right: 0, bottom: 0, left: 0 },
  ) {
    this.element.className = `scrollbar-thumb scrollbar-thumb-${_direction}`;

    this.reducedXSize = this._offsets.left + this._offsets.right;
    this.reducedYSize = this._offsets.top + this._offsets.bottom;
  }

  /**
   * Attach to track element
   *
   * @param trackEl Track element
   */
  attachTo(trackEl: HTMLElement) {
    trackEl.appendChild(this.element);
  }

  update(
    scrollOffset: number,
    containerSize: number,
    pageSize: number,
  ) {
    const reducedSize = this._direction === TrackDirection.X ? this.reducedXSize : this.reducedYSize;

    const ratio = scrollOffset / (pageSize - containerSize);
    const newContainerSize = containerSize - reducedSize;
    const newScrollOffset = ratio * (pageSize - newContainerSize);

    // calculate thumb size
    // pageSize > containerSize -> scrollable
    this.realSize = Math.min(newContainerSize / pageSize, 1) * newContainerSize;
    this.displaySize = Math.max(this.realSize, this._minSize);

    // calculate thumb offset
    this.offset = newScrollOffset / pageSize * (newContainerSize + (this.realSize - this.displaySize))
      + (this._direction === TrackDirection.X ? this._offsets.left : this._offsets.top);

    setStyle(this.element, this._getStyle());
  }

  private _getStyle() {
    switch (this._direction) {
      case TrackDirection.X:
        return {
          width: `${this.displaySize}px`,
          '-transform': `translate3d(${this.offset}px, 0, 0)`,
        };

      case TrackDirection.Y:
        return {
          height: `${this.displaySize}px`,
          '-transform': `translate3d(0, ${this.offset}px, 0)`,
        };

      default:
        return null;
    }
  }
}
