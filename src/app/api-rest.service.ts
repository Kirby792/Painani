import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiRestService {
  urlLogin = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA1ihS21WEuOopmpEl-PM2gtkRoIfE0LSA"
  urlRegiter = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA1ihS21WEuOopmpEl-PM2gtkRoIfE0LSA"
  url = "https://firestore.googleapis.com/v1/projects/painani-a439d/databases/(default)/documents/"
  urlImages = "https://firebasestorage.googleapis.com/v0/b/painani-a439d.appspot.com"

  constructor(private http: HttpClient) { }

  login(email: string, pass: string) { 
    return this.http.post(this.urlLogin, { email: email, password: pass, returnSecureToken: true })
  }

  register(email: string, pass: string) {
    return this.http.post(this.urlRegiter, { email: email, password: pass, returnSecureToken: true })
  }

  getAllPreguntas() {
    return this.http.get<any>(this.url + "preguntas?pageSize=1000")
  }

  createPregunta(pregunta: string, correo: string, descripcion: string, fecha: string, imageUrl: string) {
    const newDoc = {
      fields: {
        pregunta: { stringValue: pregunta },
        correo: { stringValue: correo },
        descripcion: { stringValue: descripcion },
        fecha: { timestampValue: fecha },
        imageUrl: { stringValue: imageUrl } // Agregamos el campo para la URL de la imagen
      }
    }

    return this.http.post(this.url + "preguntas", newDoc);
  
  }

  deletePregunta(id: string) {
    return this.http.delete(this.url + "preguntas/" + id)
  }

  updatePregunta(pregunta: string, id: string) {
    const newDoc = {
      fields: {
        pregunta: { stringValue: pregunta }
      }
    }
    return this.http.patch(this.url + "preguntas/" + id + "?updateMask.fieldPaths=pregunta", newDoc)
  }

  uploadImage(filename: string, file: File) {
    const form = new FormData();
    form.append("file", file)
    return this.http.post(this.urlImages + filename, form)
  }

  downloadImage(filename: string) {
    return this.http.get(this.urlImages + filename + "?alt=media")
  }
  getUrlImagen(id: string) {
    return this.urlImages + `/noticias/${id}.jpg`; // Ajusta la ruta según tu estructura de almacenamiento
  }
}
