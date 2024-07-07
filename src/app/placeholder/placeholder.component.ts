import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.css',
})
export class PlaceholderComponent {
  placeholder!: string;

  constructor(public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.placeholder = data['placeholder'];
      console.log('data', data);
    });
    console.log('placeholder', this.placeholder);
  }
}
