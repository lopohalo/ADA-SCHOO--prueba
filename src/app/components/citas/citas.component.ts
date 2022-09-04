import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsumirService } from 'src/app/services/consumir.service';
import Swal from 'sweetalert2'

// https://www.datos.gov.co/resource/xdk5-pm3f.json
@Component({
    selector: 'app-citas',
    templateUrl: './citas.component.html',
    styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {
    municipiosYdepartamentos: any
    CitasGlobales: any
    ControlCitas: FormGroup
    GuardarCitas: any
    pepe: any
    info: any
    nombre: any
    id: any | null
    @ViewChild('registrarse') registrarseHTML?: ElementRef
    @ViewChild('editar') editar?: ElementRef

    constructor(private fb: FormBuilder, private renderer2: Renderer2, private _serviceCiudades: ConsumirService) {
        this.ControlCitas = fb.group({
            documento: ['', Validators.compose([
                Validators.required,
                Validators.minLength(9),
                Validators.maxLength(10),
            ])],
            nombre: ['', Validators.required],
            pasajeros: ['', Validators.required ],
            fecha: ['', Validators.required],
            origen: ['', Validators.required],
            destino: ['', Validators.required]
        })
    }

    ngOnInit(): void {
        if (localStorage.getItem('citas')) {
            this.info = localStorage.getItem('citas')
            this.pepe = JSON.parse(this.info)
        } else {
            localStorage.setItem('citas', '[]')
            this.info = localStorage.getItem('citas')
            this.pepe = JSON.parse(this.info)
        }
        this.consumirCiudades()
}

    consumirCiudades(){
        this._serviceCiudades.getCiudades().subscribe(ciudades => {
           this.municipiosYdepartamentos = ciudades
           console.log(this.municipiosYdepartamentos)
        })
    }



    generadoraID() {

        let random = Math.random().toString(36).substring(2);
        let fecha = Date.now().toString(36)
        return random + fecha;
    }
    Trayendoobjeto(obj: any) {
        const registrar = this.registrarseHTML?.nativeElement
        this.renderer2.setAttribute(registrar, 'value', 'Editar Cita')
        this.ControlCitas.setValue({
            documento: obj.documento,
            nombre: obj.nombre,
            pasajeros: obj.pasajeros,
            fecha: obj.fecha,
            origen: obj.origen,
            destino: obj.destino
        })
        this.id = obj.id
    }
    Elimiando(id: any) {
        this.id = id
        Swal.fire({
            title: 'Esta Seguro?',
            text: "Esta accion no sea reversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminalo!'
        }).then((result) => {
            if (result.isConfirmed) {
                const arregloGlobal:any = localStorage.getItem('control-medico')
                const arregloGlobal1:any = JSON.parse(arregloGlobal)
                const nuevoarreglo = this.pepe.filter((arregloViejo: any) => arregloViejo.id !== this.id)
                this.GuardarCitas = nuevoarreglo
                const nuevoArregloGlobal = arregloGlobal1.filter((arregloViejo1: any) => arregloViejo1.id !== this.id)
                this.CitasGlobales = nuevoArregloGlobal
                localStorage.setItem('citas', JSON.stringify(this.GuardarCitas))
                localStorage.setItem('control-medico', JSON.stringify(this.CitasGlobales))
                this.id = null
                this.info = localStorage.getItem('citas')
                this.pepe = JSON.parse(this.info)
                Swal.fire(
                    'Eliminado!',
                    'Se ha eliminado correctamente.',
                    'success'
                )
            }
        })
    }
    enviarDatos() {
        const registrar = this.registrarseHTML?.nativeElement

        let citas = {
            documento: this.ControlCitas.get('documento')?.value,
            nombre: this.ControlCitas.get('nombre')?.value,
            pasajeros: this.ControlCitas.get('pasajeros')?.value,
            fecha: this.ControlCitas.get('fecha')?.value,
            origen: this.ControlCitas.get('origen')?.value,
            destino: this.ControlCitas.get('destino')?.value,
            id: ''
        }
        let recogiendo: any = localStorage.getItem('citas')
        let recogido: any = JSON.parse(recogiendo)
        let arregloGlobal:any = localStorage.getItem('control-medico')
        let arregloGlobal1:any =JSON.parse(arregloGlobal)
        if (recogido == null) {
            this.GuardarCitas = []
        } else {
            this.GuardarCitas = recogido
        }
        if(arregloGlobal == null){
            this.CitasGlobales = []
        } else {
            this.CitasGlobales = arregloGlobal1
        }

        if (this.id == null) {
            citas.id = this.generadoraID()
            this.GuardarCitas.push(citas)
            this.CitasGlobales.push(citas)
        } else {
            citas.id = this.id
            const arregloGlobal:any = localStorage.getItem('control-medico')
            const arregloGlobal1:any = JSON.parse(arregloGlobal)
            this.CitasGlobales = arregloGlobal1.map((viejoArreglo: any) => viejoArreglo.id === this.id ? citas : viejoArreglo)

            const nuevoArreglo = this.GuardarCitas.map((viejoArreglo: any) => viejoArreglo.id === this.id ? citas : viejoArreglo)
            this.GuardarCitas = nuevoArreglo
            this.id = null
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Se ha editado correctamento',
                showConfirmButton: false,
                timer: 1500
            })
            this.renderer2.setAttribute(registrar, 'value', 'Registrarse')
        }
        localStorage.setItem('citas', JSON.stringify(this.GuardarCitas))
        setTimeout(() => {
            localStorage.setItem('control-medico', JSON.stringify(this.CitasGlobales))
        },500)
        this.info = localStorage.getItem('citas')
        this.pepe = JSON.parse(this.info)
        this.ControlCitas.reset()
    }

}
