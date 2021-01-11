import { Injectable } from '@angular/core';
import {Overlay, OverlayPositionBuilder, OverlayRef} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  private overlayRef: OverlayRef;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder
  ) {
    this.overlayRef = this.overlay.create({});
  }


  open(origin, component, data){
    let componentPortal = new ComponentPortal(component);

    let positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(origin)
      .withPositions([{
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom'
      }]);

    let componentRef: any = this.overlayRef.attach(componentPortal);
    componentRef.instance.setData(data);
    this.overlayRef.updatePositionStrategy(positionStrategy);
  }

  close(){
    this.overlayRef.detach();
  }
}
