import React, { useEffect, useState } from "react";
import PositionForm from "./PositionForm";
import api from "../../../services/api";
import { toast } from "react-toastify";

const PositionList = () => {
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    api
      .get("/master-data/positions")
      .then((response) => {
        setPositions(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleCreate = () => {
    setSelectedPosition(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (position) => {
    setSelectedPosition(position);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this position?")) {
      try {
        await api.delete(`/master-data/positions/${id}`).then(() => {
          setPositions(positions.filter((position) => position.id !== id));
        });
        toast.success("Position is deleted!");
      } catch (error) {
        toast.error(error?.message ?? "Failed to delete position");
      }
    }
  };

  const handleSave = (position) => {
    console.log("-- new data --", position);
    if (selectedPosition) {
      setPositions(positions.map((p) => (p.id === position.id ? position : p)));
    } else {
      setPositions([...positions, position]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Position List</h2>

      <div className="divider" />

      <button className="btn btn-sm btn-primary mb-4" onClick={handleCreate}>
        Create Position
      </button>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Position Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr key={position.id}>
              <td>{position.name}</td>
              <td>
                <button
                  onClick={() => handleEdit(position)}
                  className="btn btn-sm btn-primary mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(position.id)}
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
        <PositionForm
          position={selectedPosition}
          onSave={handleSave}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default PositionList;
