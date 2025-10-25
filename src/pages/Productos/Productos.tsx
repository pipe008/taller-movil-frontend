import React, { useEffect, useState } from "react";
import { api } from "../../api/api"; // ✅ Asegúrate que esta ruta sea correcta
import "./Productos.css";

const categorias = [
  "Bebidas",
  "Snacks",
  "Aseo",
  "Lácteos",
  "Panadería",
  "Otros",
];

const Productos: React.FC = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    categoria: categorias[0],
    stock: "", // 👈 nuevo campo
  });
  const [busqueda, setBusqueda] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // ✅ OBTENER productos del backend
  const obtenerProductos = async () => {
    try {
      const res = await api.get("/productos");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      alert("Error al conectar con el servidor");
    }
  };

  // ✅ Cargar productos al iniciar el componente
  useEffect(() => {
    obtenerProductos();
  }, []);

  // ✅ Manejar cambios del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Crear o actualizar producto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.precio) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      if (editId !== null) {
        await api.put(`/productos/${editId}`, formData);
        alert("Producto actualizado correctamente ✅");
        setEditId(null);
      } else {
        await api.post("/productos", formData);
        alert("Producto agregado correctamente ✅");
      }

      setFormData({ nombre: "", precio: "", categoria: categorias[0], stock: "" });
      obtenerProductos();
    } catch (error) {
      console.error("Error al guardar producto:", error);
      alert("Error al guardar el producto");
    }
  };

  // ✅ Eliminar producto
  const eliminarProducto = async (id: number) => {
    if (window.confirm("¿Deseas eliminar este producto?")) {
      try {
        await api.delete(`/productos/${id}`);
        obtenerProductos();
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        alert("Error al eliminar el producto");
      }
    }
  };

  // ✅ Editar producto (carga los datos al formulario)
  const editarProducto = (producto: any) => {
    setFormData(producto);
    setEditId(producto.id);
  };

  // ✅ Filtrar productos por nombre
  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="productos-container">
      <div className="header">
        <h1>🛒 Gestión de Productos</h1>
        <p className="subtitulo">Administra tu inventario fácilmente</p>
      </div>

      <div className="buscador">
        <input
          type="text"
          placeholder="Buscar producto por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <form className="productos-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={formData.precio}
          onChange={handleChange}
          required
        />
        <select
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
        >
          {categorias.map((c, index) => (
            <option key={index} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button type="submit" className="btn-guardar">
          {editId !== null ? "Actualizar Producto" : "Guardar Producto"}
        </button>
      </form>

      <h2>Lista de Productos</h2>
      <table className="productos-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.length === 0 ? (
            <tr>
              <td colSpan={4}>No hay productos registrados</td>
            </tr>
          ) : (
            productosFiltrados.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>${parseFloat(p.precio).toLocaleString()}</td>
                <td>{p.categoria}</td>
                <td>
                  <button
                    className="btn-editar"
                    onClick={() => editarProducto(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => eliminarProducto(p.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Productos;
