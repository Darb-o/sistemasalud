$(document).ready(function() {
    llenarMunicipio();
    llenarAfiliacion();
    llenarEspecialidad();
})

function llenarMunicipio() {
    let insercion = `<select class="form-control form-select-md" id="uMunicipio" aria-label="Floating label select example">`;
    let opcion = 1;
    $.ajax({
        url: "bd/peticiones.php",
        type: "POST",
        dataType: "JSON",
        data: { opcion: opcion },
        success: function(data) {
            if (data != null) {
                for (i in data) {
                    insercion += `<option value="${data[i].idmunicipio}">${data[i].municipio}</option>`;
                }
                insercion += `</select><label for="floatingSelect">Seleccione su municipio de residencia</label>`;
                $("#selectMunicipio").append(insercion);
            }
        },
    });
}

function llenarAfiliacion() {
    let insercion = `<select class="form-control form-select-md" id="uAfiliacion" aria-label="Floating label select example">`;
    let opcion = 2;
    $.ajax({
        url: "bd/peticiones.php",
        type: "POST",
        dataType: "JSON",
        data: { opcion: opcion },
        success: function(data) {
            if (data != null) {
                for (i in data) {
                    insercion += `<option value="${data[i].idafiliacion}">${data[i].tipoafiliacion}</option>`;
                }
                insercion += `</select><label for="floatingSelect">Seleccione su tipo de afiliacion</label>`;
                $("#selectAfiliacion").append(insercion);
            }
        },
    });
}

