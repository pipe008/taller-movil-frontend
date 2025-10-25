import React, { useEffect, useState } from "react";
import { api } from "../../api/api"; // Ajusta la ruta según tu estructura
import "./Clientes.css";

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    direccion: "",
  });
  const [busqueda, setBusqueda] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // ✅ Obtener lista de clientes desde el backend
  const obtenerClientes = async () => {
    try {
      const res = await api.get("/clientes");
      setClientes(res.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      alert("Error al conectar con el servidor");
    }
  };

  // ✅ Cargar los clientes al montar el componente
  useEffect(() => {
    obtenerClientes();
  }, []);

  // ✅ Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Agregar o editar cliente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.telefono || !formData.correo) {
      alert("Por favor, completa todos los campos obligatorios");
      return;
    }

    try {
      if (editId !== null) {
        await api.put(`/clientes/${editId}`, formData);
        alert("Cliente actualizado correctamente ✅");
        setEditId(null);
      } else {
        await api.post("/clientes", formData);
        alert("Cliente agregado exitosamente ✅");
      }

      setFormData({ nombre: "", telefono: "", correo: "", direccion: "" });
      obtenerClientes();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      alert("Error al guardar el cliente");
    }
  };

  // ✅ Eliminar cliente
  const eliminarCliente = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
      try {
        await api.delete(`/clientes/${id}`);
        obtenerClientes();
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        alert("Error al eliminar el cliente");
      }
    }
  };

  // ✅ Editar cliente (cargar datos en el formulario)
  const editarCliente = (cliente: any) => {
    setFormData(cliente);
    setEditId(cliente.id);
  };

  // ✅ Filtrar por búsqueda
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="clientes-container">
      <div className="header">
        <h1>👥 Gestión de Clientes</h1>
        <p className="subtitulo">Administra tus clientes fácilmente</p>
      </div>

      <div className="buscador">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <form className="clientes-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={formData.correo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="direccion"
          placeholder="Dirección"
          value={formData.direccion}
          onChange={handleChange}
        />

        <button type="submit" className="btn-guardar">
          {editId !== null ? "Actualizar Cliente" : "Guardar Cliente"}
        </button>
      </form>

      <h2>Lista de Clientes</h2>
      <table className="clientes-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.length === 0 ? (
            <tr>
              <td colSpan={5}>No hay clientes registrados</td>
            </tr>
          ) : (
            clientesFiltrados.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.correo}</td>
                <td>{cliente.direccion}</td>
                <td>
                  <button
                    className="btn-editar"
                    onClick={() => editarCliente(cliente)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => eliminarCliente(cliente.id)}
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

export default Clientes;
