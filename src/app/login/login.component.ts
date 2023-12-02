import { Component, ViewEncapsulation } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ApiRestService } from '../api-rest.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
[x: string]: any;
  email = ""
  pass = ""
  showError = false
  showLoading = false
  //myimage:string ="assets/images/fondo.jpg";
  constructor(
    private router:Router, 
    private api: ApiRestService,
    private msg: ToastrService
    ){}
  login(){
    this.showLoading = true
    this.api.login(this.email, this.pass).subscribe({
      next:respuestas =>{
        this.msg.success("Bienvenido a Painani")
      localStorage.setItem("correo", this.email);
      this.router.navigate(['/home']);
      
    },
      error: problemita =>{
        this.msg.error("Error en las credenciales")
        this.showLoading = false
        this.showError = true
      }
    })
  }
}