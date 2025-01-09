import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import { toast } from "react-toastify";

const UnitForm = ({ unit, onSave, onClose }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (unit) {
      setName(unit.name);
    }
  }, [unit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave({ id: unit?.id || null, name });

    try {
      const payload = { name };
      const apiCall = unit
        ? api.put(`/master-data/units/${unit.id}`, payload)
        : api.post("/master-data/units", payload);

      const resp = await apiCall;
      onSave(resp.data);
      setName("");
      toast.success("Success saving data!");
    } catch (error) {
      toast.error(error?.message ?? "Error saving employee data!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 p-6 bg-white rounded-lg">
        <h2 className="text-xl font-bold mb-4">
          {unit ? "Edit" : "Create"} Unit
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label" htmlFor="name">
              <span className="label-text">Nama Unit</span>
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
              {unit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnitForm;
