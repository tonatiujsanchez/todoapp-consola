require('colors')

const { guardarDB, leerDB } = require('./helpers/guardarArchivo')
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoCheckList } = require('./helpers/inquirer')
const Tareas = require('./models/tareas')


const main = async() => {
   
    let opt = ''
    const tareas = new Tareas()
    
    const tareasDB = leerDB()

    if( tareasDB ){
        // Establecer las tareas
        tareas.cargarTareaFromArr( tareasDB )
    }


    do {
        // Imprimir menú
        opt = await inquirerMenu()
        
        switch (opt) {
            case '1': // Crear nueva tarea
                const desc = await leerInput('Descripcion: ')
                if( desc !== '0' ){
                    tareas.crearTarea(desc)
                    console.log('\n¡Tarea creada!')
                }
                break;
        
            case '2': // Listar todos
                tareas.listadoCompleto()
                break;

            case '3': // Listar completados
                tareas.listarPendientesCompletadas(true)
                break;
        
            case '4': // Listar pendientes
                tareas.listarPendientesCompletadas(false)
                break;

            case '5': // Actualizar: completado | pendiente
                const ids = await mostrarListadoCheckList(tareas.listadoArr)
                tareas.toggleCompletadas( ids )
                break;

            case '6': // Borrar tarea
                const idTarea = await listadoTareasBorrar( tareas.listadoArr )
                if(idTarea === '0'){
                    break;
                }
                
                const ok = await confirmar('¿Desea eliminar esta tarea?')
                if(ok){
                    tareas.borrarTarea(idTarea)
                    console.log('\n¡Tarea borrada!');
                }
                break;

        }

        guardarDB( tareas.listadoArr )

        await pausa()
        
    } while ( opt !== '0' );
    
}

main()