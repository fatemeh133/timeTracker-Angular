import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user';
import { codeMeliValidator } from '../validator/CodeMeli.validator';

@Component({
  selector: 'app-user-option',
  templateUrl: './user-option.component.html',
  styleUrl: './user-option.component.css',
})
export class UserOptionComponent {
  reactiveForm!: FormGroup;
  user: User = {
    nameOfUser: '',
    codeMeli: '',
    userName: '',
    birthDate: '',
    password: '',
  };

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      name: new FormControl('', Validators.required),
      codeMeli: new FormControl('', [Validators.required, codeMeliValidator]),
      userName: new FormControl('', Validators.required),
      birthDate: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit(reactiveForm: FormGroup) {}
  selectedFile: File | null = null;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }
}
