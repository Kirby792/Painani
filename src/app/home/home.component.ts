import { Component } from '@angular/core';
import { ApiRestService } from '../api-rest.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  preguntas = [
    { no: 1, titulo: 'No hay', correo: "", descripcion: "", fecha: "", id: "", imageUrl: "" },
  ];
  newP = { descripcion: "", titulo: "", imageUrl: "" }
  mod = { descripcion: "", titulo: "", id: "" }

  // Nueva propiedad para almacenar la imagen seleccionada
  selectedFile: File | null = null;

  constructor(
    private api: ApiRestService,
    private msg: ToastrService
  ) { }

  ngOnInit(): void {
    this.consultar()
  }

  // Método para consultar preguntas
  consultar() {
    this.api.getAllPreguntas().subscribe({
      next: datos => {
        let documentos = datos.documents.filter((d: any) => d.hasOwnProperty('fields'));
        let i = 1;
        let titulos = documentos.map((p: { name: string, fields: any }) => {
          const id = p.name.split("/").pop();
          return {
            no: i++,
            titulo: p.fields.pregunta?.stringValue || "",
            correo: p.fields.correo?.stringValue || "",
            descripcion: p.fields.descripcion?.stringValue || "",
            fecha: p.fields.fecha?.timestampValue || "",
            id: id || "",
            imageUrl: id ? this.api.getUrlImagen(id) : ""
          };
        });
        console.log(titulos);
        this.preguntas = titulos;
      },
      error: e => { }
    });
  }

  // Método para manejar la selección de la imagen
  handleFileInput(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file;
  }

  // Método para crear una nueva noticia
  crearNoticia() {
    const fecha = new Date().toISOString();
    if (this.newP.titulo == "" || this.newP.descripcion == "") {
      this.msg.error("Falta llenar los datos")
      return;
    }
    
    const correo = localStorage.getItem("correo") || "";

    // Verificamos si hay una imagen seleccionada
    if (this.selectedFile) {
      const imageName = `${Date.now()}_${this.selectedFile.name}`;
      // Subimos la imagen al storage
      this.api.uploadImage(imageName, this.selectedFile).subscribe({
        next: resp => {
          // Obtenemos la URL de la imagen después de subirla
          const imageUrl = this.api.getUrlImagen(imageName);
          // Añadimos la URL a la pregunta antes de crearla
          this.newP.imageUrl = imageUrl;

          // Creamos la pregunta con la imagen
          this.api.createPregunta(this.newP.titulo, correo, this.newP.descripcion, fecha, imageUrl).subscribe({
            next: resp => {
              this.consultar();
              this.msg.success("Noticia Creada");
              // Reiniciamos la imagen seleccionada después de subirla
              this.selectedFile = null;
            },
            error: e => { console.log(e); this.msg.error("Error al crear la noticia") }
          });
        },
        error: e => { console.log(e); this.msg.error("Error al subir la imagen") }
      });
    } else {
      // Si no hay imagen seleccionada, continuamos con la creación de la pregunta sin imagen
      this.api.createPregunta(this.newP.titulo, correo, this.newP.descripcion, fecha, "").subscribe({
        next: resp => { this.consultar(); this.msg.success("Noticia Creada") },
        error: e => { console.log(e); this.msg.error("Error al crear la noticia") }
      });
    }
  }

  eliminarPregunta(id: string) {
    this.api.deletePregunta(id).subscribe({
      next: resp => { this.consultar() },
      error: e => { console.log(e) }
    })
  }

  modificarPregunta() {
    this.api.updatePregunta(this.mod.titulo, this.mod.id).subscribe({
      next: resp => { this.consultar() },
      error: e => { console.log(e) }
    })
  }

  editarPregunta(p: any) {
    this.mod = JSON.parse(JSON.stringify(p))
  }
}
