import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import * as api from './../api/apiService';
import css from './modal.module.css';


Modal.setAppElement('#root');
export default function ModalGrade({ onSave, onClose, selectedGrade }) {
  const { id, student, subject, type, value } = selectedGrade;

  const [gradeValue, setGradeValue] = useState(value);
  const [gradeValidation, setGradeValidation] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const getValidation = async () => {
      const validation = await api.getValidationFromGradeType(type);
      setGradeValidation(validation);
    }
    getValidation();

  }, [type]);

  useEffect(() => {
    const { minValue, maxValue } = gradeValidation;
    if (gradeValue < minValue || gradeValue > maxValue) {
      setErrorMsg(`O valor da nota deve ser entre ${minValue} e ${maxValue} (inclusive)`);
      return;
    };
    setErrorMsg('');
  }, [gradeValidation, gradeValue])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose(null);
    }
  }

  const handleFormSubmit = () => {
    const formData = {
      id, 
      newValue: gradeValue,
    }
    onSave(formData);
  }

  const handleGradeChange = (event) => {
    setGradeValue(+event.target.value)
  }

  const handleClose = () => {
    onClose(null);
  }

  return (
    <div>
      <Modal isOpen={true}>
        <div className={css.titleBar}>
          <span className={css.title}>Manutenção de notas</span>
          <button className='waves-effect waves-light btn red dark-4' onClick={handleClose}>
            X
          </button>
        </div>
        <div className={`${css.geral} container`}>
          <div>
            <form onSubmit={handleFormSubmit}>
              <div className='input-field'>
                <input id="inputName" type="text" value={student} readOnly />
                <label className="active" htmlFor="inputName">
                  Nome do aluno:
                </label>
              </div>
              <div className='input-field'>
                <input id="inputSubject" type="text" value={subject} readOnly />
                <label className="active" htmlFor="inputSubject">
                  Disciplina:
                </label>
              </div>
              <div className='input-field'>
                <input id="inputType" type="text" value={type} readOnly />
                <label className="active" htmlFor="inputType">
                  Tipo de avaliação:
                </label>
              </div>
              <div className="input-field">
                <input
                  id="inputGrade"
                  type="number"
                  min={gradeValidation.minValue}
                  max={gradeValidation.maxValue}
                  step="1"
                  autoFocus
                  value={gradeValue}
                  onChange={handleGradeChange}
                />
                <label className="active" htmlFor="inputGrade">
                  Nota:
                </label>
              </div>
            </form>
          </div>

          <div className={css.footerActions}>
            <div>
              <button className='waves-effect waves-light btn'
                disabled={errorMsg.trim() !== ''} onClick={handleFormSubmit}>
                Salvar
              </button>
            </div>
            <span className={css.errMsg}>
              {errorMsg}
            </span>
          </div>
        </div>
      </Modal>
    </div>
  )
}
