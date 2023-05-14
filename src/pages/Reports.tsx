import "../css/Reports.css";
import { Layout, Form, Select, Button } from "antd";
import { useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";
import { getBoards } from "../api/boards";
import { UserType } from "../types";

enum ReportType {
    None = "Brak",
    Board = "Tabele",
    User = "Użytkownicy"
}

const Reports = () => {
    const [form] = Form.useForm<{ reportType: ReportType }>();
    const reportType = Form.useWatch("reportType", form);
    const selectedBoard = Form.useWatch("selectedBoard", form);
    const selectedUser = Form.useWatch("selectedUser", form);

    const boards = useAppSelector(state => state.boards.owned);
    const [users, setUsers] = useState<UserType[]>([])

    useEffect(() => {
        if (!boards?.length) getBoards();
    }, [])

    useEffect(() => {
        let usersTmp: UserType[] = [];
        if (boards) {
            usersTmp = boards.map(board => [board.owner, ...board.contributors]).flat();
            usersTmp = usersTmp.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.identifier === value.identifier
                ))
            )
        }
        setUsers(usersTmp)
    }, [boards])

    const generateReport = () => {
        console.log("report")
    }

    return (
        <Layout>
            <Layout.Content className="reports-container">
                <Form
                    layout="horizontal"
                    form={form}
                    className="report-form"
                >
                    <Form.Item label="Wybierz typ raportu" name="reportType" initialValue={ReportType.None}>
                        <Select style={{ minWidth: 150 }}>
                            <Select.Option value={ReportType.None}>{ReportType.None}</Select.Option>
                            <Select.Option value={ReportType.Board}>{ReportType.Board}</Select.Option>
                            <Select.Option value={ReportType.User}>{ReportType.User}</Select.Option>
                        </Select>
                    </Form.Item>
                    {reportType === ReportType.Board ?
                        <Form.Item label="Wybierz projekt" name="selectedBoard">
                            <Select style={{ minWidth: 150 }}>
                                {boards?.map(board => <Select.Option value={board.identifier} key={board.identifier}>{board.name}</Select.Option>)}
                            </Select>
                        </Form.Item>
                        : reportType === ReportType.User ?
                            <Form.Item label="Wybierz użytkownika" name="selectedUser">
                                <Select style={{ minWidth: 150 }}>
                                    {users?.map(user => <Select.Option value={user.identifier} key={user.identifier}>{`${user.firstname} ${user.surname}`}</Select.Option>)}
                                </Select>
                            </Form.Item>
                            : null
                    }
                    <Form.Item >
                        <Button type="primary" onClick={generateReport} disabled={!selectedBoard && !selectedUser}>
                            Generate report
                        </Button>
                    </Form.Item>
                </Form>
            </Layout.Content>
        </Layout>
    )
}

export default Reports;