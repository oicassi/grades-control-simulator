import React, { Fragment } from 'react'
import Action from './Action';
import css from './gradesControl.module.css';

export default function GradesControl({ grades, onDelete, onPersist }) {

	const tableGrades = [];
	let currentStudent = grades[0].student;
	let currentSubject = grades[0].subject;
	let currentGrades = [];
	let id = 1;

	grades.forEach((grade) => {
		if (currentSubject !== grade.subject) {
			tableGrades.push({
				id: id++,
				student: currentStudent,
				subject: currentSubject,
				grades: currentGrades,
			});

			currentSubject = grade.subject;
			currentGrades = [];
		}

		if (currentStudent !== grade.student) {
			currentStudent = grade.student;
		}

		currentGrades.push(grade);
	})
	tableGrades.push({
		id: id++,
		student: currentStudent,
		subject: currentSubject,
		grades: currentGrades,
	});


	const handleActionClick = (id, type) => {
		const grade = grades.find(grade => grade.id === id);
		if (type === 'delete') {
			onDelete(grade);
			return;
		}

		onPersist(grade);
	}

	return (
		<Fragment>
			<div>
				{tableGrades.map(({grades, id}) => {
					const finalGrade = grades.reduce((acc, curr) => {
						return acc + curr.value;
					}, 0)
					const finalGradeClass = finalGrade >= 70 ? 'goodGrade' : 'badGrade';
					return (
						<table className={`striped ${css.singleTable}`} key={id}>
							<thead style={{ alignItems: 'center' }}>
								<tr>
									<th style={{width:'20%'}}>Aluno</th>
									<th style={{width:'20%'}}>Disciplina</th>
									<th style={{width:'20%'}}>Avaliação</th>
									<th style={{width:'20%'}}>Nota</th>
									<th style={{width:'20%', textAlign:'center'}}>Ações</th>
								</tr>
							</thead>
							<tbody>
								{grades.map(({ id, student, subject, type, value, isDeleted }) => {
									return (
										<tr key={id}>
											<td>{student}</td>
											<td>{subject}</td>
											<td>{type}</td>
											<td>{isDeleted ? '-' : value}</td>
											<td>
												<div className={css.actionContainer}>
													<Action type={isDeleted ? 'add' : 'edit'} id={id} onActionClick={handleActionClick}/>
													{!isDeleted && <Action type="delete" id={id} onActionClick={handleActionClick}/>}
												</div>
											</td>
										</tr>
									);
								})

								}
							</tbody>
							<tfoot>
								<tr>
									<td>&nbsp;</td>
									<td>&nbsp;</td>
									<td>&nbsp;</td>
									<td style={{fontWeight:'bold', textAlign: 'center'}}>Total</td>
									<td className={css[finalGradeClass]}>{finalGrade}</td>
								</tr>
							</tfoot>
						</table>
					)
				})
				}
			</div>
		</Fragment>
	)
}
