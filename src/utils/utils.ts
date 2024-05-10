import { Dispatch, SetStateAction } from "react";
import Swal from "sweetalert2";


export const onDelete = async (
  item: any,
  deleteFunction: (item: any) => Promise<void>,
  fetchFunction: () => Promise<void>, 
  successCallback?: () => void,
  errorCallback?: (error: any) => void
) => {
  try {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) {
      // Si el usuario cancela la eliminación, no hacemos nada
      return;
    }

    await deleteFunction(item);
    // Después de eliminar exitosamente, realizar un nuevo fetch para actualizar los elementos
    await fetchFunction();
    if (successCallback) {
      successCallback();
    }
    await Swal.fire('¡Eliminado!', 'El elemento ha sido eliminado correctamente', 'success');
  } catch (error) {
    // Manejo de errores
    console.error('Error al eliminar:', error);
    if (errorCallback) {
      errorCallback(error);
    }
    await Swal.fire('Error', 'Ha ocurrido un error al intentar eliminar el elemento', 'error');
  }
};


/**
 * Función para realizar una búsqueda dentro de un conjunto de datos.
 * @param query La cadena de búsqueda.
 * @param data Array de datos en el que se realizará la búsqueda.
 * @param nombre El nombre de la propiedad sobre la que se realizará la búsqueda.
 * @param setData Función para actualizar los datos filtrados con los resultados de la búsqueda.
 */
export const handleSearch = (
    query: string,
    data: any[],
    nombre: string, // Cambiado a string en lugar de any
    setData: Dispatch<SetStateAction<any[]>>
  ) => {
    const filtered = data.filter((item) =>
      item[nombre].toLowerCase().includes(query.toLowerCase())
    );
    setData(filtered);
  };
  


