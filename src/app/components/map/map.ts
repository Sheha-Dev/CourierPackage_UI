import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
  inject
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

import type * as Leaflet from 'leaflet';

export interface MapLocation {
  latitude: number;
  longitude: number;

  label?: string;
  description?: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.scss'
})
export class MapComponent
  implements AfterViewInit, OnChanges, OnDestroy {

  @ViewChild(
    'mapContainer',
    { static: true }
  )
  mapContainer!: ElementRef<HTMLDivElement>;


  @Input()
  locations: MapLocation[] = [];


  @Input()
  height = '500px';


  @Input()
  zoom = 9;


  @Input()
  centerLatitude = 6.9271;


  @Input()
  centerLongitude = 79.8612;


  private platformId =
    inject(PLATFORM_ID);


  private L?: typeof Leaflet;

  private map?: Leaflet.Map;

  private markers:
    Leaflet.Marker[] = [];

  private mapInitialized = false;


  async ngAfterViewInit(): Promise<void> {

    if (
      !isPlatformBrowser(
        this.platformId
      )
    ) {
      return;
    }


    this.L =
      await import('leaflet');


    this.initializeMap();


    this.mapInitialized = true;


    this.renderLocations();


    // Important:
    // wait until Angular/layout/sidebar
    // finishes calculating sizes.
    setTimeout(() => {

      this.refreshMapSize();

    }, 100);


    // Second refresh helps when the
    // layout has transitions/sidebar.
    setTimeout(() => {

      this.refreshMapSize();

    }, 400);

  }


  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['locations'] &&
      this.mapInitialized
    ) {

      this.renderLocations();

    }


    if (
      changes['height'] &&
      this.mapInitialized
    ) {

      setTimeout(() => {

        this.refreshMapSize();

      });

    }

  }


  private initializeMap(): void {

    if (!this.L) {
      return;
    }


    const L = this.L;


    this.map =
      L.map(
        this.mapContainer.nativeElement,
        {
          zoomControl: true
        }
      );


    this.map.setView(
      [
        this.centerLatitude,
        this.centerLongitude
      ],
      this.zoom
    );


    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; OpenStreetMap contributors',

        maxZoom: 19
      }
    )
      .addTo(this.map);

  }


  private renderLocations(): void {

    if (
      !this.L ||
      !this.map
    ) {
      return;
    }


    const L = this.L;


    this.clearMarkers();


    const validLocations =
      this.locations.filter(
        location =>
          Number.isFinite(
            location.latitude
          ) &&
          Number.isFinite(
            location.longitude
          )
      );


    if (
      validLocations.length === 0
    ) {

      this.map.setView(
        [
          this.centerLatitude,
          this.centerLongitude
        ],
        this.zoom
      );


      this.refreshMapSize();

      return;
    }


    const bounds:
      Leaflet.LatLngExpression[] = [];


    validLocations.forEach(
      (
        location,
        index
      ) => {

        const latLng:
          Leaflet.LatLngExpression = [

            location.latitude,

            location.longitude

          ];


        bounds.push(
          latLng
        );


        const marker =
          L.marker(
            latLng
          )
            .addTo(
              this.map!
            );


        const title =
          location.label ??
          `Location ${index + 1}`;


        let popupContent =
          `<strong>${this.escapeHtml(title)}</strong>`;


        if (
          location.description
        ) {

          popupContent +=
            `<br>${this.escapeHtml(
              location.description
            )}`;

        }


        marker.bindPopup(
          popupContent
        );


        this.markers.push(
          marker
        );

      }
    );


    // One location
    if (
      validLocations.length === 1
    ) {

      this.map.setView(
        bounds[0],
        this.zoom
      );

    }

    // Multiple locations
    else {

      const mapBounds =
        L.latLngBounds(
          bounds
        );


      this.map.fitBounds(
        mapBounds,
        {
          padding: [
            40,
            40
          ],

          maxZoom: 15
        }
      );

    }


    setTimeout(() => {

      this.refreshMapSize();

    });

  }


  private clearMarkers(): void {

    if (!this.map) {
      return;
    }


    this.markers.forEach(
      marker => {

        this.map?.removeLayer(
          marker
        );

      }
    );


    this.markers = [];

  }


  refreshMapSize(): void {

    if (!this.map) {
      return;
    }


    this.map.invalidateSize({
      animate: false
    });

  }


  private escapeHtml(
    value: string
  ): string {

    return value
      .replaceAll(
        '&',
        '&amp;'
      )
      .replaceAll(
        '<',
        '&lt;'
      )
      .replaceAll(
        '>',
        '&gt;'
      )
      .replaceAll(
        '"',
        '&quot;'
      )
      .replaceAll(
        "'",
        '&#039;'
      );

  }


  ngOnDestroy(): void {

    if (this.map) {

      this.map.remove();

      this.map =
        undefined;

    }


    this.markers = [];

  }

}