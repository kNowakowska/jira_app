import "../css/Reports.css";
import { Layout, Form, Select, Button, Radio } from "antd";
import { useAppSelector } from "../redux/hooks";
import { useEffect } from "react";
import { getBoards } from "../api/boards";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import getBoardReport from "../documents/BoardReport";
import getUserReport from "../documents/UserReport"
import { ReportType, USER_REPORT_TYPE_MAP, UserReportType } from "../types";

pdfMake.vfs = pdfFonts.pdfMake.vfs;


const Reports = () => {
    const [form] = Form.useForm<{ reportType: ReportType }>();
    const reportType = Form.useWatch("reportType", form);
    const selectedBoard = Form.useWatch("selectedBoard", form);
    const selectedUserType = Form.useWatch("selectedUserType", form);

    const boards = useAppSelector(state => [...(state.boards.owned || []), ...(state.boards.contributed || [])]);
    const currentUser = useAppSelector(state => state.system.user)

    useEffect(() => {
        if (!boards?.length) getBoards();
    }, [])

    const generateReport = () => {
        if (reportType === ReportType.Board) {
            const board = boards?.find(board => board.identifier === selectedBoard)
            if (board) {
                const def = getBoardReport(board)
                pdfMake.createPdf(def).download();
            }
        } else {
            if (currentUser) {
                const def = getUserReport(currentUser, selectedUserType, boards);
                pdfMake.createPdf(def).download();
            }
        }

    };

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
                            <Form.Item label="Wybierz rodzaj raportu" name="selectedUserType">
                                <Radio.Group>
                                    <Radio value={UserReportType.withArchived}>{USER_REPORT_TYPE_MAP[UserReportType.withArchived]}</Radio>
                                    <Radio value={UserReportType.withoutArchived}>{USER_REPORT_TYPE_MAP[UserReportType.withoutArchived]}</Radio>
                                </Radio.Group>
                            </Form.Item>
                            : null
                    }
                    <Form.Item >
                        <Button type="primary" onClick={generateReport} disabled={!selectedBoard && !selectedUserType}>
                            Generuj raport
                        </Button>
                    </Form.Item>
                </Form>
            </Layout.Content>
        </Layout>
    )
}

export default Reports;