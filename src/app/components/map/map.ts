import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

import { CommonModule } from '@angular/common';

import * as L from 'leaflet';


export interface MapPoint {
  pointName?: string;
  latitude: number;
  longitude: number;
}

export interface MapOutputData {
  source: MapPoint;
  destination: MapPoint;
  routeDistanceKm: number;
  routeDurationMinutes: number;
}


@Component({
  selector: 'app-map',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './map.html',

  styleUrl: './map.scss'
})
export class MapComponent
  implements AfterViewInit, OnChanges, OnDestroy, OnInit {

  @Input()
  sourcePoint: MapPoint = {
    pointName: '',
    latitude: 0,
    longitude: 0
  };

  @Input()
  destinationPoint: MapPoint = {
    pointName: '',
    latitude: 0,
    longitude: 0
  };

  @Input()
  locationList: MapPoint[] = [];

  @Input()
  routeRequired: boolean = false;

  @Output()
  destinationPointChange =
    new EventEmitter<MapOutputData>();


  private map?: L.Map;

  private sourceMarker?: L.Marker;

  private destinationMarker?: L.Marker;

  private routeLayer?: L.GeoJSON;


  // =========================================
  // ROUTE INFORMATION
  // =========================================

  routeDistanceKm: number | null = null;

  routeDurationMinutes: number | null = null;

  loadingRoute = false;

  routeError = '';


  // =========================================
  // LIFECYCLE
  // =========================================

  ngOnInit(): void {
    console.log('Map Component Initialize..');
  }


  ngAfterViewInit(): void {
    this.initializeMap();
  }


  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (!this.map) {
      return;
    }


    if (
      changes['sourcePoint'] &&
      this.routeRequired
    ) {
      console.log(
        'Source Point Changed in map.'
      );

      this.renderSource();
      this.clearRoute();
    }


    if (
      changes['destinationPoint']
    ) {

      this.renderDestination();

      console.log(
        'Destination Point Changed in map.'
      );

      this.clearRoute();


      if (
        this.sourcePoint &&
        this.destinationPoint &&
        this.routeRequired
      ) {
        this.loadRoute();
      }
      else {
        this.clearRoute();
      }
    }
  }


  // =========================================
  // INITIALIZE MAP
  // =========================================

  private initializeMap(): void {

    /*
     * Important for OpenStreetMap tiles.
     *
     * This allows the browser to send the
     * application origin as the Referer.
     */
    L.TileLayer.prototype.options.referrerPolicy =
      'strict-origin-when-cross-origin';


    /*
     * Default center: Sri Lanka.
     */
    const defaultLatitude =
      this.sourcePoint &&
      this.sourcePoint.latitude !== 0
        ? this.sourcePoint.latitude
        : 7.8731;


    const defaultLongitude =
      this.sourcePoint &&
      this.sourcePoint.longitude !== 0
        ? this.sourcePoint.longitude
        : 80.7718;


    const hasValidSource =
      !!this.sourcePoint &&
      this.sourcePoint.latitude !== 0 &&
      this.sourcePoint.longitude !== 0;


    /*
     * Create Leaflet map.
     */
    this.map =
      L.map(
        'courier-map',
        {
          center: [
            defaultLatitude,
            defaultLongitude
          ],

          zoom: hasValidSource
            ? 13
            : 8
        }
      );


    // =========================================
    // OPENSTREETMAP TILE LAYER
    // =========================================

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,

        attribution:
          '&copy; https://www.openstreetmap.org/copyright' +
          'OpenStreetMap contributors</a>',

        referrerPolicy:
          'strict-origin-when-cross-origin'
      }
    )
      .addTo(
        this.map
      );


    // =========================================
    // MAP CLICK
    // =========================================

    this.map.on(
      'click',
      event => {
        this.handleMapClick(
          event
        );
      }
    );


    // =========================================
    // INITIAL MARKERS
    // =========================================

    if (hasValidSource) {
      this.renderSource();
    }


    if (
      this.isValidPoint(
        this.destinationPoint
      )
    ) {

      this.renderDestination();


      if (
        this.routeRequired &&
        hasValidSource
      ) {
        this.loadRoute();
      }
    }


    /*
     * Useful when map is inside
     * conditional Angular HTML.
     */
    setTimeout(
      () => {
        this.map
          ?.invalidateSize();
      },
      100
    );
  }


  // =========================================
  // VALIDATE POINT
  // =========================================

  private isValidPoint(
    point?: MapPoint
  ): boolean {

    if (!point) {
      return false;
    }

    return (
      Number.isFinite(point.latitude) &&
      Number.isFinite(point.longitude) &&
      point.latitude !== 0 &&
      point.longitude !== 0
    );
  }


  // =========================================
  // MAP CLICK
  // =========================================

  private async handleMapClick(
    event: L.LeafletMouseEvent
  ): Promise<void> {

    if (
      this.routeRequired &&
      !this.isValidPoint(this.sourcePoint)
    ) {
      console.warn(
        'Source location must be selected first.'
      );

      return;
    }


    /*
     * Set destination.
     */
    this.destinationPoint = {
      pointName: 'destination',
      latitude: event.latlng.lat,
      longitude: event.latlng.lng
    };


    /*
     * Show destination marker.
     */
    this.renderDestination();


    /*
     * Calculate route.
     */
    if (
      this.routeRequired
    ) {

      await this.loadRouteToPoint(
        this.destinationPoint
      );
    }


    /*
     * Emit result to parent.
     */
    const point: MapOutputData = {

      source:
        this.sourcePoint,

      destination:
        this.destinationPoint,

      routeDistanceKm:
        this.routeDistanceKm ?? 0,

      routeDurationMinutes:
        this.routeDurationMinutes ?? 0
    };


    this.destinationPointChange.emit(
      point
    );
  }


  // =========================================
  // SOURCE MARKER
  // =========================================

  private renderSource(): void {

    if (
      !this.map ||
      !this.isValidPoint(this.sourcePoint)
    ) {
      return;
    }


    /*
     * Remove previous source marker.
     */
    if (
      this.sourceMarker
    ) {

      this.map.removeLayer(
        this.sourceMarker
      );

      this.sourceMarker =
        undefined;
    }


    const sourceLatLng:
      L.LatLngExpression = [

        this.sourcePoint.latitude,

        this.sourcePoint.longitude

      ];


    /*
     * Create new source marker.
     */
    this.sourceMarker =
      L.marker(
        sourceLatLng,
        {
          draggable: false
        }
      )
        .addTo(
          this.map
        )
        .bindPopup(
          '<strong>Source Warehouse</strong>'
        );


    /*
     * Move map to source.
     */
    this.map.setView(
      sourceLatLng,
      13
    );
  }


  // =========================================
  // DESTINATION MARKER FROM INPUT
  // =========================================

  private renderDestination(): void {

    if (
      !this.isValidPoint(
        this.destinationPoint
      )
    ) {

      this.removeDestinationMarker();

      return;
    }


    this.renderDestinationPoint(
      this.destinationPoint
    );
  }


  // =========================================
  // DESTINATION MARKER
  // =========================================

  private renderDestinationPoint(
    point: MapPoint
  ): void {

    if (!this.map) {
      return;
    }


    /*
     * Remove existing destination marker.
     */
    this.removeDestinationMarker();


    /*
     * Create destination marker.
     */
    this.destinationMarker =
      L.marker(
        [
          point.latitude,
          point.longitude
        ]
      )
        .addTo(
          this.map
        )
        .bindPopup(
          '<strong>Destination</strong>'
        )
        .openPopup();
  }


  // =========================================
  // REMOVE DESTINATION MARKER
  // =========================================

  private removeDestinationMarker():
    void {

    if (
      this.map &&
      this.destinationMarker
    ) {

      this.map.removeLayer(
        this.destinationMarker
      );


      this.destinationMarker =
        undefined;
    }
  }


  // =========================================
  // LOAD ROUTE
  // =========================================

  private loadRoute(): void {

    if (
      !this.isValidPoint(this.sourcePoint) ||
      !this.isValidPoint(this.destinationPoint)
    ) {

      this.clearRoute();

      return;
    }


    this.clearRoute();


    void this.loadRouteToPoint(
      this.destinationPoint
    );
  }


  // =========================================
  // LOAD ROUTE TO DESTINATION
  // =========================================

  private async loadRouteToPoint(
    destination: MapPoint
  ): Promise<void> {

    if (
      !this.map ||
      !this.isValidPoint(this.sourcePoint)
    ) {
      return;
    }


    this.loadingRoute =
      true;


    this.routeError =
      '';


    /*
     * Remove previous route.
     */
    this.clearRouteLayer();


    /*
     * OSRM expects coordinates as:
     *
     * longitude,latitude
     */
    const url =
      'https://router.project-osrm.org/route/v1/driving/' +

      `${this.sourcePoint.longitude},${this.sourcePoint.latitude};` +

      `${destination.longitude},${destination.latitude}` +

      '?overview=full&geometries=geojson';


    try {

      const response =
        await fetch(
          url
        );


      if (
        !response.ok
      ) {

        throw new Error(
          `Route request failed: ${response.status}`
        );
      }


      const data =
        await response.json();


      if (
        !data.routes ||
        data.routes.length === 0
      ) {

        throw new Error(
          'No driving route found.'
        );
      }


      const route =
        data.routes[0];


      /*
       * meters -> kilometers
       */
      this.routeDistanceKm =
        route.distance / 1000;


      /*
       * seconds -> minutes
       */
      this.routeDurationMinutes =
        route.duration / 60;


      /*
       * Draw road route.
       */
      this.routeLayer =
        L.geoJSON(
          route.geometry,
          {
            style: {
              color: '#1976d2',
              weight: 5,
              opacity: 0.8
            }
          }
        )
          .addTo(
            this.map
          );


      /*
       * Zoom map to full route.
       */
      const bounds =
        this.routeLayer
          .getBounds();


      if (
        bounds.isValid()
      ) {

        this.map.fitBounds(
          bounds,
          {
            padding: [
              30,
              30
            ]
          }
        );
      }


      this.loadingRoute =
        false;
    }
    catch (
      error
    ) {

      console.error(
        'Route calculation failed:',
        error
      );


      this.routeError =
        'Unable to calculate route.';


      this.routeDistanceKm =
        null;


      this.routeDurationMinutes =
        null;


      this.loadingRoute =
        false;
    }
  }


  // =========================================
  // CLEAR ROUTE
  // =========================================

  private clearRoute(): void {

    this.clearRouteLayer();


    this.routeDistanceKm =
      null;


    this.routeDurationMinutes =
      null;


    this.routeError =
      '';
  }


  // =========================================
  // CLEAR ROUTE LAYER
  // =========================================

  private clearRouteLayer(): void {

    if (
      this.map &&
      this.routeLayer
    ) {

      this.map.removeLayer(
        this.routeLayer
      );


      this.routeLayer =
        undefined;
    }
  }


  // =========================================
  // DESTROY MAP
  // =========================================

  ngOnDestroy(): void {

    if (
      this.map
    ) {

      this.map.off();

      this.map.remove();

      this.map =
        undefined;
    }
  }
}