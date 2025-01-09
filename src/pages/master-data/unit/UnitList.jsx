import React, { useEffect, useState } from "react";
import UnitForm from "./UnitForm";
import api from "../../../services/api";
import { toast } from "react-toastify";

const UnitList = () => {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    api
      .get("/master-data/units")
      .then((response) => {
        setUnits(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleCreate = () => {
    setSelectedUnit(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (unit) => {
    setSelectedUnit(unit);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this unit?")) {
      try {
        await api.delete(`/master-data/units/${id}`).then(() => {
          setUnits(units.filter((unit) => unit.id !== id));
        });
        toast.success("Unit is deleted!");
      } catch (error) {
        toast.error(error?.message ?? "Failed delete unit");
      }
    }
  };

  const handleSave = (unit) => {
    if (selectedUnit) {
      setUnits(units.map((u) => (u.id === unit.id ? unit : u)));
    } else {
      setUnits([...units, unit]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Employee List</h2>

      <div className="divider" />

      <button className="btn btn-sm btn-primary mb-4" onClick={handleCreate}>
        Create Unit
      </button>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Nama Unit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.id}>
              <td>{unit.name}</td>
              <td>
                <button
                  onClick={() => handleEdit(unit)}
                  className="btn btn-sm btn-primary mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(unit.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isDialogOpen && (
        <UnitForm
          unit={selectedUnit}
          onSave={handleSave}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default UnitList;
