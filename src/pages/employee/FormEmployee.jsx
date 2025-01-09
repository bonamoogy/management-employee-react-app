import { useState, useEffect } from "react";
import api from "../../services/api";
import Select from "react-select";

import { toast } from "react-toastify";

const initForm = {
  name: "",
  username: "",
  password: "",
  unitId: "",
  positions: [],
};

const FormEmployee = ({ isOpen, onClose, employee, onSave }) => {
  const [formData, setFormData] = useState(initForm);
  const [units, setUnits] = useState([]);
  const [positions, setPositions] = useState([]);
  const [currentDropdown, setCurrentDropdown] = useState("");

  useEffect(() => {
    api
      .get("/master-data/units")
      .then((response) => {
        setUnits(response.data);
      })
      .catch((err) => console.log(err));

    api
      .get("/master-data/positions")
      .then((response) => {
        setPositions(response.data);
      })
      .catch((err) => console.log(err));

    if (employee) {
      setFormData({
        name: employee.name,
        username: employee.username,
        password: employee.password,
        unitId: employee.unitId,
        positions: employee.positions.map((el) => el.id),
      });
    }
  }, [employee]);

  const handleSave = async () => {
    try {
      const apiCall = employee
        ? api.put(`/employees/${employee.id}`, formData)
        : api.post("/employees", formData);

      await apiCall;
      onSave();
      setFormData(initForm);
    } catch (error) {
      toast.error(error?.message ?? "Error saving employee data!");
    }
  };

  const unitOptions = units.map((unit) => ({
    value: unit.id,
    label: unit.name,
  }));

  const positionOptions = positions.map((position) => ({
    value: position.id,
    label: position.name,
  }));

  const handleUnitChange = (selectedOption) => {
    setFormData({ ...formData, unitId: selectedOption?.value || "" });
  };

  const handlePositionChange = (selectedOptions) => {
    setFormData({
      ...formData,
      positions: selectedOptions.map((option) => option.value),
    });
  };
  const handleAddUnit = async (newUnit) => {
    if (newUnit) {
      try {
        const response = await api.post("/master-data/units", {
          name: newUnit,
        });
        setUnits([...units, response.data]);
        setFormData({ ...formData, unitId: response.data.id });
        toast.success("New unit added!");
      } catch (error) {
        toast.error(error?.message ?? "Error adding unit!");
      }
    }
  };

  const handleAddPosition = async (newPosition) => {
    if (newPosition) {
      try {
        const response = await api.post("/master-data/positions", {
          name: newPosition,
        });
        const newPositionData = response.data;
        setPositions((prev) => [...prev, newPositionData]);
        setFormData({
          ...formData,
          positions: [...formData.positions, newPositionData.id],
        });
        toast.success("New position added!");
      } catch (error) {
        toast.error(error?.message ?? "Error adding position!");
      }
    } else {
      console.log("Position is empty. Not submitting.");
    }
  };

  const noOptionsMessage = (input, actionMeta) => {
    if (actionMeta && actionMeta.action === "input-change" && !input) {
      return null;
    }

    const { inputValue } = input;

    return (
      <div>
        No options found.{" "}
        <button
          type="button"
          onClick={async () => {
            console.log(
              "Running with input:",
              inputValue,
              "Current dropdown:",
              currentDropdown
            );

            if (currentDropdown === "unit") {
              await handleAddUnit(inputValue);
            }

            if (currentDropdown === "position") {
              await handleAddPosition(inputValue);
            }
          }}
          className="btn btn-sm btn-primary"
        >
          Add Unit
        </button>
      </div>
    );
  };

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-black">
      <div className="card w-1/2 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">
            {employee ? "Edit Employee" : "Add Employee"}
          </h2>
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered w-full mb-4"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <input
            type="text"
            placeholder="Username"
            className="input input-bordered w-full mb-4"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full mb-4"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <Select
            className="mb-4"
            options={unitOptions}
            value={unitOptions.find(
              (option) => option.value === formData.unitId
            )}
            onChange={handleUnitChange}
            placeholder="Select Unit"
            isClearable
            noOptionsMessage={noOptionsMessage}
            onFocus={() => setCurrentDropdown("unit")}
          />

          <Select
            key={positions.length}
            className="mb-4"
            options={positionOptions}
            value={positionOptions.filter((option) =>
              formData.positions.includes(option.value)
            )}
            onChange={handlePositionChange}
            isMulti
            placeholder="Select Positions"
            isClearable
            noOptionsMessage={noOptionsMessage}
            onFocus={() => setCurrentDropdown("position")}
          />

          <div className="flex justify-end space-x-2">
            <button className="btn btn-sm btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default FormEmployee;
