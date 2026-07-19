import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import { createEmployee, updateEmployee, getEmployeeById } from '../api/employeeApi.js';
import EmployeeForm from '../components/EmployeeForm.jsx';
import { SkeletonForm } from '../components/Skeleton.jsx';

const EmployeeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [initialData, setInitialData] = useState(null);
  const [pageLoading, setPageLoading] = useState(isEditing);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      getEmployeeById(id)
        .then((res) => {
          setInitialData(res.data);
          setPageLoading(false);
        })
        .catch(() => {
          toast.error('Failed to load employee data.');
          navigate('/employees');
        });
    }
  }, [id, isEditing, navigate]);

  const handleSubmit = async (formData) => {
    setSubmitLoading(true);
    try {
      if (isEditing) {
        await updateEmployee(id, formData);
        toast.success('Employee updated successfully.');
      } else {
        await createEmployee(formData);
        toast.success('Employee created successfully.');
      }
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/employees')}
          className="text-gray-500 hover:text-ink text-sm flex items-center gap-2 mb-2 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Directory
        </button>
        <h1 className="text-ink text-2xl font-bold">
          {isEditing ? 'Edit Employee' : 'Add New Employee'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isEditing
            ? 'Update profile and employment details.'
            : 'Create a new employee profile in the system.'}
        </p>
      </div>

      {/* Form Area */}
      {pageLoading ? (
        <SkeletonForm />
      ) : (
        <EmployeeForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/employees')}
          loading={submitLoading}
        />
      )}
    </div>
  );
};

export default EmployeeFormPage;
