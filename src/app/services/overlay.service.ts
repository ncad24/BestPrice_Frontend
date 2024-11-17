import {
  ApplicationRef,
  ComponentRef, createComponent,
  EnvironmentInjector,
  Injectable,
  Injector
} from '@angular/core';
import {ProductViewComponent} from '../component/user/product-view/product-view.component';
import {FlexibleConnectedPositionStrategy, Overlay, OverlayPositionBuilder, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private overlayRef: OverlayRef | null = null;

  constructor(private overlay: Overlay, private positionBuilder: OverlayPositionBuilder) { }

  openProductView(productId: number): void {
    const positionStrategy = this.positionBuilder.global().centerHorizontally().centerVertically();
    // Crea un overlay si no existe
    if (!this.overlayRef) {

      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-dark-backdrop',
        panelClass: 'custom-overlay-panel',
      });

      this.overlayRef.backdropClick().subscribe(() => this.closeOverlay());

      this.overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          this.closeOverlay();
        }
      });
    }

    // Carga el componente ProductViewComponent en el overlay
    const productPortal = new ComponentPortal(ProductViewComponent);
    const componentRef: ComponentRef<ProductViewComponent> = this.overlayRef.attach(productPortal);

    // Pasar el `productId` al componente
    componentRef.instance.productId = productId;
    console.log('productId passed to overlay:', productId);
    // Manejar el cierre desde el componente
    componentRef.instance.closePopup = () => this.closeOverlay();
  }

  closeOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
