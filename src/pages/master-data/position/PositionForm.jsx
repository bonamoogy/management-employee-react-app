import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import { toast } from "react-toastify";

const PositionForm = ({ position, onSave, onClose }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (position) {
      setName(position.name);
    }
  }, [position]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave({ id: position?.id || null, name });

    try {
      const payload = { name };
      const apiCall = position
        ? api.put(`/master-data/positions/${position.id}`, payload)
        : api.post("/master-data/positions", payload);

      const resp = await apiCall;
      onSave(resp.data);
      setName("");
      toast.success("Success saving data!");
    } catch (error) {
      toast.error(error?.message ?? "Error saving position data!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 p-6 bg-white rounded-lg">
        <h2 className="text-xl font-bold mb-4">
          {position ? "Edit" : "Create"} Position
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label" htmlFor="name">
              <span className="label-text">Position Name</span>
            </label>
            <input
              id="name"
              type="text"
              className="input input-bordered"
              value={name}
              placeholder="Please enter a name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-secondary mr-2"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-sm btn-primary">
              {position ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PositionForm;
