import { COLUMN_TYPE_MAP } from '../constants';
import { BoardType, ColumnType, TaskType } from '../types';
import { Alignment, Margins, StyleDictionary } from "pdfmake/interfaces";


const getBoardReport = (board: BoardType) => {
    const getActive = () => board.tasks.filter(task => !task.isArchived && !task.isDeleted);
    const getArchived = () => board.tasks.filter(task => task.isArchived && !task.isDeleted);
    const getActiveEstimation = () => getActive().reduce(
        (accumulator, task) => accumulator + (task.loggedTime || 0),
        0
    );
    const getArchivedEstimation = () => getArchived().reduce(
        (accumulator, task) => accumulator + (task.loggedTime || 0),
        0
    )

    const getTasksRows = (status: ColumnType) => {
        return getActive().filter(task => task.boardColumn === status).map(({ taskNumber, title, taskPriority, reporter, assignedUser, loggedTime }) => [taskNumber, title, taskPriority, (reporter ? `${reporter.firstname} ${reporter.surname}` : "-"), (assignedUser ? `${assignedUser.firstname} ${assignedUser.surname}` : "-"), loggedTime || "-"]) || []
    }
    const getArchivedTasksRows = () => {
        return getArchived().map(({ taskNumber, title, taskPriority, reporter, assignedUser, loggedTime }) => [taskNumber, title, taskPriority, (reporter ? `${reporter.firstname} ${reporter.surname}` : "-"), (assignedUser ? `${assignedUser.firstname} ${assignedUser.surname}` : "-"), loggedTime || "-"]) || []
    }

    const getTasksNumerByUserId = (userId: string) => {
        return board.tasks.filter(task => task.assignedUser?.identifier === userId).length
    }

    const generateTasksTables = (status: ColumnType) => {
        const tasks = getTasksRows(status);
        const estimation = getActive().filter(task => task.boardColumn === status).reduce((acc: number, task: TaskType) => acc + (task.loggedTime || 0), 0)
        return tasks.length ? {
            style: 'tableExample',
            table: {
                headerRows: 2,
                widths: ['*', '*', "*", '*', '*', '*'],
                body: [
                    [{ text: COLUMN_TYPE_MAP[status], colSpan: 6, alignment: "center", style: "tableHeader" }, {}, {}, {}, {}, {}],
                    [{ text: 'Numer', style: "tableHeader" }, { text: 'Tytuł', style: "tableHeader" }, { text: 'Priorytet', style: "tableHeader" }, { text: 'Raportujący', style: "tableHeader" }, { text: "Przypisany", style: "tableHeader" }, { text: "Wycena", style: "tableHeader" }],
                    ...tasks,
                    [{ text: `Liczba zadań: ${tasks.length}`, colSpan: 3, alignment: "center" }, {}, {}, { text: `Wycena: ${estimation}`, colSpan: 3, alignment: "center" }, {}, {}]
                ]
            },
            layout: {
                fillColor: function (rowIndex: number) {
                    return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                }
            }
        } : {
            text: `Brak zadań o statusie "${COLUMN_TYPE_MAP[status]}"`,
            margin: [0, 10] as Margins
        }
    }

    const generateArchivedTasksTable = () => {
        const tasks = getArchivedTasksRows();
        const estimation = getArchived().reduce((acc: number, task: TaskType) => acc + (task.loggedTime || 0), 0)
        return tasks.length ? {
            style: 'tableExample',
            table: {
                headerRows: 2,
                widths: ['*', '*', "*", '*', '*', '*'],
                body: [
                    [{ text: "Archiwalne", colSpan: 6, alignment: "center", style: "tableHeader" }, {}, {}, {}, {}, {}],
                    [{ text: 'Numer', style: "tableHeader" }, { text: 'Tytuł', style: "tableHeader" }, { text: 'Priorytet', style: "tableHeader" }, { text: 'Raportujący', style: "tableHeader" }, { text: "Przypisany", style: "tableHeader" }, { text: "Wycena", style: "tableHeader" }],
                    ...tasks,
                    [{ text: `Liczba zadań: ${tasks.length}`, colSpan: 3, alignment: "center" }, {}, {}, { text: `Wycena: ${estimation}`, colSpan: 3, alignment: "center" }, {}, {}]
                ]
            },
            layout: {
                fillColor: function (rowIndex: number) {
                    return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                }
            }
        } : {
            text: `Brak zarchiwizowanych zadań.`,
            margin: [0, 10] as Margins
        }
    }

    const docDefinition = {
        content: [
            { text: `Raport: ${board.name} [${board.shortcut}]`, style: "header", alignment: "center" as Alignment, margin: [0, 20] as Margins, fontSize: 16, bold: true },
            {
                columns: [
                    {
                        width: "50%",
                        text: `Autor: ${board.owner.firstname} ${board.owner.surname}`
                    },
                    {
                        width: "50%",
                        text: `Data utworzenia: ${board.createdDate ? new Date(board.createdDate).toLocaleDateString("pl-PL") : " - "}`
                    }
                ]
            },
            { text: `Liczba zadan autora: ${getTasksNumerByUserId(board.owner.identifier)}`, margin: [0, 20, 0, 5] as Margins },
            { text: "Użytkownicy współtworzący: ", margin: [0, 20, 0, 5] as Margins },
            {
                ul: board.contributors.map(user => `${user.firstname} ${user.surname} (Liczba zadan: ${getTasksNumerByUserId(user.identifier)})`)
            },
            { text: "Zadania: ", margin: [0, 20, 0, 5] as Margins },

            {
                columns: [
                    {
                        width: "50%",
                        text: `Aktywne zadania (Liczba: ${getActive().length}, Wycena: ${getActiveEstimation()})`
                    },
                    {
                        width: "50%",
                        text: `Archiwalne zadania (Liczba: ${getArchived().length}, Wycena: ${getArchivedEstimation()})`
                    }
                ],
            },
            ...(Object.keys(COLUMN_TYPE_MAP).map((columnType: string) => generateTasksTables(columnType as ColumnType))),
            generateArchivedTasksTable()
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
    return docDefinition;
};

export default getBoardReport;