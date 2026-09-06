import { Component } from '@angular/core';
import { MapComponent, MapLocation } from '../../../components/map/map';

@Component({
  imports: [MapComponent],
  selector: 'app-package',
  styleUrl: './package.scss',
  templateUrl: './package.html',
})
export class Package {
   locations: MapLocation[] = [
    
    {
      latitude: 6.9271,
      longitude: 79.8612,
      label: 'Colombo Warehouse',
      description: 'Main warehouse'
    },

    {
      latitude: 7.2906,
      longitude: 80.6337,
      label: 'Kandy',
      description: 'Delivery location'
    },

    {
      latitude: 6.0535,
      longitude: 80.2210,
      label: 'Galle',
      description: 'Customer location'
    },

    {
      latitude: 7.8731,
      longitude: 80.7718,
      label: 'Central Location'
    }

  ];
}
