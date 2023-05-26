import { COLUMN_TYPE_MAP } from '../constants';
import { BoardType, TaskType, UserReportType, UserType } from '../types';
import { Alignment, Margins, StyleDictionary } from "pdfmake/interfaces";


const getUserReport = (user: UserType, type: UserReportType, boards: Array<BoardType>) => {
    const ownedBoards = boards.filter(board => board.owner.identifier === user.identifier);
    const contributedBoards = boards.filter(board => board.owner.identifier !== user.identifier)

    const activeTasks = [...(ownedBoards?.map(board => board.tasks).flat() || []), ...(contributedBoards?.map(board => board.tasks).flat() || [])].filter(task => !task.isDeleted && !task.isArchived)
    const archivedTasks = [...(ownedBoards?.map(board => board.tasks).flat() || []), ...(contributedBoards?.map(board => board.tasks).flat() || [])].filter(task => task.isArchived && !task.isDeleted)

    const getTasksRows = (tasks: Array<TaskType>) => tasks.map((task: TaskType) => [task.taskNumber, task.title, COLUMN_TYPE_MAP[task.boardColumn], task.taskPriority, (task.loggedTime || "-")])

    const generateTasksTable = () => {
        const estimation = activeTasks.reduce((acc: number, task: TaskType) => acc + (task.loggedTime || 0), 0)
        return activeTasks.length ? {
            style: 'tableExample',
            table: {
                headerRows: 2,
                widths: ['*', '*', "*", '*', '*'],
                body: [
                    [{ text: 'Numer', style: "tableHeader" }, { text: 'Tytuł', style: "tableHeader" }, { text: 'Status', style: "tableHeader" }, { text: 'Priorytet', style: "tableHeader" }, { text: "Wycena", style: "tableHeader" }],
                    ...getTasksRows(activeTasks),
                    [{ text: `Liczba zadań: ${activeTasks.length}`, colSpan: 3, alignment: "center" as Alignment }, {}, {}, { text: `Wycena: ${estimation}`, colSpan: 2, alignment: "center" as Alignment }, {}]
                ]
            },
            layout: {
                fillColor: function (rowIndex: number) {
                    return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                }
            }
        } : {
            text: `Brak aktywnych zadan"`,
            margin: [0, 10] as Margins
        }
    }

    const generateArchivedTasksTable = () => {
        const estimation = archivedTasks.reduce((acc: number, task: TaskType) => acc + (task.loggedTime || 0), 0)
        return archivedTasks.length ? {
            style: 'tableExample',
            table: {
                headerRows: 2,
                widths: ['*', '*', "*", '*', '*'],
                body: [
                    [{ text: 'Numer', style: "tableHeader" }, { text: 'Tytuł', style: "tableHeader" }, { text: 'Status', style: "tableHeader" }, { text: 'Priorytet', style: "tableHeader" }, { text: "Wycena", style: "tableHeader" }],
                    ...getTasksRows(archivedTasks),
                    [{ text: `Liczba zadań: ${archivedTasks.length}`, colSpan: 3, alignment: "center" as Alignment }, {}, {}, { text: `Wycena: ${estimation}`, colSpan: 2, alignment: "center" as Alignment }, {}]
                ]
            },
            layout: {
                fillColor: function (rowIndex: number) {
                    return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                }
            }
        } : {
            text: `Brak zadań archiwalnych.`,
            margin: [0, 10] as Margins
        }
    }

    const docDefinition = {
        content: [
            { text: `Raport: ${user.firstname} ${user.surname}`, style: "header", alignment: "center" as Alignment, margin: [0, 20] as Margins, fontSize: 16, bold: true },
            {
                columns: [
                    {
                        width: "50%",
                        text: `Data rejestracji: ${user.registered ? new Date(user.registered).toLocaleDateString("pl-PL") : " - "}`
                    },
                    {
                        width: "50%",
                        text: `Email: ${user.email}`
                    }
                ]
            },
            { text: `Utworzone zadania:`, margin: [0, 20, 0, 5] as Margins },
            {
                ul: ownedBoards ? ownedBoards?.map(board => board.name) : []
            },
            { text: `Współtworzone zadania:`, margin: [0, 20, 0, 5] as Margins },
            {
                ul: contributedBoards ? contributedBoards?.map(board => board.name) : []
            },
            { text: "Aktywne zadania: ", margin: [0, 20, 0, 5] as Margins },
            generateTasksTable(),
        ],
        styles: {
            tableExample: {
                margin: [0, 5, 0, 15],
            } as StyleDictionary,
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        },
    }

    if (type === UserReportType.withArchived) {
        docDefinition.content.push({ text: "Archiwalne zadania: ", margin: [0, 20, 0, 5] as Margins })
        docDefinition.content.push(generateArchivedTasksTable())
    }
    return docDefinition;
};

export default getUserReport;