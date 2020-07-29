import React, { Fragment, useState, useEffect } from 'react';
import * as api from './api/apiService'
import Spinner from './components/Spinner';
import GradesControl from './components/GradesControl';
import ModalGrade from './components/ModalGrade';

export default function App() {
  const [allGrades, setAllGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchGrades = async () => {
      const res = await api.getAllGrades();
      setTimeout(() => {
        setAllGrades(res)
      }, 2000)
    }
    fetchGrades();

  }, [])

  const handleDelete = async (grade) => {
    const isDeleted = await api.deleteGrade(grade);
    if (isDeleted) {
      const deletedGradeIndex =
        allGrades.findIndex(g => g.id === grade.id);
      const newGrades = Object.assign([], allGrades);
      newGrades[deletedGradeIndex].isDeleted = true;
      newGrades[deletedGradeIndex].value = 0;
      setAllGrades(newGrades);
    }

  }

  const handlePersist = async (grade) => {
    setSelectedGrade(grade);
    setIsModalOpen(true);

  }

  const handlePersistData = async (formData) => {
    setIsModalOpen(false);
    const {id, newValue} = formData;
    const newGrades = Object.assign([], allGrades);
    const gradeToPersist = newGrades.find(grade => grade.id === id);
    gradeToPersist.value= newValue
    if (gradeToPersist.isDeleted) {
      gradeToPersist.isDeleted = false;
      await api.insertGrade(gradeToPersist);
      return;
    }
    await api.updateGrade(gradeToPersist);
  }
  const handleClose = (grade) => {
    setIsModalOpen(false);
  }

  return (
    <div className="container">
      <h1 className="center">Grades control</h1>
      <div>
        {allGrades.length === 0 && <Spinner />}
        {allGrades.length > 0 &&
          <GradesControl
            grades={allGrades}
            onDelete={handleDelete}
            onPersist={handlePersist} />
        }
      </div>
      {isModalOpen && (
        <ModalGrade
          onSave={handlePersistData}
          onClose={handleClose}
          selectedGrade={selectedGrade}
        />
      )}
    </div>
  );
}