$("#formRegistrarse").submit(function(e) {
    e.preventDefault();
    let opcion = 3
    let uId = $.trim($("#uId").val());
    let uNombre = $.trim($("#uNombre").val());
    let uDireccion = $.trim($("#uDireccion").val());
    let uTelefono = $.trim($("#uTelefono").val());
    let uPassword = $.trim($("#uPassword").val());
    let uMunicipio = $.trim($("#uMunicipio").val());
    let uAfiliacion = $.trim($("#uAfiliacion").val());
    Swal.fire({
        title: 'Confirmar datos',
        text: `Nombre: ${uNombre}, Identificacion: ${uId}, Telefono: ${uTelefono}, Direccion: ${uDireccion}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Registrame!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: 'bd/peticiones.php',
                type: 'POST',
                dataType: 'JSON',
                data: { opcion: opcion, uId: uId, uNombre: uNombre, uDireccion: uDireccion, uTelefono: uTelefono, uPassword: uPassword, uMunicipio: uMunicipio, uAfiliacion: uAfiliacion },
                success: function(data) {
                    console.log(data);
                    if (data == null) {
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top',
                            showConfirmButton: false,
                            timer: 5000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })
                        Toast.fire({
                            icon: 'success',
                            title: `Usuario ${uNombre} registrado con exito`
                        })
                        $("#formRegistrarse").trigger("reset")
                    } else {
                        const Toast = Swal.mixin({
                            toast: true,
                            position: 'top',
                            showConfirmButton: false,
                            timer: 5000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                                toast.addEventListener('mouseenter', Swal.stopTimer)
                                toast.addEventListener('mouseleave', Swal.resumeTimer)
                            }
                        })
                        Toast.fire({
                            icon: 'error',
                            title: 'Usuario ya registrado',
                            text: 'El usuario ya esta registrado, acceda con su cuenta o verifique sus datos',
                        })
                    }
                }
            });
        }
    })
});

$("#formInicioSesion").submit(function(e) {
    e.preventDefault();
    let opcion = 4;
    let uId = $.trim($("#inicioUsuario").val());
    let uPassword = $.trim($("#inicioClave").val());
    $.ajax({
        url: 'bd/peticiones.php',
        type: 'POST',
        dataType: 'JSON',
        data: { opcion: opcion, uId: uId, uPassword: uPassword },
        success: function(data) {
            if (data == null) {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
                Toast.fire({
                    icon: 'error',
                    title: 'Identificacion o contraseña incorrectos'
                })
            } else {
                opcion = data[0].rol_fk;
                if (opcion == 2) {
                    window.location.href = 'usuario.php';
                } else {
                    window.location.href = 'medico.php';
                }
            }
        },
    });
});

$("#btnCerrarSesion").click(function(e) {
    let opcion = 5;
    e.preventDefault();
    Swal.fire({
        title: 'Estas seguro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, cierra la sesion!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: 'bd/peticiones.php',
                type: 'POST',
                dataType: 'JSON',
                data: { opcion: opcion }
            });
            window.location.href = 'index.php';
        }
    })
});

$("#btnAgendarCita1").click(function(e) {
    $("#modalCita").modal('show');
    $("#fechaCita").val("");
});

$("#btnAgendarCita2").click(function(e) {
    $("#modalCita").modal('show');
    $("#fechaCita").val("");
});

$("#fechaCita").change(function() {
    let fecha = $("#fechaCita").val();
    let especialidad = $("#mEspecialidad").val();
    let dia = 0;
    if (fecha != "") {
        dia = diaSemana(fecha);
        llenartabla(especialidad, fecha, dia);
    }
});

$(document).on("change", "#mEspecialidad", function() {
    let fecha = $("#fechaCita").val();
    let especialidad = $("#mEspecialidad").val();
    let dia = 0;
    if (fecha != "") {
        dia = diaSemana(fecha);
        llenartabla(especialidad, fecha, dia);
    }
});

function diaSemana(fecha) {
    let fecha1 = new Date(fecha);
    let dia = fecha1.getDay();
    if (dia == 6) {
        dia = 0;
    } else {
        dia += 1;
    }
    return dia;
}

function llenartabla(especialidad, fecha, dia) {
    let opcion = 7;
    tablaCita = $('#tablaCita').DataTable({
        destroy: true,
        ajax: {
            url: "bd/peticiones.php",
            method: "POST",
            data: { opcion: opcion, especialidad: especialidad, diasemana: dia, fechacita: fecha },
            dataSrc: "",
            error: function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 0) {
                    alert('Not connect: Verify Network.');
                } else if (jqXHR.status == 404) {
                    alert('Requested page not found [404]');
                } else if (jqXHR.status == 500) {
                    alert('Internal Server Error [500].');
                } else if (textStatus === 'parsererror') {
                    alert('Requested JSON parse failed.');
                } else if (textStatus === 'timeout') {
                    alert('Time out error.');
                } else if (textStatus === 'abort') {
                    alert('Ajax request aborted.');
                } else {
                    alert('Uncaught Error: ' + jqXHR.responseText);
                }
            }
        },
        language: {
            sProcessing: "Procesando...",
            sLengthMenu: "Mostrar _MENU_ registros",
            sZeroRecords: "No se encontraron resultados",
            sEmptyTable: "Ningún dato disponible en esta tabla",
            sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            sInfoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
            sInfoPostFix: "",
            sSearch: "Buscar:",
            sUrl: "",
            sInfoThousands: ",",
            sLoadingRecords: "Cargando...",
            oPaginate: {
                sFirst: "Primero",
                sLast: "Último",
                sNext: "Siguiente",
                sPrevious: "Anterior"
            },
            oAria: {
                sSortAscending: ": Activar para ordenar la columna de manera ascendente",
                sSortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        columns: [
            { title: "Id", data: "idmedico" },
            { title: "Licencia", data: "numlicencia" },
            { title: "Medico", data: "nombre" },
            { title: "Especialidad", data: "especialidad" },
            { "defaultContent": `<div class='text-center'>
                <a type='button' role='button' id='pedirCitaMedico' ><ion-icon name="checkbox-outline"></ion-icon></a></div>` }
        ]
    });
}

$(document).on("click", "#pedirCitaMedico", function() {
    let opcion = 8;
    let fila = $(this).closest('tr');
    let idMedico = parseInt(fila.find('td:eq(0)').text());
    let licenciaMedico = parseInt(fila.find('td:eq(1)').text());
    let fecha = $("#fechaCita").val();
    let dia = diaSemana(fecha);
    let horainicio, horafinal;
    let prueba;
    let arregloconsultas = new Array();
    let arreglohorarios = new Array();
    let bandera = true;
    $.ajax({
        url: "bd/peticiones.php",
        type: "POST",
        dataType: "JSON",
        data: { opcion: opcion, idMedico: idMedico, fechacita: fecha },
        success: function(data1) {
            for (i in data1) {
                prueba = new Date(data1[i].fechaconsulta);
                arregloconsultas.push(prueba);
            }
            opcion = 9;
            $.ajax({
                url: "bd/peticiones.php",
                type: "POST",
                dataType: "JSON",
                data: { opcion: opcion, idMedico: idMedico, diasemana: dia },
                success: function(data2) {
                    horainicio = fecha + " " + data2[0].horainicio;
                    horainicio = new Date(horainicio);
                    horafinal = fecha + " " + data2[0].horafinal;
                    horafinal = new Date(horafinal);
                    while (moment(horainicio).isSameOrBefore(horafinal)) {
                        bandera = true;
                        for (i in arregloconsultas) {
                            if (moment(arregloconsultas[i]).isSame(horainicio)) {
                                bandera = false;
                                break;
                            }
                        }
                        if (bandera) {
                            arreglohorarios.push(moment(horainicio).format('YYYY/MM/DD HH:mm:ss'));
                        }
                        horainicio = moment(horainicio).add(30, 'm');
                    }
                    (async() => {
                        const { value: formValues } = await Swal.fire({
                            title: 'Seleccione un horario',
                            html: `<select class="swal2-select" id="selectHDisponibles" required></select>`,
                            didOpen: () => {
                                captura = $("#selectHDisponibles");
                                for (id in arreglohorarios) {
                                    insercion = `<option value="${arreglohorarios[id]}">${arreglohorarios[id]}</option>`
                                    captura.append(insercion);
                                }
                            },

                            preConfirm: () => {
                                return new Promise(function(resolve) {
                                    resolve([
                                        $("#selectHDisponibles").val(),
                                    ]);
                                });
                            }
                        })

                        if (formValues) {
                            let valor = formValues;
                            opcion = 10;
                            console.log("aqui vamos bien " + valor[0]);
                            $.ajax({
                                url: "bd/peticiones.php",
                                type: "POST",
                                dataType: "JSON",
                                data: { opcion: opcion, idMedico: idMedico, licenciaMedico: licenciaMedico, fechacita: valor[0] },
                                success: function(data) {
                                    $("#modalCita").modal('hide');
                                    const Toast = Swal.mixin({
                                        toast: true,
                                        position: 'top',
                                        showConfirmButton: false,
                                        timer: 5000,
                                        timerProgressBar: true,
                                        didOpen: (toast) => {
                                            toast.addEventListener('mouseenter', Swal.stopTimer)
                                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                                        }
                                    })
                                    Toast.fire({
                                        icon: 'success',
                                        title: `Cita asignada en el horario de ${valor[0]}`
                                    })
                                }
                            });
                        }
                    })()
                }
            })
        }
    });
});


function llenarEspecialidad() {
    let insercion = `<select class="form-select" id="mEspecialidad" aria-label="Floating label select example">`;
    let opcion = 6;
    $.ajax({
        url: "bd/peticiones.php",
        type: "POST",
        dataType: "JSON",
        data: { opcion: opcion },
        success: function(data) {
            if (data != null) {
                for (i in data) {
                    insercion += `<option value="${data[i].idespecialidad}">${data[i].especialidad}</option>`;
                }
                insercion += `</select><label for="floatingSelect">Seleccione el tipo de cita</label>`;
                $("#selectEspecialidad").append(insercion);
            }
        },
    });
}