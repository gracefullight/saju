import { DOCUMENT, isPlatformBrowser, NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  PLATFORM_ID,
  Renderer2,
  signal,
} from "@angular/core";
import type {
  DaumAddressOptions,
  DaumAddressResult,
  DaumPostcodeData,
} from "@/lib/daum-address.interface";
import {
  calculateLayerPosition,
  getLayerPositionDefaults,
  transformPostcodeData,
} from "@/lib/daum-address.utils";

const DAUM_POSTCODE_SCRIPT_URL = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

/**
 * Angular component for Daum Postcode address search
 *
 * @example
 * ```html
 * <ng-daum-address
 *   [options]="{ class: 'btn-primary' }"
 *   (result)="onAddressSelected($event)"
 * />
 * ```
 */
@Component({
  selector: "ng-daum-address",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      #addressButton
      type="button"
      [ngClass]="buttonClasses()"
      (click)="openAddressSearch()"
    >
      {{ buttonText() }}
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
  imports: [NgClass],
})
export class NgDaumAddressComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly renderer = inject(Renderer2);

  /**
   * Configuration options for the address search
   */
  readonly options = input<DaumAddressOptions>({});

  /**
   * Emits when an address is selected
   */
  readonly result = output<DaumAddressResult>();

  protected readonly buttonClasses = signal<string | string[]>("");
  protected readonly buttonText = signal("주소 검색");

  private scriptLoaded = false;
  private scriptLoading = false;
  private loadCallbacks: Array<() => void> = [];

  constructor() {
    // Initialize button styling
    this.destroyRef.onDestroy(() => {
      this.loadCallbacks = [];
    });
  }

  ngOnInit(): void {
    const opts = this.options();
    if (opts.class) {
      this.buttonClasses.set(opts.class);
    }
    if (opts.buttonText) {
      this.buttonText.set(opts.buttonText);
    }
  }

  /**
   * Opens the Daum Postcode address search
   */
  openAddressSearch(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadScript(() => {
      this.executePostcode();
    });
  }

  private loadScript(callback: () => void): void {
    if (this.scriptLoaded) {
      callback();
      return;
    }

    this.loadCallbacks.push(callback);

    if (this.scriptLoading) {
      return;
    }

    this.scriptLoading = true;

    const script = this.renderer.createElement("script") as HTMLScriptElement;
    script.type = "text/javascript";
    script.src = DAUM_POSTCODE_SCRIPT_URL;
    script.async = true;

    script.onload = () => {
      this.scriptLoaded = true;
      this.scriptLoading = false;
      for (const cb of this.loadCallbacks) {
        cb();
      }
      this.loadCallbacks = [];
    };

    script.onerror = () => {
      this.scriptLoading = false;
      console.error("[ng-daum-address] Failed to load Daum Postcode script");
    };

    this.renderer.appendChild(this.document.body, script);
  }

  private executePostcode(): void {
    const opts = this.options();
    const debug = opts.debug ?? false;

    if (debug) {
      console.log("[ng-daum-address] Options:", opts);
    }

    const postcode = new window.daum.Postcode({
      oncomplete: (data: DaumPostcodeData) => {
        this.handleComplete(data);
      },
      onresize: (size) => {
        if (opts.type === "layer" && opts.target) {
          const layer = this.document.getElementById(opts.target);
          if (layer) {
            layer.style.height = `${size.height}px`;
          }
        }
      },
      onclose: (state) => {
        if (debug) {
          console.log("[ng-daum-address] Close state:", state);
        }
        if (opts.type === "layer" && opts.target) {
          const layer = this.document.getElementById(opts.target);
          if (layer) {
            layer.style.display = "none";
          }
        }
      },
    });

    switch (opts.type) {
      case "layer":
        this.openLayerMode(postcode, opts);
        break;
      case "inline":
        this.openInlineMode(postcode, opts);
        break;
      default:
        postcode.open();
    }
  }

  private openLayerMode(
    postcode: ReturnType<typeof window.daum.Postcode.prototype.constructor>,
    opts: DaumAddressOptions,
  ): void {
    if (!opts.target) {
      console.error("[ng-daum-address] Layer mode requires a target element ID");
      return;
    }

    const layer = this.document.getElementById(opts.target);
    if (!layer) {
      console.error(`[ng-daum-address] Target element "${opts.target}" not found`);
      return;
    }

    const { width, height, border } = getLayerPositionDefaults(opts);
    const position = calculateLayerPosition(
      window.innerWidth,
      window.innerHeight,
      width,
      height,
      border,
    );

    layer.style.display = "block";
    layer.style.width = `${width}px`;
    layer.style.height = `${height}px`;
    layer.style.border = `${border}px solid`;
    layer.style.left = `${position.left}px`;
    layer.style.top = `${position.top}px`;

    postcode.embed(layer);

    // Setup close button if exists
    const closeBtn = layer.querySelector("#btnCloseLayer") as HTMLElement | null;
    if (closeBtn) {
      closeBtn.onclick = () => {
        layer.style.display = "none";
      };
    }
  }

  private openInlineMode(
    postcode: ReturnType<typeof window.daum.Postcode.prototype.constructor>,
    opts: DaumAddressOptions,
  ): void {
    if (!opts.target) {
      console.error("[ng-daum-address] Inline mode requires a target element ID");
      return;
    }

    const wrap = this.document.getElementById(opts.target);
    if (!wrap) {
      console.error(`[ng-daum-address] Target element "${opts.target}" not found`);
      return;
    }

    wrap.style.display = "block";
    wrap.style.height = "300px";

    postcode.embed(wrap);

    // Setup fold button if exists
    const foldBtn = wrap.querySelector("#btnFoldWrap") as HTMLElement | null;
    if (foldBtn) {
      foldBtn.onclick = () => {
        wrap.style.display = "none";
      };
    }
  }

  private handleComplete(data: DaumPostcodeData): void {
    const opts = this.options();

    if (opts.debug) {
      console.log("[ng-daum-address] Raw data:", data);
    }

    const result = transformPostcodeData(data);

    if (opts.debug) {
      console.log("[ng-daum-address] Result:", result);
    }

    // Hide layer/inline container if applicable
    if ((opts.type === "layer" || opts.type === "inline") && opts.target) {
      const targetEl = this.document.getElementById(opts.target);
      if (targetEl) {
        targetEl.style.display = "none";
      }
    }

    this.result.emit(result);
  }
}
