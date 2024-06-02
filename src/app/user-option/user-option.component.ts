import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { codeMeliValidator } from '../validator/CodeMeli.validator';
import { ConnectionService } from '../services/connection.service';
import moment from 'jalali-moment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-option',
  templateUrl: './user-option.component.html',
  styleUrl: './user-option.component.css',
})
export class UserOptionComponent {
  constructor(
    private userService: ConnectionService,
    private http: HttpClient
  ) {}
  reactiveForm!: FormGroup;
  loggedInId!: number;
  usernames: string[] = [];
  codemelies: string[] = [];
  imageUrl: string | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedFileName!: string;

  ngOnInit() {
    this.reactiveForm = new FormGroup({
      name: new FormControl('', Validators.required),
      codeMeli: new FormControl('', [Validators.required, codeMeliValidator]),
      userName: new FormControl('', Validators.required),
      birthDate: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      profilePicture: new FormControl(''),
    });
    localStorage.setItem('currentRoute', '/option');
  }

  ngAfterViewInit() {
    this.loggedInId = Number(localStorage.getItem('logedUserId'));

    this.userService.getOneUser(this.loggedInId);
    this.userService.user.subscribe((user) => {
      if (user.profilePicturePath) {
        this.imageUrl = user.profilePicturePath;
      }

      const jsDate = moment(user.birthDate, 'jYYYY/jMM/jDD').toDate();
      this.reactiveForm.patchValue({
        name: user.nameOfUser,
        codeMeli: user.codeMeli,
        userName: user.userName,
        birthDate: jsDate,
        password: user.password,
      });
    });
  }

  getPicUrl() {
    this.userService.getOneUser(this.loggedInId);
    this.userService.user.subscribe((user) => {
      if (user.profilePicturePath) {
        this.imageUrl = user.profilePicturePath;
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.selectedFileName = file.name;

    if (file) {
      this.reactiveForm.patchValue({
        profilePicture: file,
      });
    }
  }
  deletepic() {
    const parts = this.imageUrl!.split('/');
    const fileName = parts[parts.length - 1];
    this.userService.deleteImage(fileName);

    this.userService.userPicDeleted.subscribe((data) => {
      //getPicUrl
      this.userService.getOneUser(this.loggedInId);
      this.userService.user.subscribe((user) => {
        if (user.profilePicturePath === null) {
          this.imageUrl = user.profilePicturePath;
        }
      });
      this.reactiveForm.patchValue({
        profilePicture: null,
      });
      this.selectedFileName = '';
    });
  }

  onSubmit(form: FormGroup) {
    const formData = new FormData();

    const nameOfUser = form.controls['name'].value;
    const codeMeli = form.controls['codeMeli'].value.toString();
    const password = form.controls['password'].value;
    const jsDate = form.controls['birthDate'].value;
    const persianDate = moment(jsDate).format('jYYYY/jMM/jDD');
    const birthDate = persianDate;
    const userName = form.controls['userName'].value;

    if (form.controls['profilePicture'].value) {
      formData.append('profilePicture', form.controls['profilePicture'].value);
    }

    formData.append('nameOfUser', nameOfUser);
    formData.append('codeMeli', codeMeli);
    formData.append('password', password);
    formData.append('birthDate', birthDate);
    formData.append('userName', userName);

    this.userService.putUser(this.loggedInId, formData);
    this.userService.userPuted.subscribe((data) => {
      this.getPicUrl();
    });
  }

  triggerInput(): void {
    this.fileInput.nativeElement.click();
  }
}
