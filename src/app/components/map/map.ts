import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

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
  implements
  AfterViewInit,
  OnChanges,
  OnDestroy {

  // user selected source point from the drop down in package form
  @Input()
  sourcePoint?: MapPoint;

  // user selected destination point after creating the package 
  @Input()
  destinationPoint?: MapPoint ;

  // when admin want to create route for the package, he can select multiple points from the warehouse list and the route will be created for the package
  @Input()
  locationList: MapPoint[] = [];

  // source and destination points and route distance and duration will be emitted to the parent component when user select the destination point from the map
  @Output()
  destinationPointChange =
    new EventEmitter<MapOutputData>();


  // import the map object from leaflet library
  private map?: L.Map;

  // mark point in the map for the source point
  private sourceMarker?:
    L.Marker;

  // mark point in the map for the destination point
  private destinationMarker?:
    L.Marker;

  // add routes in the map between source and destination points
  private routeLayer?:
    L.GeoJSON;


  // =========================================
  // ROUTE INFORMATION
  // =========================================

  routeDistanceKm:
    number | null = null;


  routeDurationMinutes:
    number | null = null;


  loadingRoute = false;


  routeError = '';

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
      changes['sourcePoint']
    ) {

      console.log('Source Point Changed in map.');
      this.renderSource();
    }


    if (
      changes['destinationPoint']
    ) {

      this.renderDestination();
      console.log('Source Point Changed in map.');
      this.clearRoute();

      if (
        this.sourcePoint &&
        this.destinationPoint
      ) {
        
        this.loadRoute();

      }
      else {

        this.clearRoute();
      }

    }
  }


  private initializeMap(): void {

    /*
     * Default center.
     * Sri Lanka center.
     */
    const defaultLatitude =
      this.sourcePoint?.latitude ??
      7.8731;


    const defaultLongitude =
      this.sourcePoint?.longitude ??
      80.7718;

    // assign value for the map object from leaflet library

    this.map =
      L.map(
        'courier-map',
        {
          center: [
            defaultLatitude,
            defaultLongitude
          ],

          zoom:
            this.sourcePoint
              ? 13
              : 8
        }
      );

    // Show the actual street map
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,

        attribution:
          '&copy; OpenStreetMap contributors'
      }
    )
      .addTo(
        this.map
      );


    /*
     * IMPORTANT:
     *
     * Clicking ANYWHERE on the map
     * selects a destination.
     */
    this.map.on(
      'click',
      event => {

        this.handleMapClick(
          event
        );
      }
    );


    this.renderSource();


    if (
      this.destinationPoint
    ) {

      this.renderDestination();

      this.loadRoute();
    }


    /*
     * Useful when the map is inside
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
  // MAP CLICK
  // =========================================

  private async handleMapClick(
    event: L.LeafletMouseEvent
  ): Promise<void> {

    if (!this.sourcePoint) {
      console.warn('Source location must be selected first.');
      return;
    }

    // Set destination
    this.destinationPoint = {
      pointName: 'destination',
      latitude: event.latlng.lat,
      longitude: event.latlng.lng
    };

    // Show destination marker
    this.renderDestination();

    // Calculate route and WAIT for the result
    await this.loadRouteToPoint(
      this.destinationPoint
    );

    // Create output AFTER route calculation
    const point: MapOutputData = {
      source: this.sourcePoint,

      destination: this.destinationPoint,

      routeDistanceKm:
        this.routeDistanceKm ?? 0,

      routeDurationMinutes:
        this.routeDurationMinutes ?? 0
    };

    // Send data to parent
    this.destinationPointChange.emit(point);
  }


  // =========================================
  // SOURCE MARKER
  // =========================================

  private renderSource(): void {


    if (
      !this.map ||
      !this.sourcePoint
    ) {

      return;
    }


    if (
      this.sourceMarker
    ) {

      // remove marked point
      this.map.removeLayer(
        this.sourceMarker
      );
    }


    const sourceLatLng:
      L.LatLngExpression = [

        this.sourcePoint.latitude,

        this.sourcePoint.longitude

      ];


    /*
     * Source marker is fixed.
     *
     * draggable = false
     */
    this.sourceMarker =
      L.marker(
        sourceLatLng,
        {
          draggable:
            false
        }
      )
        .addTo(
          this.map
        )
        .bindPopup(
          '<strong>Source Warehouse</strong>'
        );


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
      !this.destinationPoint
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

    // remove existing destination marker if any
    this.removeDestinationMarker();

    // create a new destination marker at the specified point
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


  private removeDestinationMarker():
    void {

    if (
      this.map &&
      this.destinationMarker
    ) {

      // remove the existing destination marker from the map
      this.map.removeLayer(
        this.destinationMarker
      );


      this.destinationMarker =
        undefined;
    }
  }


  private loadRoute(): void {

    if (
      !this.sourcePoint ||
      !this.destinationPoint
    ) {

      this.clearRoute();

      return;
    }

    this.clearRoute();

    this.loadRouteToPoint(
      this.destinationPoint
    );
  }


  private async loadRouteToPoint(
    destination: MapPoint
  ): Promise<void> {

    if (
      !this.map ||
      !this.sourcePoint
    ) {

      return;
    }


    this.loadingRoute =
      true;


    this.routeError =
      '';

    // if there is an existing route layer, remove it before drawing a new route
    this.clearRouteLayer();


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
          'Route request failed.'
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


      // meters -> kilometers
      this.routeDistanceKm =
        route.distance / 1000;


      // seconds -> minutes
      this.routeDurationMinutes =
        route.duration / 60;


      /*
       * Draw actual road route.
       */
      this.routeLayer =
        L.geoJSON(
          route.geometry
        )
          .addTo(
            this.map
          );


      /*
       * Zoom to the full route.
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


      console.log(
        'Route distance:',
        this.routeDistanceKm,
        'km'
      );


      console.log(
        'Route duration:',
        this.routeDurationMinutes,
        'minutes'
      );

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


  private clearRoute(): void {

    this.clearRouteLayer();


    this.routeDistanceKm =
      null;


    this.routeDurationMinutes =
      null;


    this.routeError =
      '';
  }



  private clearRouteLayer(): void {

    if (
      this.map &&
      this.routeLayer
    ) {

      // remove the existing route layer from the map
      this.map.removeLayer(
        this.routeLayer
      );


      this.routeLayer =
        undefined;
    }
  }


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