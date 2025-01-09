import { useState, useEffect } from "react";
import FormEmployee from "./FormEmployee";
import api from "../../services/api";
import { toast } from "react-toastify";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    api
      .get("/employees")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      api
        .delete(`/employees/${id}`)
        .then(() => {
          setEmployees(employees.filter((employee) => employee.id !== id));
        })
        .catch((err) => console.log(err));
    }
  };

  const handleSave = () => {
    api
      .get("/employees")
      .then((response) => {
        setEmployees(response.data);
        toast.success("changes saved successfully!");
      })
      .catch((err) => toast.error(err?.message ?? "Failed save changes!"));
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Employee List</h2>

      <div className="divider" />

      <button onClick={handleAdd} className="btn btn-sm btn-primary mb-4">
        Add Employee
      </button>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Password</th>
              <th>Unit</th>
              <th>Positions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.username}</td>
                <td>{employee.password}</td>
                <td>{employee.unit?.name}</td>
                <td>
                  {employee?.positions
                    ?.map((position) => position.name)
                    .join(", ")}
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(employee)}
                    className="btn btn-sm btn-primary"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="btn btn-sm btn-danger ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FormEmployee
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        employee={selectedEmployee}
        onSave={handleSave}
      />
    </div>
  );
};

export default EmployeeList;
